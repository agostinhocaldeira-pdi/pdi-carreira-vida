import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTodayReflection } from "@/data/stoicReflections";
import { format } from "date-fns";

/**
 * Hook to preload stoic reflection audio in the background with low priority.
 * Uses requestIdleCallback to avoid blocking other processes.
 */
export function useStoicAudioPreload() {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const preloadAudio = async () => {
      try {
        const { reflection, date } = getTodayReflection();
        const dateKey = format(date, "MM-dd");

        // Check if audio already exists with latest version
        const { data: existingAudio } = await supabase
          .from("stoic_reflection_audio")
          .select("audio_url")
          .eq("date_key", dateKey)
          .maybeSingle();

        // If audio exists with v4, it's ready - no need to generate
        if (existingAudio?.audio_url?.includes("-full-v4")) {
          console.log("[StoicAudioPreload] Audio already exists for", dateKey);
          return;
        }

        console.log("[StoicAudioPreload] Generating audio for", dateKey);

        // Trigger background generation via edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-daily-stoic-audio`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              title: reflection.title,
              text: reflection.text,
              question: reflection.question,
              dateKey,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("[StoicAudioPreload] Audio ready:", result.audioUrl);
        } else {
          // Silently fail - ElevenLabs credits may be exhausted
          console.log("[StoicAudioPreload] Audio generation skipped - service unavailable");
        }
      } catch (error) {
        // Silently fail - audio is optional
        console.log("[StoicAudioPreload] Audio preload skipped:", error);
      }
    };

    // Use requestIdleCallback for lowest priority - won't block UI
    const schedulePreload = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(
          () => {
            preloadAudio();
          },
          { timeout: 10000 } // 10 second max delay
        );
      } else {
        // Fallback: delay 2 seconds to let other things load first
        setTimeout(preloadAudio, 2000);
      }
    };

    schedulePreload();
  }, []);
}
