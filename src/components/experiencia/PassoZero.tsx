import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Phone, PhoneOff, Volume2, Mic } from "lucide-react";

interface PassoZeroProps {
  onAdvance: () => void;
  preloadedAudio?: MutableRefObject<HTMLAudioElement | null>;
}

export const PassoZero = ({ onAdvance, preloadedAudio }: PassoZeroProps) => {
  const [currentTime, setCurrentTime] = useState("");
  const [isRinging, setIsRinging] = useState(true);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Start playing ringtone on mount - use preloaded audio if available
  useEffect(() => {
    // Use preloaded audio from parent if available
    if (preloadedAudio?.current) {
      const audio = preloadedAudio.current;
      localAudioRef.current = audio;
      
      // Try to play immediately (already preloaded)
      audio.play().catch(() => {
        // Autoplay blocked - will start on first interaction
      });
      
      return; // Don't clean up preloaded audio here
    }
    
    // Fallback: create audio if not preloaded
    if (localAudioRef.current) return;
    
    const ringtoneAudio = "/assets/ringtone.m4a";
    const audio = new Audio(ringtoneAudio);
    audio.loop = true;
    localAudioRef.current = audio;
    
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
      localAudioRef.current = null;
    };
  }, [preloadedAudio]);

  const handleInteraction = () => {
    // Stop the ringtone immediately
    if (localAudioRef.current) {
      localAudioRef.current.pause();
      localAudioRef.current.currentTime = 0;
      localAudioRef.current.src = "";
      localAudioRef.current = null;
    }
    // Also clean up preloaded ref
    if (preloadedAudio?.current) {
      preloadedAudio.current = null;
    }
    
    setIsRinging(false);
    setTimeout(() => {
      onAdvance();
    }, 2000);
  };

  return (
    <div
      className="min-h-screen bg-[#0b141a] flex flex-col cursor-pointer select-none"
      onClick={handleInteraction}
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 text-white/80 text-sm">
        <span className="font-medium">{currentTime}</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-white/60 rounded-sm" />
            <div className="w-1 h-3 bg-white/60 rounded-sm" />
            <div className="w-1 h-4 bg-white/60 rounded-sm" />
            <div className="w-1 h-4 bg-white/40 rounded-sm" />
          </div>
          <span className="text-xs">4G</span>
          <div className="flex items-center gap-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73s3.15.25 4.6.73v3.1c0 .4.23.74.56.9.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
            </svg>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-3 border border-white/60 rounded-sm flex items-center p-0.5">
              <div className="w-4 h-2 bg-white/60 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Call Screen */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Avatar */}
        <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mb-6 ${isRinging ? 'animate-pulse' : ''}`}>
          <span className="text-4xl font-bold text-white">PDI</span>
        </div>

        {/* Contact Name */}
        <h1 className="text-2xl font-light text-white mb-2">PDI</h1>

        {/* Call Status */}
        <p className={`text-white/60 text-lg ${isRinging ? 'animate-pulse' : ''}`}>
          {isRinging ? "chamada recebida..." : "chamada finalizada"}
        </p>

        {/* Timer placeholder */}
        <p className="text-white/40 text-sm mt-2">
          {isRinging ? "WhatsApp" : ""}
        </p>
      </div>

      {/* Call Controls */}
      <div className="pb-16 px-8">
        <div className="flex justify-center gap-8 mb-8">
          {/* Mute */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleInteraction();
            }}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Mic className="w-6 h-6 text-white" />
          </button>

          {/* Speaker */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleInteraction();
            }}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Volume2 className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex justify-center gap-16">
          {/* Decline */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleInteraction();
            }}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>

          {/* Accept */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleInteraction();
            }}
            className={`w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-green-500/30 ${isRinging ? 'animate-bounce' : ''}`}
          >
            <Phone className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
