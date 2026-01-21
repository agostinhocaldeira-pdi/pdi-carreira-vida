import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Loader2, Send, RotateCcw, Volume2 } from "lucide-react";
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

type ExperiencePhase = "idle" | "loading" | "ready" | "playing" | "text-animation" | "question" | "completed";

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
  const [displayedText, setDisplayedText] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [preloadedAudio, setPreloadedAudio] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const questionAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const isPreloadingRef = useRef(false);

  const dateKey = format(date, "MM-dd");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (preloadedAudio) {
        preloadedAudio.pause();
      }
      if (textAnimationRef.current) {
        clearTimeout(textAnimationRef.current);
      }
      if (questionAnimationRef.current) {
        clearTimeout(questionAnimationRef.current);
      }
    };
  }, [preloadedAudio]);

  // Check if audio already exists
  const checkExistingAudio = useCallback(async () => {
    const { data } = await supabase
      .from("stoic_reflection_audio")
      .select("audio_url")
      .eq("date_key", dateKey)
      .maybeSingle();

    return data?.audio_url || null;
  }, [dateKey]);

  // Generate and save audio - narrates title and text only (no question)
  const generateAudio = async (): Promise<string> => {
    // Narrate title and text with pauses (no question - ends with silence)
    const textToNarrate = `${reflection.title}. ... ${reflection.text} ... ... ...`;

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

    // Upload to storage with version suffix for improved audio
    const fileName = `${dateKey}-full-v4.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("stoic-audio")
      .upload(fileName, audioBlob, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
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

  // Preload audio silently in background - doesn't affect UI
  useEffect(() => {
    const preloadAudio = async () => {
      if (isPreloadingRef.current || preloadedAudio) return;
      
      isPreloadingRef.current = true;
      
      try {
        // Check for existing audio first
        let url = await checkExistingAudio();
        
        // If existing audio doesn't have v4 format, generate new
        if (url && !url.includes("-full-v4")) {
          url = null;
        }
        
        if (!url) {
          url = await generateAudio();
        }
        
        // Preload the audio
        const audio = new Audio(url);
        audio.preload = "auto";
        
        await new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => reject(new Error("Failed to load audio"));
          audio.load();
        });
        
        setPreloadedAudio(audio);
      } catch (error) {
        console.error("Error preloading audio:", error);
        // Silently fail - user can still click and we'll try again
      } finally {
        isPreloadingRef.current = false;
      }
    };

    preloadAudio();
  }, [dateKey, reflection.title]);

  // Animate text with typewriter effect
  const animateText = useCallback((fullText: string, setFn: (text: string) => void, onComplete: () => void, speed = 100) => {
    let index = 0;
    const words = fullText.split(" ");
    
    const animate = () => {
      if (index < words.length) {
        setFn(words.slice(0, index + 1).join(" "));
        index++;
        return setTimeout(animate, speed);
      } else {
        onComplete();
        return null;
      }
    };
    
    return animate();
  }, []);

  // Start the experience - try to use preloaded audio, or generate on-the-fly
  const handleStart = async () => {
    if (phase === "playing" || phase === "text-animation" || phase === "question") {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (textAnimationRef.current) {
        clearTimeout(textAnimationRef.current);
      }
      if (questionAnimationRef.current) {
        clearTimeout(questionAnimationRef.current);
      }
      setPhase("idle");
      return;
    }

    setDisplayedText("");
    setDisplayedQuestion("");
    setShowQuestion(false);

    let audio: HTMLAudioElement;

    if (preloadedAudio) {
      // Use preloaded audio - instant start
      audio = preloadedAudio.cloneNode(true) as HTMLAudioElement;
    } else {
      // Audio not ready yet - generate now
      setPhase("loading");
      try {
        let url = await checkExistingAudio();
        if (url && !url.includes("-full-v3")) {
          url = null;
        }
        if (!url) {
          url = await generateAudio();
        }
        audio = new Audio(url);
        setPreloadedAudio(audio);
      } catch (error) {
        console.error("Error generating audio:", error);
        toast({
          title: "Erro ao gerar áudio",
          description: "Tente novamente.",
          variant: "destructive",
        });
        setPhase("idle");
        return;
      }
    }

    audioRef.current = audio;

    audio.onplay = () => {
      setPhase("playing");
      // Start text animation after title is narrated (~2-3 seconds)
      setTimeout(() => {
        setPhase("text-animation");
        textAnimationRef.current = animateText(reflection.text, setDisplayedText, () => {
          // Show question after text animation
          setShowQuestion(true);
          setPhase("question");
          // Animate the question text
          questionAnimationRef.current = animateText(reflection.question, setDisplayedQuestion, () => {
            setPhase("completed");
          }, 80);
        });
      }, 2500);
    };

    audio.onended = () => {
      // Ensure we're at completed phase
      if (phase !== "completed") {
        setDisplayedText(reflection.text);
        setDisplayedQuestion(reflection.question);
        setShowQuestion(true);
        setPhase("completed");
      }
    };

    audio.onerror = () => {
      toast({
        title: "Erro ao reproduzir",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      });
      setPhase("idle");
    };

    audio.play();
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
    if (questionAnimationRef.current) {
      clearTimeout(questionAnimationRef.current);
    }
    setPhase("idle");
    setDisplayedText("");
    setDisplayedQuestion("");
    setShowQuestion(false);
  };

  const isActive = phase === "playing" || phase === "text-animation" || phase === "question" || phase === "completed";
  const isLoading = phase === "loading";

  return (
    <div className="space-y-6">
      {/* Experience Container */}
      <div 
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-500",
          "bg-gradient-to-br from-primary/10 via-card to-primary/5",
          "border border-primary/20",
          isActive ? "min-h-[350px]" : "min-h-[140px] sm:min-h-[120px]"
        )}
      >
        {/* Title and Button Container - Flex layout for mobile */}
        <div className={cn(
          "p-4 sm:p-6 transition-all duration-500",
          isActive && "pb-2",
          !isActive && "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        )}>
          <h4 className={cn(
            "font-bold text-primary transition-all duration-500",
            isActive ? "text-lg" : "text-lg sm:text-xl",
            phase === "playing" && "animate-pulse",
            !isActive && "pr-0 sm:pr-4 flex-1"
          )}>
            {reflection.title}
          </h4>
          
          {/* Mobile Button - Only shown when not active */}
          {!isActive && (
            <div className="sm:hidden">
              <Button
                onClick={handleStart}
                disabled={isLoading}
                size="default"
                className="w-full shadow-md transition-all duration-300 rounded-lg gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Iniciar Reflexão</span>
                    <Volume2 className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}
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

        {/* Question and Response - Inside same container */}
        {showQuestion && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-4">
              {/* Question */}
              <p className={cn(
                "text-primary font-medium italic",
                phase === "question" && "animate-pulse"
              )}>
                "{displayedQuestion || reflection.question}"
                {phase === "question" && displayedQuestion !== reflection.question && (
                  <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
                )}
              </p>
              
              {/* Response Field - Inside the question box */}
              {phase === "completed" && (
                <div className="space-y-3 pt-2 border-t border-primary/20 animate-fade-in">
                  <label className="text-sm font-medium text-muted-foreground">
                    Sua resposta:
                  </label>
                  <Textarea
                    value={stoicResponse}
                    onChange={(e) => onStoicResponseChange(e.target.value)}
                    placeholder="Escreva sua reflexão sobre a pergunta acima..."
                    className="min-h-[100px] resize-none bg-background/50 border-primary/20 focus:border-primary/40"
                  />
                  <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
                    {/* Mobile controls - show inline with save button */}
                    <div className="flex gap-2 sm:hidden">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleReset}
                        className="rounded-full shadow-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleStart}
                        disabled={isLoading}
                        size="icon"
                        className="rounded-full shadow-md"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Pause className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={onSave}
                      disabled={!canSave || isSaving}
                      className="gap-2 w-full sm:w-auto sm:ml-auto"
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
            </div>
          </div>
        )}

        {/* Play/Pause Button - Desktop only when not active, hidden on mobile when completed (controls are inline) */}
        <div className={cn(
          "transition-all duration-300",
          isActive 
            ? cn(
                "absolute bottom-4 right-4",
                phase === "completed" ? "hidden sm:flex" : "flex"
              )
            : "hidden sm:block sm:absolute sm:top-1/2 sm:right-6 sm:-translate-y-1/2"
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
              disabled={isLoading}
              size={isActive ? "icon" : "default"}
              className={cn(
                "shadow-md transition-all duration-300",
                isActive ? "rounded-full" : "rounded-lg gap-2"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isActive ? (
                <Pause className="w-5 h-5" />
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Iniciar Reflexão</span>
                  <Volume2 className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Static version for when ready but not yet started - shows question and existing response */}
      {(phase === "idle" || phase === "ready" || phase === "loading") && stoicResponse && (
        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-4">
            <p className="text-primary font-medium italic">
              "{reflection.question}"
            </p>
            <div className="space-y-3 pt-2 border-t border-primary/20">
              <Textarea
                value={stoicResponse}
                onChange={(e) => onStoicResponseChange(e.target.value)}
                placeholder="Escreva sua reflexão..."
                className="min-h-[80px] resize-none bg-background/50"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default StoicInteractiveExperience;
