import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Generate a simple session ID per tab
const SESSION_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const usePageTracking = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    
    // Avoid duplicate tracking for the same path
    if (path === lastPath.current) return;
    lastPath.current = path;

    const trackPageView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await (supabase as any).from("page_views").insert({
          user_id: user.id,
          page_path: path,
          page_title: document.title,
          referrer: document.referrer || null,
          session_id: SESSION_ID,
        });
      } catch (err) {
        // Silent fail - tracking should never break the app
      }
    };

    trackPageView();
  }, [location.pathname]);
};

// Utility function to track custom events
export const trackEvent = async (
  eventType: string,
  eventName: string,
  eventData?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase as any).from("user_events").insert({
      user_id: user.id,
      event_type: eventType,
      event_name: eventName,
      event_data: eventData || {},
      page_path: window.location.pathname,
      session_id: SESSION_ID,
    });
  } catch (err) {
    // Silent fail
  }
};
