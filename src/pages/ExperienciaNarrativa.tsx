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

export type ExperienciaStep = 0 | 1 | 2 | 3 | 4 | 5;

interface PreloadedAudios {
  ringtone: HTMLAudioElement | null;
  respira: HTMLAudioElement | null;
}

const ExperienciaNarrativa = () => {
  const [currentStep, setCurrentStep] = useState<ExperienciaStep>(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
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
