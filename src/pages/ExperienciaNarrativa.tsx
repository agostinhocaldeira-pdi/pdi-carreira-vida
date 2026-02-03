import { useState } from "react";
import { PassoZero } from "@/components/experiencia/PassoZero";
import { PassoUm } from "@/components/experiencia/PassoUm";
import { PassoDois } from "@/components/experiencia/PassoDois";
import { PassoTres } from "@/components/experiencia/PassoTres";
import { PassoQuatro } from "@/components/experiencia/PassoQuatro";
import { PassoCinco } from "@/components/experiencia/PassoCinco";

export type ExperienciaStep = 0 | 1 | 2 | 3 | 4 | 5;

const ExperienciaNarrativa = () => {
  const [currentStep, setCurrentStep] = useState<ExperienciaStep>(0);

  const advanceStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5) as ExperienciaStep);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {currentStep === 0 && <PassoZero onAdvance={advanceStep} />}
      {currentStep === 1 && <PassoUm onAdvance={advanceStep} />}
      {currentStep === 2 && <PassoDois onAdvance={advanceStep} />}
      {currentStep === 3 && <PassoTres onAdvance={advanceStep} />}
      {currentStep === 4 && <PassoQuatro onAdvance={advanceStep} />}
      {currentStep === 5 && <PassoCinco />}
    </div>
  );
};

export default ExperienciaNarrativa;
