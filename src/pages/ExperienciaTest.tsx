import { useState } from "react";
import { PassoZero } from "@/components/experiencia/PassoZero";
import { PassoUm } from "@/components/experiencia/PassoUm";
import { PassoDois } from "@/components/experiencia/PassoDois";
import { PassoTres } from "@/components/experiencia/PassoTres";
import { PassoQuatro } from "@/components/experiencia/PassoQuatro";
import { PassoCinco } from "@/components/experiencia/PassoCinco";

type Step = "menu" | "passo0" | "passo1" | "passo2" | "passo3" | "passo4" | "passo5";

const ExperienciaTest = () => {
  const [currentStep, setCurrentStep] = useState<Step>("menu");

  const steps = [
    { id: "passo0", label: "Passo 0", description: "Introdução / Vídeo inicial" },
    { id: "passo1", label: "Passo 1", description: "Ligação WhatsApp / Reflexão" },
    { id: "passo2", label: "Passo 2", description: "Cenas do antagonista" },
    { id: "passo3", label: "Passo 3", description: "Ditado / Reflexão sobre sabotagem" },
    { id: "passo4", label: "Passo 4", description: "Instagram / Objetivos / Ações" },
    { id: "passo5", label: "Passo 5", description: "Respiração / Conclusão" },
  ] as const;

  const handleAdvance = () => {
    setCurrentStep("menu");
  };

  if (currentStep === "menu") {
    return (
      <div className="min-h-screen bg-black p-6">
        <h1 className="text-white text-2xl font-bold mb-2">🧪 Testes - Experiência</h1>
        <p className="text-white/50 text-sm mb-6">Selecione um passo para testar diretamente</p>
        
        <div className="space-y-3">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as Step)}
              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all"
            >
              <span className="text-white font-semibold">{step.label}</span>
              <p className="text-white/50 text-sm mt-1">{step.description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentStep("menu")}
          className="mt-8 w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white/70 text-sm"
        >
          ← Voltar ao menu
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fixed back button */}
      <button
        onClick={() => setCurrentStep("menu")}
        className="fixed top-4 left-4 z-50 px-3 py-1.5 bg-black/80 border border-white/20 rounded-lg text-white text-xs backdrop-blur-sm"
      >
        ← Menu Testes
      </button>

      {currentStep === "passo0" && <PassoZero onAdvance={handleAdvance} />}
      {currentStep === "passo1" && <PassoUm onAdvance={handleAdvance} />}
      {currentStep === "passo2" && <PassoDois onAdvance={handleAdvance} />}
      {currentStep === "passo3" && <PassoTres onAdvance={handleAdvance} />}
      {currentStep === "passo4" && <PassoQuatro onAdvance={handleAdvance} />}
      {currentStep === "passo5" && <PassoCinco />}
    </div>
  );
};

export default ExperienciaTest;
