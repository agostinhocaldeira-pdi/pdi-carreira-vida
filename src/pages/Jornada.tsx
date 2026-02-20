import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, ChevronRight, Play, ArrowLeft, Trophy, Sparkles, AlertTriangle, Target, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JornadaVVD from "@/components/jornada/JornadaVVD";
import JornadaVidaNaoQuero from "@/components/jornada/JornadaVidaNaoQuero";
import JornadaAutoReflexao from "@/components/jornada/JornadaAutoReflexao";
import JornadaSmart from "@/components/jornada/JornadaSmart";
import JornadaFinal from "@/components/jornada/JornadaFinal";
import JornadaUpgradeModal from "@/components/jornada/JornadaUpgradeModal";

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
    id: "vvd",
    title: "Vida dos Sonhos",
    subtitle: "Como seria sua vida ideal?",
    icon: <Sparkles className="w-6 h-6" />,
    emoji: "✨",
    color: "text-purple-500",
    bgGradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "vida-nao-quero",
    title: "Vida que eu NÃO quero viver",
    subtitle: "O que acontece se nada mudar?",
    icon: <AlertTriangle className="w-6 h-6" />,
    emoji: "🚫",
    color: "text-red-500",
    bgGradient: "from-red-500/20 to-orange-500/20",
  },
  {
    id: "auto-reflexao",
    title: "Auto Reflexão",
    subtitle: "Valores + Roda da Vida + Crenças",
    icon: <Search className="w-6 h-6" />,
    emoji: "🔍",
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
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
  const [smartActionData, setSmartActionData] = useState<{ especifica: string; mensuravel: string; alcancavel: string; relevante: string; temporal: string; aprender: string; sabotador: string; antiSabotagem: string; primeiraAcao: string; diaHora: string; smartEvaluation?: string } | null>(null);
  const [vvdAnswers, setVvdAnswers] = useState<string[]>([]);
  const [vidaNaoQueroAnswers, setVidaNaoQueroAnswers] = useState<string[]>([]);
  const [autoReflexaoData, setAutoReflexaoData] = useState<{ valores: string[]; rodaScores: Record<string, number>; crencas: string[] } | null>(null);
  const [evaluatedSteps, setEvaluatedSteps] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Auth check — any logged-in user can access (free)
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Faça login para acessar a Jornada");
        navigate("/login?source=pdismart");
        return;
      }

      // Check if user already completed the jornada
      const { data: completion } = await supabase
        .from('user_jornada_completions')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (completion && completion.length > 0) {
        // Already completed — check if they have paid access to use again
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const userRoles = roles?.map(r => r.role) || [];
        const hasPdismartAccess = userRoles.includes('pdismart');

        let hasSubscription = false;
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session?.session?.access_token) {
            const { data } = await supabase.functions.invoke('check-subscription', {
              headers: { Authorization: `Bearer ${session.session.access_token}` },
            });
            hasSubscription = data?.subscribed === true;
          }
        } catch (err) {
          console.error('Error checking subscription:', err);
        }

        if (hasPdismartAccess || hasSubscription) {
          setIsAuthorized(true);
        } else {
          setHasCompleted(true);
          setShowCompletedModal(true);
        }
      } else {
        setIsAuthorized(true);
      }

      setAuthChecked(true);
    };
    checkAccess();
  }, [navigate]);

  const progress = (completedSteps.length / steps.length) * 100;
  const allComplete = completedSteps.length === steps.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep, allComplete]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized && hasCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50">
        <JornadaUpgradeModal
          open={showCompletedModal}
          onOpenChange={(open) => {
            setShowCompletedModal(open);
            if (!open) navigate("/");
          }}
          title="Jornada já concluída"
          description="Você já completou a Jornada! Para usar novamente, escolha uma opção:"
        />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const isUnlocked = (stepId: string) => {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx === 0) return true;
    return completedSteps.includes(steps[idx - 1].id);
  };

  const handleComplete = (stepId: string, data?: any) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }
    if (!evaluatedSteps.includes(stepId)) {
      setEvaluatedSteps((prev) => [...prev, stepId]);
    }
    if (stepId === "vvd" && data) setVvdAnswers(data);
    if (stepId === "vida-nao-quero" && data) setVidaNaoQueroAnswers(data);
    if (stepId === "auto-reflexao" && data) setAutoReflexaoData(data);
    if (stepId === "smart" && data) setSmartActionData(data);
    setCurrentStep(null);
  };

  // Show final screen only after SMART (last step) is explicitly completed
  const smartCompleted = completedSteps.includes("smart");
  if (smartCompleted && allComplete && !currentStep) {
    return <JornadaFinal onBack={() => setCompletedSteps(completedSteps.filter(s => s !== "smart"))} smartActionData={smartActionData} vvdAnswers={vvdAnswers} vidaNaoQueroAnswers={vidaNaoQueroAnswers} autoReflexaoData={autoReflexaoData} />;
  }

  // Show active step
  if (currentStep) {
    const baseProps = {
      onComplete: (data?: any) => handleComplete(currentStep, data),
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
          {currentStep === "vvd" && <JornadaVVD {...baseProps} hasEvaluated={evaluatedSteps.includes("vvd")} />}
          {currentStep === "vida-nao-quero" && <JornadaVidaNaoQuero {...baseProps} hasEvaluated={evaluatedSteps.includes("vida-nao-quero")} />}
          {currentStep === "auto-reflexao" && <JornadaAutoReflexao {...baseProps} hasEvaluated={evaluatedSteps.includes("auto-reflexao")} />}
          {currentStep === "smart" && <JornadaSmart {...baseProps} hasEvaluated={evaluatedSteps.includes("smart")} />}
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

          {/* Video */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/b6KRYzno0Q4?rel=0&modestbranding=1"
              title="Vídeo explicativo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
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
                  onClick={() => unlocked && setCurrentStep(step.id)}
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${step.bgGradient}`}
                  />

                  <CardContent className="p-4 pl-6">
                    <div className="flex items-center gap-4">
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
