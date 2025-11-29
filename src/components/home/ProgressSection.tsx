import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrendingUp, Target, CheckCircle2, ChevronDown, Sparkles, Loader2, AlertCircle, Clock, ExternalLink, Flame } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ProgressSection = () => {
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
  
  // Mock data - will be dynamic later
  const progressData = {
    objectives: 65,
    goals: 45,
    actions: 78,
  };

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

    const currentUserEmail = localStorage.getItem("userEmail");
    const savedAdmins = JSON.parse(localStorage.getItem("administrators") || "[]");
    const userIsAdmin = savedAdmins.includes(currentUserEmail);
    setIsAdmin(userIsAdmin);

    if (!userIsAdmin) {
      const lastInsightDate = localStorage.getItem("lastInsightDate");
      if (lastInsightDate) {
        const lastDate = new Date(lastInsightDate);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        setCanGenerateInsight(diffInDays >= 30);
      }
    }

    return () => {
      window.removeEventListener("storage", syncInsight);
      window.removeEventListener("insightUpdated", syncInsight);
    };
  }, []);

  useEffect(() => {
    // Mock data - Create sample pending items if none exist
    let objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
    let metas = JSON.parse(localStorage.getItem("metas") || "[]");
    
    if (objetivos.length === 0) {
      objetivos = [
        {
          objetivo: "Melhorar habilidades de liderança",
          dataAlvo: "2024-11-15",
          conexaoVVD: "Crescimento profissional",
          status: "pendente"
        },
        {
          objetivo: "Alcançar equilíbrio vida-trabalho",
          dataAlvo: "2024-10-30",
          conexaoVVD: "Bem-estar pessoal",
          status: "pendente"
        },
        {
          objetivo: "Expandar rede de contatos profissionais",
          dataAlvo: "2024-12-01",
          conexaoVVD: "Networking",
          status: "em andamento"
        }
      ];
      localStorage.setItem("objetivos", JSON.stringify(objetivos));
    }

    if (metas.length === 0) {
      metas = [
        {
          objetivo: "Melhorar habilidades de liderança",
          meta: "Concluir curso de gestão de equipes",
          dataAlvo: "2024-11-20",
          criterioMedicao: "Certificado de conclusão",
          dataInicio: "2024-10-01",
          periodicidade: "Semanal",
          status: "pendente",
          acoes: [
            {
              acao: "Assistir módulo 1 do curso",
              periodicidade: "Semanal",
              status: "pendente"
            },
            {
              acao: "Fazer exercícios práticos",
              periodicidade: "Semanal",
              status: "pendente"
            }
          ]
        },
        {
          objetivo: "Alcançar equilíbrio vida-trabalho",
          meta: "Estabelecer rotina de exercícios físicos",
          dataAlvo: "2024-11-01",
          criterioMedicao: "3 vezes por semana",
          dataInicio: "2024-09-15",
          periodicidade: "Semanal",
          status: "pendente",
          acoes: [
            {
              acao: "Ir à academia segunda, quarta e sexta",
              periodicidade: "Semanal",
              status: "pendente"
            },
            {
              acao: "Fazer caminhada no fim de semana",
              periodicidade: "Semanal",
              status: "pendente"
            }
          ]
        }
      ];
      localStorage.setItem("metas", JSON.stringify(metas));
    }

    // Load pending items
    const pendingObjetivos = objetivos.filter((obj: any) => obj.status === "pendente");
    const pendingMetas = metas.filter((meta: any) => meta.status === "pendente");
    
    let pendingActions: any[] = [];
    metas.forEach((meta: any) => {
      if (meta.acoes && Array.isArray(meta.acoes)) {
        const metaPendingActions = meta.acoes
          .filter((acao: any) => acao.status === "pendente")
          .map((acao: any) => ({ ...acao, metaTitulo: meta.meta }));
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
                variant="outline" 
                size="sm" 
                className="gap-1.5 hover:bg-primary/10 hover:border-primary transition-all shadow-sm min-w-[44px]"
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
                        {pendingItems.objectives.map((obj: any, idx: number) => (
                          <div 
                            key={idx}
                            className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                            onClick={() => {
                              const tabButtons = document.querySelectorAll('[role="tab"]');
                              const paraOndeVouTab = Array.from(tabButtons).find(
                                btn => btn.textContent?.includes('Para onde vou')
                              ) as HTMLElement;
                              if (paraOndeVouTab) paraOndeVouTab.click();
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {obj.objetivo}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Prazo: {new Date(obj.dataAlvo).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </div>
                        ))}
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
                        {pendingItems.goals.map((meta: any, idx: number) => (
                          <div 
                            key={idx}
                            className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                            onClick={() => {
                              const tabButtons = document.querySelectorAll('[role="tab"]');
                              const comoChegar = Array.from(tabButtons).find(
                                btn => btn.textContent?.includes('Como vou chegar lá')
                              ) as HTMLElement;
                              if (comoChegar) comoChegar.click();
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {meta.meta}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Prazo: {new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </div>
                        ))}
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
                        {pendingItems.actions.map((acao: any, idx: number) => (
                          <div 
                            key={idx}
                            className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                            onClick={() => {
                              const tabButtons = document.querySelectorAll('[role="tab"]');
                              const comoChegar = Array.from(tabButtons).find(
                                btn => btn.textContent?.includes('Como vou chegar lá')
                              ) as HTMLElement;
                              if (comoChegar) comoChegar.click();
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {acao.acao}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Meta: {acao.metaTitulo}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {acao.periodicidade}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

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
                      <p className="text-2xl font-bold">{progressData.objectives}%</p>
                    </div>
                  </div>
                </div>
                <Progress value={progressData.objectives} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  3 de 5 objetivos em andamento
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
                      <p className="text-2xl font-bold">{progressData.goals}%</p>
                    </div>
                  </div>
                </div>
                <Progress value={progressData.goals} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  9 de 20 metas concluídas
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
                      <p className="text-2xl font-bold">{progressData.actions}%</p>
                    </div>
                  </div>
                </div>
                <Progress value={progressData.actions} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  78 de 100 ações realizadas
                </p>
              </div>
            </div>

            {/* Matriz de Eisenhower Priority Tasks */}
            {(eisenhowerTasks.q1.length > 0 || eisenhowerTasks.q2.length > 0) && (
              <div className="mt-8 space-y-4">
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
