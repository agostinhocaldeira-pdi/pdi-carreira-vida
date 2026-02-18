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
import { ArrowRight, Volume2 } from "lucide-react";

export type ExperienciaStep = 0 | 1 | 2 | 3 | 4 | 5;

interface PreloadedAudios {
  ringtone: HTMLAudioElement | null;
  respira: HTMLAudioElement | null;
}

const ExperienciaNarrativa = () => {
  const [currentStep, setCurrentStep] = useState<ExperienciaStep>(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isTiktokVideoReady, setIsTiktokVideoReady] = useState(false);
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

  const prepareTiktokVideo = () => {
    setIsTiktokVideoReady(true);
  };

  const handleStartExperience = () => {
    setShowIntro(false);
  };

  // Intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-sm flex flex-col items-center gap-10 text-center"
        >
          <h1 className="text-2xl md:text-3xl font-light leading-relaxed text-white/90">
            está preparado para viver uma experiência{" "}
            <span className="font-semibold text-white">diferente de tudo</span>{" "}
            que você já viu?
          </h1>

          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Volume2 className="w-4 h-4 shrink-0" />
            <p>aumente o volume do seu celular para uma melhor experiência</p>
          </div>

          <Button
            onClick={handleStartExperience}
            className="w-full h-14 bg-white text-black hover:bg-white/90 font-semibold rounded-xl text-base"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Começar a experiência
          </Button>

          {/* Loading indicator */}
          {!isAudioReady && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/30 text-xs"
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
        {currentStep === 2 && <PassoDois onAdvance={advanceStep} onPrepareNextStep={prepareTiktokVideo} />}
        {currentStep === 3 && <PassoTres onAdvance={advanceStep} autoPlay={isTiktokVideoReady} />}
        {currentStep === 4 && <PassoQuatro onAdvance={advanceStep} />}
        {currentStep === 5 && <PassoCinco preloadedAudio={preloadedAudiosRef.current.respira} />}
      </AnimatePresence>
    </div>
  );
};

export default ExperienciaNarrativa;
