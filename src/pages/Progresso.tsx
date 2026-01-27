import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, Target, CheckCircle2, Sparkles, Loader2, Flame, Trophy, Star, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";
import { useHomeData } from "@/hooks/useHomeData";
import { useUserRole } from "@/hooks/useUserRole";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useAIUsage } from "@/hooks/useAIUsage";
import { AIUsageLimitModal } from "@/components/AIUsageLimitModal";

const Progresso = () => {
  const storage = usePDIStorage();
  const { 
    streak, 
    getUnlockedAchievements, 
    getLockedAchievements,
    getProgressToNextLevel 
  } = useGamification();

  const { progress: progressData, insight: cachedInsight, lastInsightDate, objetivos, metas, vvd, valores, areasVida } = useHomeData();
  const { isAdmin } = useUserRole();

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const levelProgress = getProgressToNextLevel();
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [insight, setInsight] = useState(cachedInsight);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAILimitModal, setShowAILimitModal] = useState(false);
  
  const canGenerateInsight = useMemo(() => {
    if (isAdmin) return true;
    if (!lastInsightDate) return true;
    const lastDate = new Date(lastInsightDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays >= 30;
  }, [isAdmin, lastInsightDate]);
  
  const aiUsage = useAIUsage('insight');

  useEffect(() => {
    const syncInsight = () => {
      const savedInsight = localStorage.getItem("userInsight");
      if (savedInsight) {
        setInsight(savedInsight);
      }
    };

    window.addEventListener("storage", syncInsight);
    window.addEventListener("insightUpdated", syncInsight);

    return () => {
      window.removeEventListener("storage", syncInsight);
      window.removeEventListener("insightUpdated", syncInsight);
    };
  }, []);

  const handleGenerateInsight = async (fromPurchase = false) => {
    if (!isAdmin && !canGenerateInsight && !fromPurchase && !aiUsage.hasAvailablePurchase) {
      setShowAILimitModal(true);
      return;
    }

    if (!isAdmin && !canGenerateInsight && !fromPurchase && aiUsage.hasAvailablePurchase) {
      const consumed = await aiUsage.consumePurchase();
      if (!consumed) {
        toast.error("Erro ao processar sua compra. Tente novamente.");
        return;
      }
    }

    const missingItems: string[] = [];
    
    if (!vvd || vvd.trim() === "") {
      missingItems.push("VVD (Visão de Vida Desejada)");
    }
    
    const valoresPreenchidos = valores.filter((v: string) => v && v.trim() !== "");
    if (valoresPreenchidos.length === 0) {
      missingItems.push("Valores pessoais");
    }
    
    // Handle both snake_case (from Supabase) and camelCase (from localStorage)
    const areasPreenchidas = areasVida.filter((a: any) => 
      (a.nota_atual || a.notaAtual) && (a.nota_desejada || a.notaDesejada)
    );
    if (areasPreenchidas.length === 0) {
      missingItems.push("Roda da Vida (Áreas da Vida)");
    }
    
    if (objetivos.length === 0) {
      missingItems.push("Ao menos 1 objetivo");
    }
    
    if (metas.length === 0) {
      missingItems.push("Ao menos 1 meta");
    }
    
    const hasAcoes = metas.some((meta: any) => meta.acoes && meta.acoes.length > 0);
    if (!hasAcoes) {
      missingItems.push("Ao menos 1 ação");
    }
    
    if (missingItems.length > 0) {
      toast.error(
        `Para gerar insights, preencha: ${missingItems.join(", ")}`,
        { duration: 6000 }
      );
      return;
    }

    setIsGenerating(true);
    
    try {
      // Collect all user data for comprehensive insight
      const { collectInsightData } = await import('@/services/insightDataCollector');
      const insightData = await collectInsightData(storage);

      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: insightData
      });

      if (error) {
        console.error("Error generating insight:", error);
        toast.error(error.message || "Erro ao gerar insight");
        return;
      }

      if (data?.insight) {
        setInsight(data.insight);
        localStorage.setItem("userInsight", data.insight);
        window.dispatchEvent(new Event("insightUpdated"));
        
        if (!isAdmin) {
          const today = new Date().toISOString();
          localStorage.setItem("lastInsightDate", today);
        }
        
        toast.success("Insight gerado com sucesso!");
      }
    } catch (error) {
      console.error("Error generating insight:", error);
      toast.error("Erro ao gerar insight. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePurchaseAI = async () => {
    const url = await aiUsage.createPurchase('/progresso');
    if (url) {
      window.location.href = url;
    }
  };

  useEffect(() => {
    if (aiUsage.hasAvailablePurchase && !isGenerating) {
      handleGenerateInsight(true);
    }
  }, [aiUsage.hasAvailablePurchase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AIUsageLimitModal
        isOpen={showAILimitModal}
        onClose={() => setShowAILimitModal(false)}
        onPurchase={handlePurchaseAI}
        isLoading={aiUsage.isLoading}
        featureType="insight"
        featureName="Insights Personalizados"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/home">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Seu Progresso
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Acompanhe sua evolução e conquistas
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Sua Jornada Modal */}
        <Dialog open={isJourneyModalOpen} onOpenChange={setIsJourneyModalOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-glow">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold">Sua Jornada</span>
                  <p className="text-xs text-muted-foreground font-normal">Conquistas e progresso</p>
                </div>
                <Badge variant="secondary" className="ml-auto gap-1.5 bg-amber-500/10 text-amber-700 border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-500" />
                  Nível {streak.level}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-4 pb-4">
                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso para nível {streak.level + 1}</span>
                    <span className="font-medium">{streak.total_points} pts</span>
                  </div>
                  <Progress value={levelProgress.percentage} className="h-2 bg-amber-100" />
                  <p className="text-xs text-muted-foreground text-right">
                    {levelProgress.current}/{levelProgress.next} pontos
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-xl font-bold">{streak.current_streak}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Dias seguidos</span>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-xl font-bold">{streak.longest_streak}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Maior streak</span>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-xl font-bold">{unlockedAchievements.length}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Conquistas</span>
                  </div>
                </div>

                {/* Achievements Grid */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Conquistas ({unlockedAchievements.length}/{unlockedAchievements.length + lockedAchievements.length})
                  </h4>
                  <TooltipProvider>
                    <div className="flex flex-wrap gap-2">
                      {unlockedAchievements.slice(0, 8).map((achievement) => (
                        <Tooltip key={achievement.code}>
                          <TooltipTrigger>
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-sm hover:scale-110 transition-transform cursor-pointer">
                              <span className="text-lg">{achievement.icon}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {lockedAchievements.slice(0, 4).map((achievement) => (
                        <Tooltip key={achievement.code}>
                          <TooltipTrigger>
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border opacity-50 cursor-pointer">
                              <span className="text-lg grayscale">🔒</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {(unlockedAchievements.length + lockedAchievements.length) > 12 && (
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border text-xs font-medium">
                          +{(unlockedAchievements.length + lockedAchievements.length) - 12}
                        </div>
                      )}
                    </div>
                  </TooltipProvider>
                  
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                    Suas conquistas geram pontos e prêmios. Em Recursos, acesse a FAQ e entenda como funciona na seção "Gamificação e Badges".
                  </p>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Sua Jornada Card */}
        <section className="animate-slide-up">
          <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 dark:from-amber-950/20 dark:to-yellow-950/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Sua Jornada
                </CardTitle>
                <Badge variant="secondary" className="gap-1.5 bg-amber-500/10 text-amber-700 border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-500" />
                  Nível {streak.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso para nível {streak.level + 1}</span>
                  <span className="font-medium">{streak.total_points} pts</span>
                </div>
                <Progress value={levelProgress.percentage} className="h-2" />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-background/80 rounded-lg border">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xl font-bold">{streak.current_streak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Dias seguidos</span>
                </div>
                <div className="text-center p-3 bg-background/80 rounded-lg border">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-xl font-bold">{streak.longest_streak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Maior streak</span>
                </div>
                <div className="text-center p-3 bg-background/80 rounded-lg border">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xl font-bold">{unlockedAchievements.length}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Conquistas</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-amber-300 hover:bg-amber-50"
                onClick={() => setIsJourneyModalOpen(true)}
              >
                Ver todas as conquistas
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Evolução Card */}
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="shadow-medium">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Evolução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Objetivos */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Objetivos</p>
                      <p className="text-2xl font-bold text-primary">{progressData.objectives.percentage}%</p>
                    </div>
                    <Progress 
                      value={progressData.objectives.percentage} 
                      className="h-2" 
                      variant={progressData.objectives.percentage === 100 ? "success" : "secondary"}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {progressData.objectives.total > 0 
                        ? `${progressData.objectives.completed} de ${progressData.objectives.total} objetivos concluídos`
                        : "Nenhum objetivo cadastrado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metas */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Metas</p>
                      <p className="text-2xl font-bold text-secondary">{progressData.goals.percentage}%</p>
                    </div>
                    <Progress 
                      value={progressData.goals.percentage} 
                      className="h-2" 
                      variant={progressData.goals.percentage === 100 ? "success" : "secondary"}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {progressData.goals.total > 0 
                        ? `${progressData.goals.completed} de ${progressData.goals.total} metas concluídas`
                        : "Nenhuma meta cadastrada"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Ações</p>
                      <p className="text-2xl font-bold text-secondary">{progressData.actions.percentage}%</p>
                    </div>
                    <Progress 
                      value={progressData.actions.percentage} 
                      className="h-2" 
                      variant={progressData.actions.percentage === 100 ? "success" : "secondary"}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {progressData.actions.total > 0 
                        ? `${progressData.actions.completed} de ${progressData.actions.total} ações realizadas`
                        : "Nenhuma ação cadastrada"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Insights Card */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Insight Personalizado
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateInsight()}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {insight ? "Atualizar" : "Gerar"}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {insight ? (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{insight}</p>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg border border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Clique em "Gerar" para receber um insight personalizado baseado no seu progresso e objetivos.
                  </p>
                </div>
              )}
              {!isAdmin && !canGenerateInsight && (
                <p className="text-xs text-muted-foreground mt-3">
                  Próximo insight disponível em 30 dias ou compre créditos adicionais.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Progresso;
