import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowLeft, ArrowRight, Heart, Target } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    currentPhase: "",
    expectations: "",
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const canAdvance = () => {
    switch (step) {
      case 1:
        return true; // Etapa de boas-vindas sempre pode avançar
      case 2:
        return true; // Etapa explicativa sempre pode avançar
      case 3:
        return true; // Etapa sobre método PDI sempre pode avançar
      case 4:
        return onboardingData.currentPhase.trim() !== ""; // Requer fase atual preenchida
      case 5:
        return onboardingData.expectations.trim() !== ""; // Requer expectativas preenchidas
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error("Por favor, preencha o campo antes de continuar");
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    if (!canAdvance()) {
      toast.error("Por favor, preencha o campo antes de finalizar");
      return;
    }
    
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
              
              <div className="flex gap-3">
                {step > 1 && (
                  <Button 
                    onClick={handlePrevious} 
                    variant="outline" 
                    size="lg"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                )}
                <Button 
                  onClick={handleNext} 
                  size="lg"
                  className="flex-1"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">PDI: Carreira & Vida</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed space-y-4">
                  <p>
                    <strong>Embora o PDI seja tradicionalmente usado para desenvolvimento de carreira, 
                    este aplicativo vai além:</strong> ele integra carreira e vida pessoal.
                  </p>
                  <p>
                    Por quê? Porque <strong>é impossível separar uma coisa da outra</strong>. Sua vida 
                    profissional impacta diretamente sua vida pessoal, e vice-versa.
                  </p>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm">
                      💡 <strong>Nossa abordagem holística</strong> considera que um profissional realizado 
                      é também alguém que cuida da saúde, dos relacionamentos, das finanças, do 
                      desenvolvimento pessoal e do bem-estar emocional.
                    </p>
                  </div>
                  <p>
                    Aqui você não apenas planeja sua carreira, mas constrói uma <strong>visão completa 
                    da vida que deseja viver</strong>.
                  </p>
                </CardDescription>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  size="lg"
                  className="flex-1"
                >
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">O que é o PDI?</CardTitle>
                </div>
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
              
              <div className="flex gap-3">
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  size="lg"
                  className="flex-1"
                >
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <CardTitle className="text-2xl">Vamos começar? 🚀</CardTitle>
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
                  spellCheck="true"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  size="lg"
                  className="flex-1"
                  disabled={!canAdvance()}
                >
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
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
                  spellCheck="true"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleFinish} 
                  size="lg"
                  className="w-full sm:flex-1"
                  disabled={!canAdvance()}
                >
                  <span className="hidden sm:inline">Ir para Home</span>
                  <span className="sm:hidden">Começar</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
