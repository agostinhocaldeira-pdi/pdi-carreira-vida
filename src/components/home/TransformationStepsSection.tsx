import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Target, Footprints, Lock, CheckCircle2 } from "lucide-react";
import { usePDIStorage } from "@/hooks/usePDIStorage";

interface StepProgress {
  step1Complete: boolean;
  step2Complete: boolean;
  step3Complete: boolean;
}

const TransformationStepsSection = () => {
  const [progress, setProgress] = useState<StepProgress>({
    step1Complete: false,
    step2Complete: false,
    step3Complete: false,
  });
  const storage = usePDIStorage();

  useEffect(() => {
    const checkProgress = async () => {
      try {
        // Passo 1: Verificar VVD, valores e áreas da vida
        const vvd = await storage.getVvd();
        const valores = await storage.getValores();
        const areasVida = await storage.getAreasVida();
        
        const hasVvd = vvd && vvd.trim().length > 0;
        const hasValores = valores && valores.length > 0;
        const hasAreas = areasVida && areasVida.length > 0;
        
        const step1Complete = hasVvd && hasValores && hasAreas;

        // Passo 2: Verificar objetivos
        const objetivos = await storage.getObjetivos();
        const step2Complete = objetivos && objetivos.length > 0;

        // Passo 3: Verificar metas
        const metas = await storage.getMetas();
        const step3Complete = metas && metas.length > 0;

        setProgress({
          step1Complete,
          step2Complete: step1Complete && step2Complete,
          step3Complete: step1Complete && step2Complete && step3Complete,
        });
      } catch (error) {
        console.error("Erro ao verificar progresso:", error);
      }
    };

    checkProgress();
  }, [storage]);

  // Determinar qual passo mostrar
  const getCurrentStep = () => {
    if (!progress.step1Complete) return 1;
    if (!progress.step2Complete) return 2;
    if (!progress.step3Complete) return 3;
    return 0; // Todos completos
  };

  const currentStep = getCurrentStep();

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "O primeiro passo da sua transformação",
          description: "Antes de mudar sua vida, você precisa se enxergar com clareza.\nEsse exercício vai te ajudar a entender quem você é hoje — sem julgamento.",
          highlight: "Quem sou eu",
        };
      case 2:
        return {
          title: "O segundo passo da sua transformação",
          description: "Agora que você se conhece melhor, é hora de definir seu destino.\nVisualize onde você quer chegar e transforme seus sonhos em objetivos concretos.",
          highlight: "Para onde vou",
        };
      case 3:
        return {
          title: "O terceiro passo da sua transformação",
          description: "Você sabe quem é e para onde vai. Falta o mais importante:\nCriar o plano de ação com metas claras para conquistar seus objetivos.",
          highlight: "Como chegar lá",
        };
      default:
        return null;
    }
  };

  const stepContent = getStepContent();

  // Se todos os passos estão completos, não mostrar a seção
  if (!stepContent) {
    return null;
  }

  const steps = [
    {
      number: 1,
      label: "Quem sou eu",
      icon: User,
      path: "/plano-vida/quem-sou",
      complete: progress.step1Complete,
      enabled: true,
    },
    {
      number: 2,
      label: "Para onde vou",
      icon: Target,
      path: "/plano-vida/para-onde",
      complete: progress.step2Complete,
      enabled: progress.step1Complete,
    },
    {
      number: 3,
      label: "Como chegar lá",
      icon: Footprints,
      path: "/plano-vida/como-chegar",
      complete: progress.step3Complete,
      enabled: progress.step1Complete && progress.step2Complete,
    },
  ];

  return (
    <section className="animate-slide-up">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
              Passo {currentStep} de 3
            </Badge>
          </div>
          <CardTitle className="text-lg sm:text-xl text-primary">
            {stepContent.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground whitespace-pre-line mt-2">
            {stepContent.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-4">
            Os 3 passos da sua transformação:
          </p>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {steps.map((step) => {
              const isCurrentStep = step.number === currentStep;
              const StepIcon = step.icon;
              
              if (step.enabled) {
                return (
                  <Link key={step.number} to={step.path}>
                    <div
                      className={`relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isCurrentStep
                          ? "border-primary bg-primary/10 shadow-md"
                          : step.complete
                            ? "border-success/50 bg-success/10"
                            : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      {step.complete && (
                        <div className="absolute -top-1.5 -right-1.5">
                          <CheckCircle2 className="w-5 h-5 text-success fill-success/20" />
                        </div>
                      )}
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                          isCurrentStep
                            ? "bg-primary text-primary-foreground"
                            : step.complete
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                          Passo {step.number}
                        </span>
                        <p
                          className={`text-xs sm:text-sm font-semibold leading-tight ${
                            isCurrentStep ? "text-primary" : step.complete ? "text-success" : "text-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
              
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 border-border/50 bg-muted/30 opacity-60 cursor-not-allowed"
                >
                  <div className="absolute -top-1.5 -right-1.5">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted/50 flex items-center justify-center">
                    <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/50" />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground/50">
                      Passo {step.number}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-muted-foreground/50 leading-tight">
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TransformationStepsSection;
