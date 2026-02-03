import { useState, useEffect, useRef } from "react";
import { PassoZero } from "@/components/experiencia/PassoZero";
import { PassoUm } from "@/components/experiencia/PassoUm";
import { PassoDois } from "@/components/experiencia/PassoDois";
import { PassoTres } from "@/components/experiencia/PassoTres";
import { PassoQuatro } from "@/components/experiencia/PassoQuatro";
import { PassoCinco } from "@/components/experiencia/PassoCinco";
import ringtoneAudio from "@/assets/ringtone.m4a";
import { motion, AnimatePresence } from "framer-motion";

export type ExperienciaStep = 0 | 1 | 2 | 3 | 4 | 5;

const ExperienciaNarrativa = () => {
  const [currentStep, setCurrentStep] = useState<ExperienciaStep>(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const preloadedAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preload ringtone audio immediately on page load
  useEffect(() => {
    const audio = new Audio(ringtoneAudio);
    audio.preload = "auto";
    audio.loop = true;
    preloadedAudioRef.current = audio;
    
    // Listen for when audio is ready to play
    const handleCanPlayThrough = () => {
      setIsAudioReady(true);
    };
    
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    
    // Force browser to start loading the audio
    audio.load();
    
    // Fallback: if audio takes too long, proceed anyway after 3 seconds
    const timeout = setTimeout(() => {
      setIsAudioReady(true);
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      if (preloadedAudioRef.current) {
        preloadedAudioRef.current.pause();
        preloadedAudioRef.current.src = "";
        preloadedAudioRef.current = null;
      }
    };
  }, []);

  const advanceStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5) as ExperienciaStep);
  };

  // Loading screen while audio is being preloaded
  if (!isAudioReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/70 text-lg text-center"
        >
          Estamos preparando sua experiência...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {currentStep === 0 && <PassoZero onAdvance={advanceStep} preloadedAudio={preloadedAudioRef} />}
        {currentStep === 1 && <PassoUm onAdvance={advanceStep} />}
        {currentStep === 2 && <PassoDois onAdvance={advanceStep} />}
        {currentStep === 3 && <PassoTres onAdvance={advanceStep} />}
        {currentStep === 4 && <PassoQuatro onAdvance={advanceStep} />}
        {currentStep === 5 && <PassoCinco />}
      </AnimatePresence>
    </div>
  );
};

export default ExperienciaNarrativa;
