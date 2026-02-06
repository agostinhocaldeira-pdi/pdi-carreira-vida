import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AUDIO_FILENAME = "habilidades-explanation-audio.mp3";
const STORAGE_BUCKET = "stoic-audio";

export const useHabilidadesExplanationAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if audio exists in storage on mount
  useEffect(() => {
    const checkExistingAudio = async () => {
      try {
        const { data } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(AUDIO_FILENAME);

        if (data?.publicUrl) {
          // Check if file actually exists
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setAudioUrl(data.publicUrl);
          }
        }
      } catch (error) {
        console.log("Audio not found in cache");
      }
    };

    checkExistingAudio();
  }, []);

  const generateAudio = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-explanation-audio', {
        body: { type: 'habilidades' }
      });

      if (error) {
        console.error("Error generating audio:", error);
        return null;
      }

      if (data?.results?.habilidades?.audioUrl) {
        return data.results.habilidades.audioUrl;
      }

      return null;
    } catch (error) {
      console.error("Error calling generate-explanation-audio:", error);
      return null;
    }
  }, []);

  const toggleAudio = useCallback(async () => {
    // If already playing, stop
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      let url = audioUrl;

      // If we don't have the URL yet, try to generate
      if (!url) {
        url = await generateAudio();
        if (url) {
          setAudioUrl(url);
        }
      }

      if (!url) {
        console.error("Could not get audio URL");
        setIsLoading(false);
        return;
      }

      // Create or reuse audio element
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          console.error("Audio playback error");
          setIsPlaying(false);
        };
      } else {
        audioRef.current.src = url;
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  }, [audioUrl, isPlaying, generateAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    toggleAudio,
    hasAudio: !!audioUrl
  };
};
