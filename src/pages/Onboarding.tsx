import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    currentPhase: "",
    expectations: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("onboarding", JSON.stringify(onboardingData));
    localStorage.setItem("onboardingComplete", "true");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-2xl shadow-large">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Etapa {step} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[400px] flex flex-col justify-between">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Bem-vindo ao PDI!</CardTitle>
                <CardDescription className="text-base max-w-md mx-auto">
                  O PDI - Carreira & Vida é um método completo para você alcançar clareza sobre quem você é, 
                  onde quer chegar e como vai realizar seus objetivos de vida e carreira.
                </CardDescription>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <CardTitle className="text-2xl">O que é o PDI?</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  <p className="mb-4">
                    O Plano de Desenvolvimento Individual é uma ferramenta poderosa que te ajuda a:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Descobrir sua visão de vida desejada</li>
                    <li>Identificar seus valores e prioridades</li>
                    <li>Avaliar as diferentes áreas da sua vida</li>
                    <li>Definir objetivos claros e alcançáveis</li>
                    <li>Criar um plano de ação prático</li>
                    <li>Acompanhar seu progresso diariamente</li>
                  </ul>
                </CardDescription>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                Avançar
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <CardTitle className="text-2xl">Sua Fase de Vida Atual</CardTitle>
                <CardDescription className="text-base">
                  Como você descreveria o momento que está vivendo agora?
                </CardDescription>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPhase">Fase Atual</Label>
                <Input
                  id="currentPhase"
                  placeholder="Ex: Em transição de carreira, buscando propósito..."
                  value={onboardingData.currentPhase}
                  onChange={(e) =>
                    setOnboardingData({ ...onboardingData, currentPhase: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                Avançar
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <CardTitle className="text-2xl">Suas Expectativas</CardTitle>
                <CardDescription className="text-base">
                  O que você espera alcançar com o PDI?
                </CardDescription>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectations">Expectativas</Label>
                <Textarea
                  id="expectations"
                  placeholder="Compartilhe suas expectativas, sonhos e o que deseja conquistar..."
                  value={onboardingData.expectations}
                  onChange={(e) =>
                    setOnboardingData({ ...onboardingData, expectations: e.target.value })
                  }
                  rows={6}
                />
              </div>
              <Button onClick={handleFinish} className="w-full" size="lg">
                Ir para Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
