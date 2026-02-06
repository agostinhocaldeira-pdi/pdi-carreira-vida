import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_BUCKET = "stoic-audio";
const AUDIO_FILE_NAME = "values-explanation-audio.mp3";

// Full text of Values explanation for audio generation
const VALUES_EXPLANATION_TEXT = `
A importância de conhecer seus valores.

Muitos dos nossos comportamentos, escolhas e conflitos vêm de valores que atuam no piloto automático, sem que a gente tenha consciência deles. Tornar esses valores claros traz benefícios profundos tanto na vida pessoal quanto na profissional.

O que são valores, na prática:
Valores são critérios internos que orientam decisões, definem o que é importante, aceitável ou inegociável para alguém. Eles influenciam o que motiva ou desmotiva, como a pessoa reage a conflitos, que tipo de ambiente gera bem-estar ou sofrimento, e quando ela diz sim ou não.

Benefícios na vida pessoal:

Primeiro: Decisões mais coerentes e menos arrependimento.
Quando a pessoa conhece seus valores, ela escolhe com mais clareza relacionamentos, prioridades de vida e limites pessoais. Isso reduz a sensação de "fiz tudo certo, mas algo está errado".

Segundo: Menos conflitos internos.
Muita ansiedade vem de viver contra os próprios valores. Por exemplo, valorizar liberdade, mas viver preso a expectativas externas. A clareza ajuda a alinhar vida real e identidade.

Terceiro: Relacionamentos mais saudáveis.
Quem conhece seus valores comunica limites com mais segurança, entende melhor por que certos comportamentos do outro incomodam, e evita relações incompatíveis a longo prazo.

Quarto: Maior senso de propósito.
Valores dão direção. A vida deixa de ser só reação a demandas externas e passa a ter um porquê claro.

Benefícios na vida profissional:

Primeiro: Escolhas de carreira mais alinhadas.
Clareza de valores ajuda a responder perguntas como: Esse trabalho combina com o que é importante para mim? O problema é a função, a empresa ou a falta de alinhamento de valores? Isso evita trocar de emprego repetidamente sem entender o motivo do desconforto.

Segundo: Aumento de motivação e engajamento.
Quando o trabalho respeita valores centrais, como autonomia, impacto social ou aprendizado, a energia vem com menos esforço.

Terceiro: Tomada de decisão mais rápida e segura.
Valores funcionam como um filtro para aceitar ou recusar oportunidades, negociar propostas e definir prioridades em ambientes de pressão.

Quarto: Liderança e comunicação mais autênticas.
Profissionais que conhecem seus valores lideram com mais consistência, transmitem confiança e tomam decisões que fazem sentido mesmo sob crítica.

Por que usar a ferramenta, e não só pensar sobre isso?
Ferramentas ajudam porque tiram os valores do nível abstrato, revelam conflitos entre valores como segurança versus liberdade, diferenciam valores reais de valores aprendidos ou impostos, e evitam vieses e autoengano.

Elas aceleram um processo que, sozinho, pode levar anos.
`;

export const useValuesExplanationAudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getStoredAudioUrl = async (): Promise<string | null> => {
    try {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(AUDIO_FILE_NAME);
      
      // Check if the file actually exists by trying to fetch it
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return data.publicUrl;
      }
      return null;
    } catch {
      return null;
    }
  };

  const generateAndStoreAudio = async (): Promise<string | null> => {
    try {
      console.log("Generating Values explanation audio...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: VALUES_EXPLANATION_TEXT }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      // Check if service is unavailable
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const jsonResponse = await response.json();
        if (jsonResponse.unavailable) {
          toast.error("Serviço de áudio temporariamente indisponível");
          return null;
        }
      }

      const audioBlob = await response.blob();
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(AUDIO_FILE_NAME, audioBlob, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading audio:", uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(AUDIO_FILE_NAME);

      console.log("Values audio generated and stored successfully");
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error generating Values audio:", error);
      toast.error("Erro ao gerar áudio. Tente novamente mais tarde.");
      return null;
    }
  };

  const playAudio = useCallback(async () => {
    setIsLoading(true);

    try {
      // First, check if audio already exists in storage
      let url = audioUrl || await getStoredAudioUrl();

      // If not, generate it
      if (!url) {
        url = await generateAndStoreAudio();
      }

      if (!url) {
        setIsLoading(false);
        return;
      }

      setAudioUrl(url);

      // Create or reuse audio element
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          toast.error("Erro ao reproduzir áudio");
        };
      }

      audioRef.current.src = url + `?t=${Date.now()}`; // Cache bust
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Erro ao reproduzir áudio");
    } finally {
      setIsLoading(false);
    }
  }, [audioUrl]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, playAudio, stopAudio]);

  return {
    isLoading,
    isPlaying,
    toggleAudio,
    playAudio,
    stopAudio,
  };
};
