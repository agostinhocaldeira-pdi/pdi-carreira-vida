import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_BUCKET = "stoic-audio";
const AUDIO_FILE_NAME = "vvd-explanation-audio.mp3";
const ENABLE_GENERATION_DATE = new Date("2026-01-31");

// Full text of VVD explanation for audio generation
const VVD_EXPLANATION_TEXT = `
A importância de saber claramente o que você quer para sua vida.

Por que este exercício é essencial:
A maioria das pessoas vive resolvendo urgências, cumprindo tarefas e reagindo às circunstâncias, sem nunca ter parado para definir com clareza que vida deseja construir.
Sem essa definição, qualquer objetivo parece confuso, qualquer meta perde força e qualquer esforço corre o risco de não levar ao lugar certo.
A VVD – Visão de Vida Desejada existe para romper esse ciclo.
Este exercício não é sobre sonhar de forma vaga ou criar fantasias irreais. Ele é sobre clareza estratégica.

O que a VVD faz por você:
Ao construir sua Visão de Vida Desejada, você define como quer viver, não apenas o que quer conquistar.
Você dá sentido às decisões de carreira, dinheiro, rotina, relacionamentos e crescimento pessoal.
Cria um norte claro para todas as metas e ações futuras.
Reduz conflitos internos, indecisão e sensação de estar perdido.
Passa a avaliar escolhas com base em alinhamento, não apenas em oportunidade.
Sem uma visão clara, metas viram obrigações. Com uma visão clara, metas passam a ser meios.

Por que a VVD vem antes de metas e ações:
No sistema PDI, nada começa por tarefas ou listas de objetivos isolados.
A lógica é simples: Ações corretas só existem quando a direção está clara.
A VVD é a base sobre a qual todo o seu PDI será construído. Ela orienta quais objetivos fazem sentido para você, quais metas devem ser priorizadas, quais esforços valem a pena e o que deve ser evitado, mesmo que pareça uma boa oportunidade.
Sem a VVD, você pode até avançar, mas corre o risco de avançar na direção errada.

Como encarar este exercício:
Faça a VVD com calma, honestidade e profundidade.
Não escreva o que fica bonito, nem o que os outros esperam de você. Escreva o que realmente representa a vida que você quer viver, na prática, no dia a dia.
Este não é um exercício para agradar ninguém. É um exercício para alinhar sua vida com quem você é e com o que você quer construir.

Lembre-se:
A VVD não engessa sua vida. Ela organiza.
Ela não tira liberdade. Ela aumenta sua consciência sobre as escolhas que você faz.
Tudo o que você construir daqui para frente no PDI parte daqui. Quanto mais clara for sua Visão de Vida Desejada, mais consistente, leve e eficaz será sua jornada.
`;

export const useVvdExplanationAudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canGenerateAudio = () => {
    const now = new Date();
    return now >= ENABLE_GENERATION_DATE;
  };

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
    if (!canGenerateAudio()) {
      toast.info("O áudio estará disponível a partir de 31/01/2026");
      return null;
    }

    try {
      console.log("Generating VVD explanation audio...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: VVD_EXPLANATION_TEXT }),
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

      console.log("VVD audio generated and stored successfully");
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error generating VVD audio:", error);
      toast.error("Erro ao gerar áudio. Tente novamente mais tarde.");
      return null;
    }
  };

  const playAudio = useCallback(async () => {
    setIsLoading(true);

    try {
      // First, check if audio already exists in storage
      let url = audioUrl || await getStoredAudioUrl();

      // If not, generate it (if allowed by date)
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
    canGenerateAudio: canGenerateAudio(),
  };
};
