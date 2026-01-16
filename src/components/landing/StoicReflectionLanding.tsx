import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, Volume2, BookOpen, Sparkles, MousePointerClick } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Reflexão fixa para a landing page
const LANDING_REFLECTION = {
  title: "Foque no que depende de você",
  text: "No estoicismo, Epicteto ensina que paz vem de direcionar energia apenas ao que está em nossas mãos: escolhas, esforço e postura. Tentar controlar tudo gera ansiedade e frustração. Quando você muda o foco do que não controla para o que controla, a mente se acalma e a ação fica mais clara.",
  question: "O que realmente depende de mim hoje?",
  dateKey: "landing-fixed" // chave fixa para o áudio
};

export const StoicReflectionLanding = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhilosophyModal, setShowPhilosophyModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      // Verifica se já existe áudio para esta reflexão fixa
      const { data: existingAudio } = await supabase
        .from('stoic_reflection_audio')
        .select('audio_url')
        .eq('date_key', LANDING_REFLECTION.dateKey)
        .maybeSingle();

      let audioUrl = existingAudio?.audio_url;

      // Se não existe, gera o áudio
      if (!audioUrl) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-daily-stoic-audio`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              title: LANDING_REFLECTION.title,
              text: LANDING_REFLECTION.text,
              question: LANDING_REFLECTION.question,
              dateKey: LANDING_REFLECTION.dateKey,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to generate audio');
        }

        const data = await response.json();
        audioUrl = data.audioUrl;
      }

      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          console.error('Error playing audio');
        };
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error with audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Reflexões Estóicas Diárias</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sabedoria Milenar Para o Seu Dia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No sistema, você terá acesso diariamente a uma nova reflexão estóica com áudio narrado, 
            para começar o dia com clareza mental e propósito.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {LANDING_REFLECTION.title}
              </h3>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
              {LANDING_REFLECTION.text}
            </p>

            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-primary font-medium italic">
                "{LANDING_REFLECTION.question}"
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePlayAudio}
                disabled={isLoading}
                className="flex items-center gap-2 w-fit"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    <span>Gerando áudio...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="h-5 w-5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Ouvir Reflexão</span>
                  </>
                )}
                <Volume2 className="h-4 w-4 ml-1 text-muted-foreground" />
              </Button>

              <button
                onClick={() => setShowPhilosophyModal(true)}
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 underline underline-offset-4 text-sm font-medium transition-colors text-left group"
              >
                <MousePointerClick className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                Entenda mais sobre a Filosofia Estóica aqui
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Filosofia Estóica */}
      <Dialog open={showPhilosophyModal} onOpenChange={setShowPhilosophyModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Conheça a Filosofia Estóica
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <p className="text-muted-foreground leading-relaxed">
              O Estoicismo é uma filosofia prática que surgiu na Grécia Antiga, por volta de 300 a.C., 
              e foi desenvolvida por pensadores como Zenão de Cítio, Epicteto, Sêneca e Marco Aurélio.
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-foreground">
                Princípios Fundamentais
              </h4>
              
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Dicotomia do Controle</h5>
                  <p className="text-sm text-muted-foreground">
                    Distinguir o que podemos controlar (nossas ações, pensamentos e escolhas) do que não podemos 
                    (ações dos outros, eventos externos, resultados).
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Viver com Virtude</h5>
                  <p className="text-sm text-muted-foreground">
                    As quatro virtudes cardeais: Sabedoria, Justiça, Coragem e Temperança guiam uma vida 
                    significativa e ética.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Aceitar a Natureza</h5>
                  <p className="text-sm text-muted-foreground">
                    Viver em harmonia com a natureza e aceitar que mudanças e desafios fazem parte da vida.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Foco no Presente</h5>
                  <p className="text-sm text-muted-foreground">
                    Concentrar-se no momento presente, sem se prender ao passado ou antecipar o futuro 
                    com ansiedade.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-foreground">
                Como o Estoicismo Pode Te Ajudar
              </h4>
              
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Reduzir ansiedade focando no que você pode controlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Desenvolver resiliência emocional diante de adversidades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Melhorar a tomada de decisões com clareza mental</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Construir relacionamentos mais saudáveis com paciência e compreensão</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Encontrar paz interior mesmo em momentos difíceis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Viver de forma mais intencional e alinhada aos seus valores</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/10 p-6 rounded-xl">
              <p className="text-foreground font-medium text-center">
                "Não é o que acontece com você, mas como você reage ao que acontece, que importa."
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">— Epicteto</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
