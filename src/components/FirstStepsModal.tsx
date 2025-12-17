import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Compass, 
  CheckSquare, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const FIRST_STEPS_KEY = "pdi_first_steps_shown";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Plano de Vida",
    description: "Defina sua Visão de Vida Desejada (VVD), valores e áreas da vida",
    icon: <Compass className="w-5 h-5" />,
  },
  {
    number: 2,
    title: "Meus Objetivos",
    description: "Crie até 3 objetivos alinhados com sua VVD",
    icon: <Target className="w-5 h-5" />,
  },
  {
    number: 3,
    title: "Mão na Massa",
    description: "Defina metas e ações para alcançar seus objetivos",
    icon: <CheckSquare className="w-5 h-5" />,
  },
  {
    number: 4,
    title: "Diário",
    description: "Registre reflexões, conquistas e gratidão diariamente",
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export const FirstStepsModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Verificar se é o primeiro acesso
    const hasSeenFirstSteps = localStorage.getItem(FIRST_STEPS_KEY);
    if (!hasSeenFirstSteps) {
      // Pequeno delay para não competir com outras animações
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(FIRST_STEPS_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <DialogTitle className="text-lg sm:text-xl">Bem-vindo ao PDI! 🎯</DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Siga esta ordem para construir seu PDI de forma eficaz:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 sm:space-y-3 py-2 sm:py-4">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                {step.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{step.icon}</span>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">{step.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-1.5 sm:mt-2 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 sticky bottom-0 bg-background pb-1">
          <Button onClick={handleClose} className="gap-2 text-sm sm:text-base">
            Começar minha jornada
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
