import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_BUCKET = "stoic-audio";

const AUDIO_FILENAMES: Record<string, string> = {
  meta: "meta-explanation-audio.mp3",
  acao: "acao-explanation-audio.mp3",
  passo: "passo-explanation-audio.mp3",
  diario: "diario-explanation-audio.mp3",
};

export const useExplanationAudio = (type: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filename = AUDIO_FILENAMES[type];

  useEffect(() => {
    if (!filename) return;
    const checkExistingAudio = async () => {
      try {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
        if (data?.publicUrl) {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setAudioUrl(data.publicUrl);
          }
        }
      } catch {
        console.log(`Audio not found for ${type}`);
      }
    };
    checkExistingAudio();
  }, [filename, type]);

  const generateAudio = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-explanation-audio', {
        body: { type }
      });
      if (error) return null;
      if (data?.results?.[type]?.audioUrl) {
        return data.results[type].audioUrl;
      }
      return null;
    } catch {
      return null;
    }
  }, [type]);

  const toggleAudio = useCallback(async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      let url = audioUrl;
      if (!url) {
        url = await generateAudio();
        if (url) setAudioUrl(url);
      }
      if (!url) {
        setIsLoading(false);
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => setIsPlaying(false);
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { isPlaying, isLoading, toggleAudio };
};
