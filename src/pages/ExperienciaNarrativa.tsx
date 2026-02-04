import { useState, useEffect, useRef } from "react";
import { PassoZero } from "@/components/experiencia/PassoZero";
import { PassoUm } from "@/components/experiencia/PassoUm";
import { PassoDois } from "@/components/experiencia/PassoDois";
import { PassoTres } from "@/components/experiencia/PassoTres";
import { PassoQuatro } from "@/components/experiencia/PassoQuatro";
import { PassoCinco } from "@/components/experiencia/PassoCinco";
import ringtoneAudio from "@/assets/ringtone.m4a";
import audioRespira from "@/assets/audio-respira.mp4";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export type ExperienciaStep = 0 | 1 | 2 | 3 | 4 | 5;

interface PreloadedAudios {
  ringtone: HTMLAudioElement | null;
  respira: HTMLAudioElement | null;
}

const ExperienciaNarrativa = () => {
  const [currentStep, setCurrentStep] = useState<ExperienciaStep>(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const preloadedAudiosRef = useRef<PreloadedAudios>({ ringtone: null, respira: null });

  // Preload ALL audios immediately on page load
  useEffect(() => {
    let ringtoneReady = false;
    let respiraReady = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkAllReady = () => {
      if (ringtoneReady && respiraReady) {
        setIsAudioReady(true);
      }
    };

    // Preload ringtone
    const ringtone = new Audio(ringtoneAudio);
    ringtone.preload = "auto";
    ringtone.loop = true;
    preloadedAudiosRef.current.ringtone = ringtone;
    
    ringtone.addEventListener("canplaythrough", () => {
      ringtoneReady = true;
      checkAllReady();
    }, { once: true });
    ringtone.load();

    // Preload respira audio
    const respira = new Audio(audioRespira);
    respira.preload = "auto";
    respira.loop = true;
    preloadedAudiosRef.current.respira = respira;
    
    respira.addEventListener("canplaythrough", () => {
      respiraReady = true;
      checkAllReady();
    }, { once: true });
    respira.load();

    // Fallback: if audios take too long, proceed anyway after 3 seconds
    timeoutId = setTimeout(() => {
      setIsAudioReady(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      // Cleanup all audios
      if (preloadedAudiosRef.current.ringtone) {
        preloadedAudiosRef.current.ringtone.pause();
        preloadedAudiosRef.current.ringtone.src = "";
        preloadedAudiosRef.current.ringtone = null;
      }
      if (preloadedAudiosRef.current.respira) {
        preloadedAudiosRef.current.respira.pause();
        preloadedAudiosRef.current.respira.src = "";
        preloadedAudiosRef.current.respira = null;
      }
    };
  }, []);

  // Auto-advance after 9 seconds when video starts playing
  useEffect(() => {
    if (!showIntro || !isVideoPlaying) return;

    const timerId = setTimeout(() => {
      setShowIntro(false);
    }, 9000);

    return () => {
      clearTimeout(timerId);
    };
  }, [showIntro, isVideoPlaying]);

  const advanceStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5) as ExperienciaStep);
  };

  const handleWatchVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleSkipToExperience = () => {
    setShowIntro(false);
  };

  // Intro screen with YouTube Shorts video
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm flex flex-col items-center gap-6"
        >
          {/* YouTube Shorts-style container - reduced size for mobile first fold */}
          <div className="relative w-full aspect-[9/16] max-h-[55vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            {!isVideoPlaying ? (
              // Black screen with question mark before playing
              <div className="w-full h-full bg-black flex items-center justify-center">
                <span className="text-white text-[12rem] font-light select-none">?</span>
              </div>
            ) : (
              // Playing state with JS API enabled
              <iframe
                src="https://www.youtube-nocookie.com/embed/dZybFglDt80?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="PDI - Introdução"
              />
            )}
            
            {/* Shorts-style branding */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <span className="text-white text-sm font-semibold">Shorts</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3">
            {!isVideoPlaying && (
              <Button
                onClick={handleWatchVideo}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Assistir o vídeo
              </Button>
            )}
            
            <Button
              onClick={handleSkipToExperience}
              variant="outline"
              className="w-full h-12 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white font-semibold rounded-xl"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Começar a experiência
            </Button>
          </div>

          {/* Loading indicator */}
          {!isAudioReady && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/50 text-sm text-center"
            >
              Preparando áudios...
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {currentStep === 0 && <PassoZero onAdvance={advanceStep} preloadedAudio={preloadedAudiosRef.current.ringtone} />}
        {currentStep === 1 && <PassoUm onAdvance={advanceStep} />}
        {currentStep === 2 && <PassoDois onAdvance={advanceStep} />}
        {currentStep === 3 && <PassoTres onAdvance={advanceStep} />}
        {currentStep === 4 && <PassoQuatro onAdvance={advanceStep} />}
        {currentStep === 5 && <PassoCinco preloadedAudio={preloadedAudiosRef.current.respira} />}
      </AnimatePresence>
    </div>
  );
};

export default ExperienciaNarrativa;
