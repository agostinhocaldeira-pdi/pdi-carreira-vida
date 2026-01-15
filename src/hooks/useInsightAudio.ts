import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InsightAudio {
  id: string;
  user_id: string;
  audio_url: string;
  insight_text: string;
  created_at: string;
  updated_at: string;
}

export function useInsightAudio(insight: string | null) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load existing audio on mount and when insight changes
  useEffect(() => {
    loadExistingAudio();
  }, []);

  const loadExistingAudio = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_insight_audio')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading insight audio:', error);
        return;
      }

      if (data && data.audio_url) {
        // Check if the stored insight matches the current one
        if (data.insight_text === insight) {
          // Get signed URL for the audio
          const { data: signedData, error: signedError } = await supabase
            .storage
            .from('insight-audio')
            .createSignedUrl(`${user.id}/insight.mp3`, 3600);

          if (signedError) {
            console.error('Error getting signed URL:', signedError);
            return;
          }

          setAudioUrl(signedData.signedUrl);
        } else {
          // Insight changed, clear stored audio
          setAudioUrl(null);
        }
      }
    } catch (error) {
      console.error('Error in loadExistingAudio:', error);
    }
  };

  const generateAudio = useCallback(async () => {
    if (!insight) {
      toast.error('Não há insight para gerar áudio');
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Call ElevenLabs TTS edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: insight }),
        }
      );

      if (!response.ok) {
        console.warn('[InsightAudio] ElevenLabs unavailable - credits may be exhausted');
        return; // Silently fail - audio is optional
      }

      const audioBlob = await response.blob();
      const audioFile = new File([audioBlob], 'insight.mp3', { type: 'audio/mpeg' });

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('insight-audio')
        .upload(`${user.id}/insight.mp3`, audioFile, { upsert: true });

      if (uploadError) {
        throw new Error('Erro ao salvar áudio');
      }

      // Save/update record in database
      const { error: dbError } = await supabase
        .from('user_insight_audio')
        .upsert({
          user_id: user.id,
          audio_url: `${user.id}/insight.mp3`,
          insight_text: insight,
        }, { onConflict: 'user_id' });

      if (dbError) {
        throw new Error('Erro ao salvar registro do áudio');
      }

      // Get signed URL for playback
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from('insight-audio')
        .createSignedUrl(`${user.id}/insight.mp3`, 3600);

      if (signedError) {
        throw new Error('Erro ao obter URL do áudio');
      }

      setAudioUrl(signedData.signedUrl);

    } catch (error) {
      console.warn('[InsightAudio] Error generating audio:', error);
      // Silently fail - audio is optional feature
    } finally {
      setIsGenerating(false);
    }
  }, [insight]);

  const playAudio = useCallback(async () => {
    // If currently playing, stop
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // If no audio URL or insight changed, generate new audio and auto-play
    if (!audioUrl) {
      setIsGenerating(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !insight) {
          setIsGenerating(false);
          return;
        }

        // Call ElevenLabs TTS edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: insight }),
          }
        );

        if (!response.ok) {
          console.warn('[InsightAudio] ElevenLabs unavailable - credits may be exhausted');
          setIsGenerating(false);
          return; // Silently fail
        }

        const audioBlob = await response.blob();
        const audioFile = new File([audioBlob], 'insight.mp3', { type: 'audio/mpeg' });

        // Upload to storage
        await supabase.storage
          .from('insight-audio')
          .upload(`${user.id}/insight.mp3`, audioFile, { upsert: true });

        // Save/update record in database
        await supabase
          .from('user_insight_audio')
          .upsert({
            user_id: user.id,
            audio_url: `${user.id}/insight.mp3`,
            insight_text: insight,
          }, { onConflict: 'user_id' });

        // Get signed URL for playback
        const { data: signedData } = await supabase
          .storage
          .from('insight-audio')
          .createSignedUrl(`${user.id}/insight.mp3`, 3600);

        if (signedData?.signedUrl) {
          setAudioUrl(signedData.signedUrl);
          
          // Auto-play after generation
          const audio = new Audio(signedData.signedUrl);
          audio.playbackRate = 1.05; // 5% faster
          audioRef.current = audio;
          
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => {
            setIsPlaying(false);
            toast.error('Erro ao reproduzir áudio');
          };

          await audio.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.warn('[InsightAudio] Error generating audio:', error);
        // Silently fail - audio is optional
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Play existing audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = 1.05; // 5% faster
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        toast.error('Erro ao reproduzir áudio');
      }
    } else {
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.05; // 5% faster
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error('Erro ao reproduzir áudio');
      };

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        toast.error('Erro ao reproduzir áudio');
      }
    }
  }, [audioUrl, isPlaying, insight]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // When insight changes, check if we need new audio
  useEffect(() => {
    const checkAudioValidity = async () => {
      if (!insight) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_insight_audio')
        .select('insight_text')
        .eq('user_id', user.id)
        .maybeSingle();

      // If insight changed, clear the audio URL so it regenerates on play
      if (data && data.insight_text !== insight) {
        setAudioUrl(null);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      }
    };

    checkAudioValidity();
  }, [insight]);

  return {
    audioUrl,
    isLoading,
    isPlaying,
    isGenerating,
    playAudio,
    stopAudio,
    generateAudio,
  };
}
