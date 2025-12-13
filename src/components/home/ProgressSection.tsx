import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrendingUp, Target, CheckCircle2, ChevronDown, Sparkles, Loader2, AlertCircle, Clock, ExternalLink, Flame, Trophy, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useGamification } from "@/hooks/useGamification";
import { ExportPDFButton } from "@/components/reports/ExportPDFButton";

const ProgressSection = () => {
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
  const [insight, setInsight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [canGenerateInsight, setCanGenerateInsight] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingItems, setPendingItems] = useState<{
    objectives: any[];
    goals: any[];
    actions: any[];
  }>({
    objectives: [],
    goals: [],
    actions: []
  });
  const [eisenhowerTasks, setEisenhowerTasks] = useState<{
    q1: any[];
    q2: any[];
  }>({
    q1: [],
    q2: []
  });
  
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
    // Load data from localStorage
    let objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
    let metas = JSON.parse(localStorage.getItem("metas") || "[]");
    
    // Calculate real progress data
    const totalObjetivos = objetivos.length;
    const completedObjetivos = objetivos.filter((obj: any) => 
      obj.status?.toLowerCase() === "concluido" || obj.status?.toLowerCase() === "concluído"
    ).length;
    const objetivosPercentage = totalObjetivos > 0 ? Math.round((completedObjetivos / totalObjetivos) * 100) : 0;

    const totalMetas = metas.length;
    const completedMetas = metas.filter((meta: any) => 
      meta.status?.toLowerCase() === "concluido" || meta.status?.toLowerCase() === "concluído" || meta.concluida === true
    ).length;
    const metasPercentage = totalMetas > 0 ? Math.round((completedMetas / totalMetas) * 100) : 0;

    // Count all actions from all metas
    let totalActions = 0;
    let completedActions = 0;
    metas.forEach((meta: any) => {
      if (meta.acoes && Array.isArray(meta.acoes)) {
        totalActions += meta.acoes.length;
        completedActions += meta.acoes.filter((acao: any) => 
          acao.status?.toLowerCase() === "concluido" || acao.status?.toLowerCase() === "concluído"
        ).length;
      }
    });
    const actionsPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    setProgressData({
      objectives: { percentage: objetivosPercentage, completed: completedObjetivos, total: totalObjetivos },
      goals: { percentage: metasPercentage, completed: completedMetas, total: totalMetas },
      actions: { percentage: actionsPercentage, completed: completedActions, total: totalActions },
    });
    
    // Load pending items - handle both data structures
    // Check for "pendente" status or items with expired dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isDateExpired = (dateStr: string | undefined): boolean => {
      if (!dateStr) return false;
      // Parse the date string and compare only the date part (not time)
      const [year, month, day] = dateStr.split('-').map(Number);
      if (!year || !month || !day) return false;
      const targetDate = new Date(year, month - 1, day);
      targetDate.setHours(0, 0, 0, 0);
      return targetDate < today;
    };
    
    const pendingObjetivos = objetivos.filter((obj: any) => {
      const status = obj.status?.toLowerCase() || "";
      const dataAlvo = obj.dataAlvo || obj.data_alvo;
      const isPending = status === "pendente" || status === "a-fazer";
      const isCompleted = status === "concluido" || status === "concluído";
      const isExpired = !isCompleted && isDateExpired(dataAlvo);
      return isPending || isExpired;
    });
    
    const pendingMetas = metas.filter((meta: any) => {
      const status = meta.status?.toLowerCase() || "";
      const dataAlvo = meta.dataAlvo || meta.data_alvo;
      const isPending = status === "pendente" || status === "a-fazer";
      const isCompleted = status === "concluido" || status === "concluído" || meta.concluida === true;
      const isExpired = !isCompleted && isDateExpired(dataAlvo);
      return isPending || isExpired;
    });
    
    let pendingActions: any[] = [];
    metas.forEach((meta: any, metaIdx: number) => {
      if (meta.acoes && Array.isArray(meta.acoes)) {
        const metaPendingActions = meta.acoes
          .filter((acao: any) => {
            const status = acao.status?.toLowerCase() || "";
            return status === "pendente" || status === "a-fazer";
          })
          .map((acao: any, acaoIdx: number) => ({ 
            ...acao, 
            id: acao.id || `${meta.id || metaIdx}-${acaoIdx}`,
            metaTitulo: meta.meta || meta.texto 
          }));
        pendingActions = [...pendingActions, ...metaPendingActions];
      }
    });

    setPendingItems({
      objectives: pendingObjetivos,
      goals: pendingMetas,
      actions: pendingActions
    });
  }, []);

  useEffect(() => {
    const loadEisenhowerTasks = () => {
      const tasks = JSON.parse(localStorage.getItem("eisenhowerTasks") || "{}");
      setEisenhowerTasks({
        q1: tasks.q1 || [],
        q2: tasks.q2 || []
      });
    };

    loadEisenhowerTasks();

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      loadEisenhowerTasks();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("eisenhowerUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("eisenhowerUpdated", handleStorageChange);
    };
  }, []);

  const handleGenerateInsight = async () => {
    if (!canGenerateInsight && !isAdmin) {
      toast.error("Você já gerou um insight este mês. Tente novamente em 30 dias.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const vvd = localStorage.getItem("vvd") || "";
      const valoresData = JSON.parse(localStorage.getItem("valores") || "[]");
      const areasVidaData = JSON.parse(localStorage.getItem("areasVida") || "[]");

      const valores = valoresData.filter((v: string) => v.trim()).join(", ");
      const areasVida = areasVidaData.map((a: any) => 
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
            {/* Sua Jornada - Gamificação */}
            <div className="mb-8 p-4 rounded-lg border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-glow">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Sua Jornada</h3>
                    <p className="text-xs text-muted-foreground">Conquistas e progresso</p>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1.5 bg-amber-500/10 text-amber-700 border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-500" />
                  Nível {streak.level}
                </Badge>
              </div>

              {/* Level Progress */}
              <div className="space-y-2 mb-4">
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
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xl font-bold">{streak.current_streak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Dias seguidos</span>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-xl font-bold">{streak.longest_streak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Maior streak</span>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xl font-bold">{unlockedAchievements.length}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Conquistas</span>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="space-y-2 mb-4">
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

              {/* Export PDF Button */}
              <div className="pt-2 border-t border-amber-500/20">
                <ExportPDFButton />
              </div>
            </div>

            {/* Pending Items Cards */}
            {(pendingItems.objectives.length > 0 || pendingItems.goals.length > 0 || pendingItems.actions.length > 0) && (
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-destructive" />
                  <h3 className="text-lg font-semibold text-destructive">Itens com Prazo Expirado</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Objetivos Pendentes */}
                  {pendingItems.objectives.length > 0 && (
                    <Card className="border-destructive/50 bg-destructive/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          <span>Objetivos ({pendingItems.objectives.length})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {pendingItems.objectives.map((obj: any, idx: number) => {
                          const titulo = obj.objetivo || obj.texto || "Objetivo sem título";
                          const dataAlvo = obj.dataAlvo || obj.data_alvo;
                          const dataFormatada = dataAlvo ? new Date(dataAlvo).toLocaleDateString('pt-BR') : "Sem prazo";
                          
                          return (
                            <div 
                              key={obj.id || idx}
                              className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent("navigateToPlanoDeVida", { 
                                  detail: { tab: "para-onde" } 
                                }));
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {titulo}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Prazo: {dataFormatada}
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}

                  {/* Metas Pendentes */}
                  {pendingItems.goals.length > 0 && (
                    <Card className="border-destructive/50 bg-destructive/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="text-2xl">📊</span>
                          <span>Metas ({pendingItems.goals.length})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {pendingItems.goals.map((meta: any, idx: number) => {
                          const titulo = meta.meta || meta.texto || "Meta sem título";
                          const dataAlvo = meta.dataAlvo || meta.data_alvo;
                          const dataFormatada = dataAlvo ? new Date(dataAlvo).toLocaleDateString('pt-BR') : "Sem prazo";
                          
                          return (
                            <div 
                              key={meta.id || idx}
                              className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent("navigateToPlanoDeVida", { 
                                  detail: { tab: "como-chegar" } 
                                }));
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {titulo}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Prazo: {dataFormatada}
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}

                  {/* Ações Pendentes */}
                  {pendingItems.actions.length > 0 && (
                    <Card className="border-destructive/50 bg-destructive/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="text-2xl">⚡</span>
                          <span>Ações ({pendingItems.actions.length})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {pendingItems.actions.map((acao: any, idx: number) => {
                          const titulo = acao.acao || "Ação sem título";
                          const metaTitulo = acao.metaTitulo || acao.meta || "";
                          
                          return (
                            <div 
                              key={acao.id || idx}
                              className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent("navigateToPlanoDeVida", { 
                                  detail: { tab: "como-chegar" } 
                                }));
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {titulo}
                                  </p>
                                  {metaTitulo && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Meta: {metaTitulo}
                                    </p>
                                  )}
                                  {acao.periodicidade && (
                                    <p className="text-xs text-muted-foreground">
                                      {acao.periodicidade}
                                    </p>
                                  )}
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Matriz de Eisenhower Priority Tasks */}
            {(eisenhowerTasks.q1.length > 0 || eisenhowerTasks.q2.length > 0) && (
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
                    <span className="break-words">Tarefas Prioritárias</span>
                  </h3>
                  <Link to="/ferramentas/eisenhower">
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                      <span className="text-xs">Ver Ferramenta</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Urgente e Importante */}
                  {eisenhowerTasks.q1.length > 0 && (
                    <Card className="border-red-500/50 bg-gradient-to-br from-red-500/5 to-orange-500/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Flame className="w-5 h-5 text-red-500" />
                          <span>Urgente e Importante ({eisenhowerTasks.q1.length})</span>
                        </CardTitle>
                        <CardDescription className="text-xs">Faça primeiro - Máxima prioridade</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {eisenhowerTasks.q1.map((task: string, idx: number) => (
                          <div 
                            key={idx}
                            className="p-3 bg-background rounded-lg border border-red-500/20 hover:border-red-500/50 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {task}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Importante, não urgente */}
                  {eisenhowerTasks.q2.length > 0 && (
                    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-blue-500/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          <span>Importante, não urgente ({eisenhowerTasks.q2.length})</span>
                        </CardTitle>
                        <CardDescription className="text-xs">Planeje e agende - Foco estratégico</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {eisenhowerTasks.q2.map((task: string, idx: number) => (
                          <div 
                            key={idx}
                            className="p-3 bg-background rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {task}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

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
