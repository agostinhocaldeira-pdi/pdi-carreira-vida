import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Loader2, Send, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface StoicReflection {
  title: string;
  text: string;
  question: string;
}

interface StoicInteractiveExperienceProps {
  reflection: StoicReflection;
  date: Date;
  stoicResponse: string;
  onStoicResponseChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}

type ExperiencePhase = "idle" | "playing" | "text-animation" | "question" | "completed";

const StoicInteractiveExperience = ({
  reflection,
  date,
  stoicResponse,
  onStoicResponseChange,
  onSave,
  isSaving,
  canSave,
}: StoicInteractiveExperienceProps) => {
  const [phase, setPhase] = useState<ExperiencePhase>("idle");
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textAnimationRef = useRef<NodeJS.Timeout | null>(null);

  const dateKey = format(date, "MM-dd");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (textAnimationRef.current) {
        clearTimeout(textAnimationRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Check if audio already exists
  const checkExistingAudio = useCallback(async () => {
    const { data } = await supabase
      .from("stoic_reflection_audio")
      .select("audio_url")
      .eq("date_key", dateKey)
      .maybeSingle();

    return data?.audio_url || null;
  }, [dateKey]);

  // Generate and save audio
  const generateAudio = async (): Promise<string> => {
    // Only narrate the title
    const textToNarrate = reflection.title;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: textToNarrate }),
      }
    );

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    const audioBlob = await response.blob();

    // Upload to storage
    const fileName = `${dateKey}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("stoic-audio")
      .upload(fileName, audioBlob, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Still create a local URL even if upload fails
      return URL.createObjectURL(audioBlob);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("stoic-audio")
      .getPublicUrl(fileName);

    // Save to database
    await supabase.from("stoic_reflection_audio").upsert(
      {
        date_key: dateKey,
        audio_url: urlData.publicUrl,
        title: reflection.title,
      },
      { onConflict: "date_key" }
    );

    return urlData.publicUrl;
  };

  // Animate text with typewriter effect
  const animateText = useCallback((fullText: string, onComplete: () => void) => {
    let index = 0;
    const words = fullText.split(" ");
    
    const animate = () => {
      if (index < words.length) {
        setDisplayedText(words.slice(0, index + 1).join(" "));
        index++;
        textAnimationRef.current = setTimeout(animate, 120); // ~120ms per word
      } else {
        onComplete();
      }
    };
    
    animate();
  }, []);

  // Start the experience
  const handleStart = async () => {
    if (phase === "playing" || phase === "text-animation") {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (textAnimationRef.current) {
        clearTimeout(textAnimationRef.current);
      }
      setPhase("idle");
      return;
    }

    setIsLoadingAudio(true);
    setDisplayedText("");
    setShowQuestion(false);

    try {
      // Check for existing audio first
      let url = await checkExistingAudio();
      
      if (!url) {
        url = await generateAudio();
      }

      setAudioUrl(url);
      
      // Create and play audio
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onplay = () => {
        setPhase("playing");
        // Start text animation after a short delay
        setTimeout(() => {
          setPhase("text-animation");
          animateText(reflection.text, () => {
            // Show question after text animation
            setShowQuestion(true);
            setPhase("question");
          });
        }, 500);
      };

      audio.onended = () => {
        // Audio ended, but text animation might still be running
        // The animation will handle phase transitions
      };

      audio.onerror = () => {
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir o áudio.",
          variant: "destructive",
        });
        setPhase("idle");
      };

      await audio.play();
    } catch (error) {
      console.error("Error starting experience:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a experiência. Tente novamente.",
        variant: "destructive",
      });
      setPhase("idle");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Reset experience
  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (textAnimationRef.current) {
      clearTimeout(textAnimationRef.current);
    }
    setPhase("idle");
    setDisplayedText("");
    setShowQuestion(false);
  };

  const isActive = phase !== "idle";

  return (
    <div className="space-y-6">
      {/* Experience Container */}
      <div 
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-500",
          "bg-gradient-to-br from-primary/10 via-card to-primary/5",
          "border border-primary/20",
          isActive ? "min-h-[300px]" : "min-h-[120px]"
        )}
      >
        {/* Title - Always visible */}
        <div className={cn(
          "p-6 transition-all duration-500",
          isActive && "pb-2"
        )}>
          <h4 className={cn(
            "font-bold text-primary transition-all duration-500",
            isActive ? "text-lg" : "text-xl",
            phase === "playing" && "animate-pulse"
          )}>
            {reflection.title}
          </h4>
        </div>

        {/* Animated Text */}
        {isActive && (
          <div className="px-6 pb-4">
            <p className={cn(
              "text-foreground/90 leading-relaxed transition-opacity duration-300",
              displayedText ? "opacity-100" : "opacity-0"
            )}>
              {displayedText}
              {phase === "text-animation" && (
                <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
              )}
            </p>
          </div>
        )}

        {/* Question with animation */}
        {showQuestion && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-primary font-medium italic">
                "{reflection.question}"
              </p>
            </div>
          </div>
        )}

        {/* Play/Pause Button */}
        <div className={cn(
          "absolute transition-all duration-300",
          isActive ? "bottom-4 right-4" : "top-1/2 right-6 -translate-y-1/2"
        )}>
          <div className="flex gap-2">
            {isActive && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="rounded-full shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={handleStart}
              disabled={isLoadingAudio}
              size={isActive ? "icon" : "default"}
              className={cn(
                "shadow-md transition-all duration-300",
                isActive ? "rounded-full" : "rounded-lg gap-2"
              )}
            >
              {isLoadingAudio ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isActive ? (
                <Pause className="w-5 h-5" />
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Iniciar Reflexão</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Response Field - Only visible after question appears */}
      {showQuestion && (
        <div className="space-y-3 animate-fade-in">
          <label className="text-sm font-medium text-muted-foreground">
            Sua resposta à reflexão:
          </label>
          <Textarea
            value={stoicResponse}
            onChange={(e) => onStoicResponseChange(e.target.value)}
            placeholder="Escreva sua reflexão sobre a pergunta acima..."
            className="min-h-[100px] resize-none border-primary/20 focus:border-primary/40"
          />
          <div className="flex justify-end">
            <Button
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Salvar Reflexão
            </Button>
          </div>
        </div>
      )}

      {/* Static version for when not playing - shows question and response */}
      {phase === "idle" && stoicResponse && (
        <div className="space-y-3 pt-2">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic">
              "{reflection.question}"
            </p>
          </div>
          <Textarea
            value={stoicResponse}
            onChange={(e) => onStoicResponseChange(e.target.value)}
            placeholder="Escreva sua reflexão..."
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={onSave}
              disabled={!canSave || isSaving}
              size="sm"
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoicInteractiveExperience;
