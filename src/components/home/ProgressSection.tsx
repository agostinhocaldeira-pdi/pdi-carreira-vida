import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, Target, CheckCircle2, ChevronDown, Sparkles, Loader2, Flame, Trophy, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";
import { ExportPDFButton } from "@/components/reports/ExportPDFButton";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { DailyCheckout } from "@/components/gamification/DailyCheckout";

const ProgressSection = () => {
  const storage = usePDIStorage();
  const { 
    streak, 
    getUnlockedAchievements, 
    getLockedAchievements,
    getProgressToNextLevel 
  } = useGamification();

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const levelProgress = getProgressToNextLevel();
  const [isOpen, setIsOpen] = useState(false);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [insight, setInsight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [canGenerateInsight, setCanGenerateInsight] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Real progress data calculated from user data
  const [progressData, setProgressData] = useState({
    objectives: { percentage: 0, completed: 0, total: 0 },
    goals: { percentage: 0, completed: 0, total: 0 },
    actions: { percentage: 0, completed: 0, total: 0 },
  });

  useEffect(() => {
    const syncInsight = () => {
      const savedInsight = localStorage.getItem("userInsight");
      if (savedInsight) {
        setInsight(savedInsight);
      }
    };

    // Carregar insight inicial
    syncInsight();

    // Escutar mudanças no localStorage
    window.addEventListener("storage", syncInsight);
    
    // Evento customizado para sincronizar na mesma aba
    window.addEventListener("insightUpdated", syncInsight);

    // Check admin status via server-side RPC (secure)
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: isAdminResult } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        setIsAdmin(!!isAdminResult);
        
        if (!isAdminResult) {
          const lastInsightDate = localStorage.getItem("lastInsightDate");
          if (lastInsightDate) {
            const lastDate = new Date(lastInsightDate);
            const now = new Date();
            const diffInDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            setCanGenerateInsight(diffInDays >= 30);
          }
        }
      }
    };
    checkAdminStatus();

    return () => {
      window.removeEventListener("storage", syncInsight);
      window.removeEventListener("insightUpdated", syncInsight);
    };
  }, []);

  useEffect(() => {
    const loadProgressData = async () => {
      // Load from localStorage first (instant)
      let objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
      let metas = JSON.parse(localStorage.getItem("metas") || "[]");
      
      // Then try to sync with Supabase in background (parallel)
      try {
        const [savedObjetivos, savedMetas] = await Promise.all([
          storage.getObjetivos().catch(() => null),
          storage.getMetas().catch(() => null)
        ]);

        if (savedObjetivos && savedObjetivos.length > 0) {
          objetivos = savedObjetivos;
        }
        
        if (savedMetas && savedMetas.length > 0) {
          metas = savedMetas;
        }
      } catch (error) {
        console.error("Error syncing progress data with Supabase:", error);
      }
      
      // Calculate real progress data
      const totalObjetivos = objetivos.length;
      const completedObjetivos = objetivos.filter((obj: any) => {
        const status = obj.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        return status === "concluido" || status === "concluído";
      }).length;
      const objetivosPercentage = totalObjetivos > 0 ? Math.round((completedObjetivos / totalObjetivos) * 100) : 0;

      const totalMetas = metas.length;
      const completedMetas = metas.filter((meta: any) => {
        const status = meta.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        return status === "concluido" || status === "concluído" || meta.concluida === true;
      }).length;
      const metasPercentage = totalMetas > 0 ? Math.round((completedMetas / totalMetas) * 100) : 0;

      // Count all actions from all metas
      let totalActions = 0;
      let completedActions = 0;
      metas.forEach((meta: any) => {
        if (meta.acoes && Array.isArray(meta.acoes)) {
          totalActions += meta.acoes.length;
          completedActions += meta.acoes.filter((acao: any) => {
            const status = acao.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
            return status === "concluido" || status === "concluído";
          }).length;
        }
      });
      const actionsPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

      setProgressData({
        objectives: { percentage: objetivosPercentage, completed: completedObjetivos, total: totalObjetivos },
        goals: { percentage: metasPercentage, completed: completedMetas, total: totalMetas },
        actions: { percentage: actionsPercentage, completed: completedActions, total: totalActions },
      });
    };
    
    loadProgressData();
  }, [storage]);

  const handleGenerateInsight = async () => {
    if (!canGenerateInsight && !isAdmin) {
      toast.error("Você já gerou um insight este mês. Tente novamente em 30 dias.");
      return;
    }

    // Validar requisitos mínimos para gerar insight
    const missingItems: string[] = [];
    
    const vvd = localStorage.getItem("vvd") || "";
    const valoresData = JSON.parse(localStorage.getItem("valores") || "[]");
    const areasVidaData = JSON.parse(localStorage.getItem("areasVida") || "[]");
    
    if (!vvd || vvd.trim() === "") {
      missingItems.push("VVD (Visão de Vida Desejada)");
    }
    
    const valoresPreenchidos = valoresData.filter((v: string) => v && v.trim() !== "");
    if (valoresPreenchidos.length === 0) {
      missingItems.push("Valores pessoais");
    }
    
    const areasPreenchidas = areasVidaData.filter((a: any) => a.notaAtual && a.notaDesejada);
    if (areasPreenchidas.length === 0) {
      missingItems.push("Roda da Vida (Áreas da Vida)");
    }
    
    // Verificar objetivos, metas e ações
    try {
      const objetivos = await storage.getObjetivos();
      if (objetivos.length === 0) {
        missingItems.push("Ao menos 1 objetivo");
      }
      
      const metas = await storage.getMetas();
      if (metas.length === 0) {
        missingItems.push("Ao menos 1 meta");
      }
      
      const hasAcoes = metas.some(meta => meta.acoes && meta.acoes.length > 0);
      if (!hasAcoes) {
        missingItems.push("Ao menos 1 ação");
      }
    } catch (error) {
      console.error("Error checking objetivos/metas/acoes:", error);
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
      const valores = valoresPreenchidos.join(", ");
      const areasVida = areasPreenchidas.map((a: any) => 
        `${a.area}: Nota Atual ${a.notaAtual}, Nota Desejada ${a.notaDesejada}`
      ).join("; ");

      const prompt = `Com base nos seguintes dados de desenvolvimento pessoal, gere um insight correlacional profundo sobre quem é esta pessoa. IMPORTANTE: Limite a resposta a NO MÁXIMO 2 parágrafos concisos.

Visão de Vida Desejada (VVD): ${vvd}

Valores Pessoais: ${valores}

Áreas da Vida: ${areasVida}

Analise as correlações entre estes elementos e forneça um insight sobre a essência e direcionamento desta pessoa. Seja conciso e direto.`;

      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { prompt }
      });

      if (error) throw error;

      const generatedInsight = data.insight;
      setInsight(generatedInsight);
      localStorage.setItem("userInsight", generatedInsight);
      
      // Disparar evento para sincronizar na mesma aba
      window.dispatchEvent(new Event("insightUpdated"));
      
      if (!isAdmin) {
        localStorage.setItem("lastInsightDate", new Date().toISOString());
        setCanGenerateInsight(false);
      }
      
      toast.success("Insight gerado com sucesso!");
    } catch (error) {
      console.error("Error generating insight:", error);
      toast.error("Erro ao gerar insight. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Seu Progresso
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Acompanhe o desenvolvimento do seu PDI</CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm min-w-[44px] border border-border"
              >
                {!isOpen && (
                  <span className="text-xs font-medium">Expandir</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {/* Action buttons - only visible when expanded */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
              <ExportPDFButton label="Exportar relatórios" className="w-full sm:w-auto" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsJourneyModalOpen(true)}
                className="gap-1.5 w-full sm:w-auto"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                Sua Jornada
              </Button>
            </div>

            {/* Daily Checkout Section - Now inside Seu Progresso */}
            <div className="mb-6">
              <DailyCheckout />
            </div>

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
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Título da seção de progresso */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Evolução
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Objetivos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Objetivos</p>
                      <p className="text-2xl font-bold">{progressData.objectives.percentage}%</p>
                    </div>
                  </div>
                </div>
                <Progress value={progressData.objectives.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progressData.objectives.total > 0 
                    ? `${progressData.objectives.completed} de ${progressData.objectives.total} objetivos concluídos`
                    : "Nenhum objetivo cadastrado"}
                </p>
              </div>

              {/* Metas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Metas</p>
                      <p className="text-2xl font-bold">{progressData.goals.percentage}%</p>
                    </div>
                  </div>
                </div>
                <Progress value={progressData.goals.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progressData.goals.total > 0 
                    ? `${progressData.goals.completed} de ${progressData.goals.total} metas concluídas`
                    : "Nenhuma meta cadastrada"}
                </p>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ações</p>
                      <p className="text-2xl font-bold">{progressData.actions.percentage}%</p>
                    </div>
                  </div>
                </div>
                <Progress value={progressData.actions.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progressData.actions.total > 0 
                    ? `${progressData.actions.completed} de ${progressData.actions.total} ações realizadas`
                    : "Nenhuma ação cadastrada"}
                </p>
              </div>
            </div>

            {/* Insights Section */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Insights sobre você
                </h3>
                <Button
                  onClick={handleGenerateInsight}
                  disabled={isGenerating || (!canGenerateInsight && !isAdmin)}
                  size="sm"
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Insight
                    </>
                  )}
                </Button>
              </div>

              {!canGenerateInsight && !isAdmin && (
                <p className="text-xs text-muted-foreground">
                  Você atingiu o limite mensal de geração de insights. Próxima geração disponível em 30 dias.
                </p>
              )}

              {isAdmin && (
                <p className="text-xs text-primary font-medium">
                  Acesso Admin: Você tem insights ilimitados como administrador.
                </p>
              )}

              {insight && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {insight}
                    </p>
                  </CardContent>
                </Card>
              )}

              {!insight && (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                      Clique em "Gerar Insight" para receber uma análise correlacional profunda sobre seu desenvolvimento pessoal.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ProgressSection;
