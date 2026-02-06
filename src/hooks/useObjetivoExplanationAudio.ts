import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_BUCKET = "stoic-audio";
const AUDIO_FILE_NAME = "objetivo-explanation-audio.mp3";

export const useObjetivoExplanationAudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-check if audio exists on mount
  useEffect(() => {
    const checkAudioExists = async () => {
      try {
        const { data } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(AUDIO_FILE_NAME);
        
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        
        if (response.ok) {
          setAudioUrl(data.publicUrl);
          setIsPreloaded(true);
        }
      } catch {
        // Audio not available yet
      }
    };
    checkAudioExists();
  }, []);

  const getStoredAudioUrl = async (): Promise<string | null> => {
    try {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(AUDIO_FILE_NAME);
      
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return data.publicUrl;
      }
      return null;
    } catch {
      return null;
    }
  };

  const generateAudio = async (): Promise<string | null> => {
    try {
      console.log("Triggering objetivo explanation audio generation...");
      
      const { data, error } = await supabase.functions.invoke('generate-explanation-audio', {
        body: { type: 'objetivo' }
      });

      if (error) {
        console.error("Error generating audio:", error);
        throw error;
      }

      if (data?.results?.objetivo?.audioUrl) {
        return data.results.objetivo.audioUrl;
      }

      if (data?.results?.objetivo?.unavailable) {
        toast.info("Áudio temporariamente indisponível");
        return null;
      }

      return null;
    } catch (error) {
      console.error("Error generating objetivo audio:", error);
      toast.error("Erro ao gerar áudio. Tente novamente mais tarde.");
      return null;
    }
  };

  const playAudio = useCallback(async () => {
    setIsLoading(true);

    try {
      // First, check if audio already exists in storage
      let url = audioUrl || await getStoredAudioUrl();

      // If not found, trigger generation
      if (!url) {
        url = await generateAudio();
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
    isPreloaded,
    toggleAudio,
    playAudio,
    stopAudio,
  };
};
