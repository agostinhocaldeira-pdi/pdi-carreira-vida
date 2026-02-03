import { useState, useEffect, useRef } from "react";
import { PassoZero } from "@/components/experiencia/PassoZero";
import { PassoUm } from "@/components/experiencia/PassoUm";
import { PassoDois } from "@/components/experiencia/PassoDois";
import { PassoTres } from "@/components/experiencia/PassoTres";
import { PassoQuatro } from "@/components/experiencia/PassoQuatro";
import { PassoCinco } from "@/components/experiencia/PassoCinco";
import ringtoneAudio from "@/assets/ringtone.m4a";

export type ExperienciaStep = 0 | 1 | 2 | 3 | 4 | 5;

const ExperienciaNarrativa = () => {
  const [currentStep, setCurrentStep] = useState<ExperienciaStep>(0);
  const preloadedAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preload ringtone audio immediately on page load
  useEffect(() => {
    const audio = new Audio(ringtoneAudio);
    audio.preload = "auto";
    audio.loop = true;
    preloadedAudioRef.current = audio;
    
    // Force browser to start loading the audio
    audio.load();
    
    return () => {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {currentStep === 0 && <PassoZero onAdvance={advanceStep} preloadedAudio={preloadedAudioRef} />}
      {currentStep === 1 && <PassoUm onAdvance={advanceStep} />}
      {currentStep === 2 && <PassoDois onAdvance={advanceStep} />}
      {currentStep === 3 && <PassoTres onAdvance={advanceStep} />}
      {currentStep === 4 && <PassoQuatro onAdvance={advanceStep} />}
      {currentStep === 5 && <PassoCinco />}
    </div>
  );
};

export default ExperienciaNarrativa;
