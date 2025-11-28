import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrendingUp, Target, CheckCircle2, ChevronDown, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  
  // Mock data - will be dynamic later
  const progressData = {
    objectives: 65,
    goals: 45,
    actions: 78,
  };

  useEffect(() => {
    const savedInsight = localStorage.getItem("userInsight");
    if (savedInsight) {
      setInsight(savedInsight);
    }

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
          objetivo: "Expandir rede de contatos profissionais",
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
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {/* Pending Items Alert */}
            {(pendingItems.objectives.length > 0 || pendingItems.goals.length > 0 || pendingItems.actions.length > 0) && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Itens Pendentes - Prazos Expirados</AlertTitle>
                <AlertDescription>
                  <div className="mt-3 space-y-3">
                    {pendingItems.objectives.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm mb-2">Objetivos ({pendingItems.objectives.length}):</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {pendingItems.objectives.map((obj: any, idx: number) => (
                            <li key={idx}>
                              {obj.objetivo} - Prazo: {new Date(obj.dataAlvo).toLocaleDateString('pt-BR')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pendingItems.goals.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm mb-2">Metas ({pendingItems.goals.length}):</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {pendingItems.goals.map((meta: any, idx: number) => (
                            <li key={idx}>
                              {meta.meta} - Prazo: {new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pendingItems.actions.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm mb-2">Ações ({pendingItems.actions.length}):</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {pendingItems.actions.map((acao: any, idx: number) => (
                            <li key={idx}>
                              {acao.acao} (Meta: {acao.metaTitulo}) - Periodicidade: {acao.periodicidade}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
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
