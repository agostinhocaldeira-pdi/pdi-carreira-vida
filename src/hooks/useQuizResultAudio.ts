import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_BUCKET = 'stoic-audio';

export function useQuizResultAudio(resultKey: string | null) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filename = resultKey ? `quiz-result-${resultKey}.mp3` : null;

  // Check if audio already exists in storage
  useEffect(() => {
    if (!filename) return;
    const checkExisting = async () => {
      try {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
        if (data?.publicUrl) {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setAudioUrl(data.publicUrl);
          }
        }
      } catch {
        // Audio not cached yet
      }
    };
    checkExisting();
  }, [filename]);

  const toggleAudio = useCallback(async (narrationText: string) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    let url = audioUrl;

    // If no cached audio, generate and upload
    if (!url && filename) {
      setIsGenerating(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: narrationText }),
          }
        );

        if (!response.ok) {
          console.warn('[QuizAudio] ElevenLabs unavailable');
          setIsGenerating(false);
          return;
        }

        const audioBlob = await response.blob();
        const audioFile = new File([audioBlob], filename, { type: 'audio/mpeg' });

        // Upload to storage (public, shared across all users)
        await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filename, audioFile, { upsert: true });

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
        if (data?.publicUrl) {
          url = data.publicUrl;
          setAudioUrl(url);
        }
      } catch (error) {
        console.warn('[QuizAudio] Error generating audio:', error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (!url) return;

    // Play audio
    if (!audioRef.current || audioRef.current.src !== url) {
      audioRef.current = new Audio(url);
      audioRef.current.playbackRate = 1.05;
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => setIsPlaying(false);
    }

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing quiz audio:', error);
    }
  }, [audioUrl, isPlaying, filename]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { isPlaying, isGenerating, toggleAudio, audioUrl };
}
