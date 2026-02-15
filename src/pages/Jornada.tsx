import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, ChevronRight, Play, ArrowLeft, Printer, Download, Crown, Star, Sparkles, Heart, Target, Compass, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import JornadaValores from "@/components/jornada/JornadaValores";
import JornadaRodaDaVida from "@/components/jornada/JornadaRodaDaVida";
import JornadaVVD from "@/components/jornada/JornadaVVD";
import JornadaSmart from "@/components/jornada/JornadaSmart";
import JornadaFinal from "@/components/jornada/JornadaFinal";

interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  bgGradient: string;
}

const steps: Step[] = [
  {
    id: "valores",
    title: "Seus Valores",
    subtitle: "O que é mais importante pra você?",
    icon: <Heart className="w-6 h-6" />,
    emoji: "💎",
    color: "text-pink-500",
    bgGradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "roda-da-vida",
    title: "Roda da Vida",
    subtitle: "Como está cada área da sua vida?",
    icon: <Compass className="w-6 h-6" />,
    emoji: "🎯",
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "vvd",
    title: "Vida dos Sonhos",
    subtitle: "Como seria sua vida ideal?",
    icon: <Sparkles className="w-6 h-6" />,
    emoji: "✨",
    color: "text-purple-500",
    bgGradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "smart",
    title: "Meta SMART",
    subtitle: "Transforme sonhos em metas reais",
    icon: <Target className="w-6 h-6" />,
    emoji: "🚀",
    color: "text-orange-500",
    bgGradient: "from-orange-500/20 to-amber-500/20",
  },
];

export default function Jornada() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const progress = (completedSteps.length / steps.length) * 100;
  const allComplete = completedSteps.length === steps.length;

  const isUnlocked = (stepId: string) => {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx === 0) return true;
    return completedSteps.includes(steps[idx - 1].id);
  };

  const handleComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }
    setCurrentStep(null);
  };

  // Show final screen
  if (allComplete && !currentStep) {
    return <JornadaFinal onBack={() => setCompletedSteps(completedSteps.slice(0, -1))} />;
  }

  // Show active step
  if (currentStep) {
    const stepProps = {
      onComplete: () => handleComplete(currentStep),
      onBack: () => setCurrentStep(null),
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === "valores" && <JornadaValores {...stepProps} />}
          {currentStep === "roda-da-vida" && <JornadaRodaDaVida {...stepProps} />}
          {currentStep === "vvd" && <JornadaVVD {...stepProps} />}
          {currentStep === "smart" && <JornadaSmart {...stepProps} />}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Map view
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">
              {completedSteps.length}/{steps.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sua Jornada 🗺️
          </h1>
          <p className="text-slate-600 text-sm">
            Complete cada etapa para descobrir sua direção de vida e criar sua primeira meta real.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-slate-200" />
        </div>

        {/* Step Cards */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const unlocked = isUnlocked(step.id);
            const completed = completedSteps.includes(step.id);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                    completed
                      ? "border-green-400 bg-green-50/50 shadow-md shadow-green-100"
                      : unlocked
                      ? "border-slate-200 hover:border-blue-300 hover:shadow-lg bg-white"
                      : "border-slate-100 bg-slate-50 opacity-60"
                  }`}
                  onClick={() => unlocked && !completed && setCurrentStep(step.id)}
                >
                  {/* Gradient accent */}
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${step.bgGradient}`}
                  />

                  <CardContent className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      {/* Step number / status */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          completed
                            ? "bg-green-100"
                            : unlocked
                            ? `bg-gradient-to-br ${step.bgGradient}`
                            : "bg-slate-100"
                        }`}
                      >
                        {completed ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : unlocked ? (
                          <span>{step.emoji}</span>
                        ) : (
                          <Lock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                            Etapa {index + 1}
                          </span>
                          {completed && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              Concluída ✓
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800 mt-0.5">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Arrow */}
                      {unlocked && !completed && (
                        <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Motivation footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 pt-4"
        >
          🔒 Complete cada etapa para desbloquear a próxima
        </motion.p>
      </div>
    </div>
  );
}
