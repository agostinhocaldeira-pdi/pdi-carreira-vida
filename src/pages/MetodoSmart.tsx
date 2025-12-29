import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Home, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  BarChart3,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Bot,
  Loader2,
  Lock,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useQueryClient } from "@tanstack/react-query";
import { PDI_QUERY_KEYS } from "@/hooks/usePDIQueries";
import SmartScientificModal from "@/components/SmartScientificModal";
import { supabase } from "@/integrations/supabase/client";

interface Objetivo {
  id: number | string;
  texto: string;
}

interface MetaSmart {
  objetivoId: string;
  objetivoTexto: string;
  especifico: string;
  mensuravel: string;
  atingivel: string;
  relevante: string;
  temporal: string;
  dataAlvo: string;
}

interface AIUsageStatus {
  freeUsageConsumed: boolean;
  totalPaidUsages: number;
  usagesRemaining: number;
}

const MetodoSmart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storage = usePDIStorage();
  const queryClient = useQueryClient();
  const [etapa, setEtapa] = useState(0);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<Objetivo | null>(null);
  const [vvd, setVvd] = useState<string>("");
  
  const [metaSmart, setMetaSmart] = useState<MetaSmart>({
    objetivoId: "",
    objetivoTexto: "",
    especifico: "",
    mensuravel: "",
    atingivel: "",
    relevante: "",
    temporal: "",
    dataAlvo: "",
  });
  const [isImporting, setIsImporting] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);

  // AI Mentor states
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [hasRequestedAI, setHasRequestedAI] = useState(false);
  const [aiUsageStatus, setAiUsageStatus] = useState<AIUsageStatus>({
    freeUsageConsumed: false,
    totalPaidUsages: 0,
    usagesRemaining: 1, // 1 free usage
  });
  const [isCheckingUsage, setIsCheckingUsage] = useState(true);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  // Check for payment success on mount
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("Pagamento confirmado! Você pode usar a mentoria IA novamente.");
      checkAIUsage();
      // Clear the URL params
      navigate("/ferramentas/smart", { replace: true });
    } else if (paymentStatus === "cancelled") {
      toast.info("Pagamento cancelado.");
      navigate("/ferramentas/smart", { replace: true });
    }
  }, [searchParams, navigate]);

  // Load AI usage status
  const checkAIUsage = async () => {
    setIsCheckingUsage(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setIsCheckingUsage(false);
        return;
      }

      // Check local usage first
      const { data: usageData, error } = await supabase
        .from("user_smart_ai_usage")
        .select("*")
        .eq("user_id", session.session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking AI usage:", error);
      }

      // Check for paid usages via Stripe
      const { data: paymentData } = await supabase.functions.invoke("check-smart-payment");
      
      const freeConsumed = usageData?.free_usage_consumed || false;
      const paidUsages = paymentData?.totalPaidUsages || 0;
      const usedPaidUsages = usageData?.total_paid_usages || 0;
      const remainingPaid = Math.max(0, paidUsages - usedPaidUsages);
      
      setAiUsageStatus({
        freeUsageConsumed: freeConsumed,
        totalPaidUsages: paidUsages,
        usagesRemaining: freeConsumed ? remainingPaid : 1,
      });
    } catch (error) {
      console.error("Error checking AI usage:", error);
    } finally {
      setIsCheckingUsage(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAIUsage();
    
    const loadData = async () => {
      try {
        // Load objectives
        const savedObjetivos = await storage.getObjetivos();
        setObjetivos(
          (savedObjetivos || []).map((obj: any) => ({
            id: obj.id,
            texto: obj.texto,
          }))
        );

        // Load VVD for AI context
        const savedVvd = await storage.getVvd();
        if (savedVvd) {
          setVvd(savedVvd);
        }
      } catch (error) {
        console.error("Erro ao carregar dados (SMART):", error);
        const localObjetivos = localStorage.getItem("objetivos");
        if (localObjetivos) setObjetivos(JSON.parse(localObjetivos));
      }
    };

    loadData();
  }, [storage.isAuthenticated]);

  const handleSelecionarObjetivo = (objId: string) => {
    const obj = objetivos.find(o => o.id.toString() === objId);
    if (obj) {
      setObjetivoSelecionado(obj);
      setMetaSmart({
        ...metaSmart,
        objetivoId: objId,
        objetivoTexto: obj.texto,
      });
    }
  };

  // AI Mentor function
  const requestAIFeedback = async (step: string) => {
    if (aiUsageStatus.usagesRemaining <= 0) {
      toast.error("Você já utilizou sua mentoria IA gratuita. Adquira um uso adicional para continuar.");
      return;
    }

    setIsLoadingAI(true);
    setAiFeedback("");
    setHasRequestedAI(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Você precisa estar logado para usar a mentoria IA.");
        return;
      }

      const currentField = step === "S" ? "especifico" : 
                           step === "M" ? "mensuravel" :
                           step === "A" ? "atingivel" :
                           step === "R" ? "relevante" :
                           step === "T" ? "temporal" : "";
      
      const currentText = currentField ? metaSmart[currentField as keyof MetaSmart] : "";
      
      if (!currentText.trim() && step !== "FINAL") {
        toast.error("Preencha o campo antes de solicitar feedback da IA.");
        setIsLoadingAI(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("evaluate-smart-step", {
        body: {
          step,
          currentText,
          objetivo: objetivoSelecionado?.texto,
          vvd,
          previousSteps: {
            especifico: metaSmart.especifico,
            mensuravel: metaSmart.mensuravel,
            atingivel: metaSmart.atingivel,
            relevante: metaSmart.relevante,
            temporal: metaSmart.temporal,
            dataAlvo: metaSmart.dataAlvo,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAiFeedback(data.feedback);

      // Mark free usage as consumed if this was the first use
      if (!aiUsageStatus.freeUsageConsumed) {
        await supabase
          .from("user_smart_ai_usage")
          .upsert({
            user_id: session.session.user.id,
            free_usage_consumed: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        
        setAiUsageStatus(prev => ({
          ...prev,
          freeUsageConsumed: true,
          usagesRemaining: prev.totalPaidUsages > 0 ? prev.totalPaidUsages : 0,
        }));
      } else {
        // Decrement paid usage
        const newUsedCount = (aiUsageStatus.totalPaidUsages - aiUsageStatus.usagesRemaining) + 1;
        await supabase
          .from("user_smart_ai_usage")
          .update({
            total_paid_usages: newUsedCount,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", session.session.user.id);
        
        setAiUsageStatus(prev => ({
          ...prev,
          usagesRemaining: prev.usagesRemaining - 1,
        }));
      }

    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast.error("Erro ao obter feedback da IA. Tente novamente.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handlePurchaseUsage = async () => {
    setIsCreatingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-smart-payment");
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Erro ao criar pagamento. Tente novamente.");
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleProximo = () => {
    if (etapa === 1 && !objetivoSelecionado) {
      toast.error("Selecione um objetivo para continuar");
      return;
    }
    
    if (etapa === 2 && !metaSmart.especifico.trim()) {
      toast.error("Preencha o campo para continuar");
      return;
    }
    if (etapa === 3 && !metaSmart.mensuravel.trim()) {
      toast.error("Preencha o campo para continuar");
      return;
    }
    if (etapa === 4 && !metaSmart.atingivel.trim()) {
      toast.error("Preencha o campo para continuar");
      return;
    }
    if (etapa === 5 && !metaSmart.relevante.trim()) {
      toast.error("Preencha o campo para continuar");
      return;
    }
    if (etapa === 6 && (!metaSmart.temporal.trim() || !metaSmart.dataAlvo)) {
      toast.error("Preencha todos os campos para continuar");
      return;
    }
    
    // Clear AI feedback when moving to next step
    setAiFeedback("");
    setHasRequestedAI(false);
    setEtapa(etapa + 1);
  };

  const handleVoltar = () => {
    if (etapa > 0) {
      setAiFeedback("");
      setHasRequestedAI(false);
      setEtapa(etapa - 1);
    }
  };

  const handleImportar = async () => {
    if (isImporting) return;
    
    setIsImporting(true);
    
    const metaTexto = metaSmart.especifico;
    const acaoTexto = metaSmart.atingivel;
    
    const novaMeta = {
      id: Date.now(),
      objetivo_id: metaSmart.objetivoId,
      objetivoId: metaSmart.objetivoId,
      texto: metaTexto,
      data_alvo: metaSmart.dataAlvo,
      dataAlvo: metaSmart.dataAlvo,
      medicao: metaSmart.mensuravel,
      inicio: new Date().toISOString().split('T')[0],
      concluida: false,
      acoes: acaoTexto ? [{
        id: Date.now(),
        acao: acaoTexto,
        periodicidade: '',
        status: 'a-fazer' as const,
      }] : [],
      passos: [],
      from_smart: true,
    };

    try {
      const metasExistentes = await storage.getMetas();
      const metasAtualizadas = [...metasExistentes, novaMeta];
      
      await storage.saveMetas(metasAtualizadas);
      localStorage.setItem("metas", JSON.stringify(metasAtualizadas));

      await queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
      localStorage.setItem("metaImportadaSmart", JSON.stringify(novaMeta));

      toast.success("🎯 Meta SMART importada com sucesso!", {
        description: "Agora vá até 'Metas Cadastradas' no Plano de Vida e complete o cadastro.",
        duration: 5000,
      });

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar meta SMART:', error);
      toast.error("Erro ao salvar a meta. Tente novamente.");
      setIsImporting(false);
    }
  };

  const getProgress = () => {
    if (etapa === 0) return 0;
    if (etapa === 1) return 10;
    return ((etapa - 1) / 6) * 100;
  };

  const getStepLetter = (etapaNum: number) => {
    const letters = ["S", "M", "A", "R", "T"];
    return letters[etapaNum - 2] || "";
  };

  const etapas = [
    {
      titulo: "S - Específico (Specific)",
      descricao: "Defina exatamente o que você quer alcançar. Seja claro e detalhado.",
      icon: Target,
      pergunta: "O que exatamente você quer alcançar?",
      placeholder: "Ex: Conquistar certificação AWS Solutions Architect Associate",
      campo: "especifico" as keyof MetaSmart,
      dica: "Evite metas vagas. Em vez de 'melhorar inglês', diga 'alcançar nível C1 no TOEFL'",
    },
    {
      titulo: "M - Mensurável (Measurable)",
      descricao: "Como você vai medir seu progresso? Defina indicadores claros.",
      icon: BarChart3,
      pergunta: "Como você vai medir se alcançou sua meta?",
      placeholder: "Ex: Obter pontuação mínima de 720/1000 no exame",
      campo: "mensuravel" as keyof MetaSmart,
      dica: "Use números, percentuais ou critérios objetivos que permitam acompanhar o progresso",
    },
    {
      titulo: "A - Atingível (Achievable)",
      descricao: "A meta é realista? Quais recursos você tem ou precisa?",
      icon: TrendingUp,
      pergunta: "Como você vai tornar essa meta alcançável?",
      placeholder: "Ex: Estudar 2h por dia, fazer curso preparatório, usar AWS Free Tier",
      campo: "atingivel" as keyof MetaSmart,
      dica: "Considere seus recursos, tempo disponível e habilidades atuais",
    },
    {
      titulo: "R - Relevante (Relevant)",
      descricao: "Por que essa meta é importante? Como ela se conecta com seus objetivos maiores?",
      icon: Sparkles,
      pergunta: "Por que essa meta é importante para você?",
      placeholder: "Ex: A certificação vai me qualificar para vagas sênior em cloud computing",
      campo: "relevante" as keyof MetaSmart,
      dica: "Conecte essa meta com sua Visão de Vida e objetivos de longo prazo",
    },
    {
      titulo: "T - Temporal (Time-bound)",
      descricao: "Defina um prazo específico. Quando você quer alcançar essa meta?",
      icon: Calendar,
      pergunta: "Qual o prazo para alcançar essa meta?",
      placeholder: "Ex: Realizar o exame até o final do semestre",
      campo: "temporal" as keyof MetaSmart,
      dica: "Um prazo cria senso de urgência e ajuda você a se organizar",
    },
  ];

  const gerarPreviewMeta = () => {
    return `${metaSmart.especifico}. Vou medir meu progresso através de: ${metaSmart.mensuravel}. Para tornar isso alcançável: ${metaSmart.atingivel}. Esta meta é relevante porque: ${metaSmart.relevante}. Prazo: ${metaSmart.temporal} (até ${new Date(metaSmart.dataAlvo).toLocaleDateString('pt-BR')}).`;
  };

  const canUseAI = aiUsageStatus.usagesRemaining > 0;

  // AI Feedback Component
  const AIFeedbackSection = ({ step }: { step: string }) => (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">Mentoria IA</span>
          {!isCheckingUsage && (
            <Badge variant={canUseAI ? "secondary" : "outline"} className="text-xs">
              {canUseAI 
                ? `${aiUsageStatus.usagesRemaining} uso${aiUsageStatus.usagesRemaining > 1 ? 's' : ''} disponível${aiUsageStatus.usagesRemaining > 1 ? 'is' : ''}`
                : "Limite atingido"
              }
            </Badge>
          )}
        </div>
      </div>

      {canUseAI ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => requestAIFeedback(step)}
          disabled={isLoadingAI}
          className="w-full gap-2 border-primary/30 hover:bg-primary/5"
        >
          {isLoadingAI ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Solicitar feedback do mentor IA
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="p-3 bg-muted/50 rounded-lg border border-border flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Você já utilizou sua mentoria IA gratuita.
            </span>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handlePurchaseUsage}
            disabled={isCreatingPayment}
            className="w-full gap-2"
          >
            {isCreatingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Adquirir uso adicional (R$ 1,00)
              </>
            )}
          </Button>
        </div>
      )}

      {aiFeedback && (
        <div className="p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20 animate-fade-in">
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm leading-relaxed whitespace-pre-wrap">
              {aiFeedback}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Método SMART
          </h1>
          <p className="text-muted-foreground">
            Transforme seus objetivos em metas claras e alcançáveis
          </p>
          <button 
            onClick={() => setIsSmartModalOpen(true)}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-2 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Entenda a importância de utilizar o método SMART para criar suas metas
          </button>
        </div>

        {/* Progress Bar */}
        {etapa > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Progresso
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round(getProgress())}%
              </span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        )}

        {/* Etapa 0: Introdução */}
        {etapa === 0 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Objetivo vs Meta</CardTitle>
                    <CardDescription>Entenda a diferença</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Objetivo
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      É o seu sonho, sua direção geral. Mais amplo e genérico.
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">Exemplo:</Badge>
                      <p className="text-sm italic">"Ser fluente em inglês"</p>
                      <p className="text-sm italic">"Ter uma carreira de sucesso"</p>
                      <p className="text-sm italic">"Ser mais saudável"</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Meta SMART
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      É o passo concreto e mensurável para alcançar seu objetivo.
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">Exemplo:</Badge>
                      <p className="text-sm italic">"Obter certificado TOEFL com 100 pontos até dezembro"</p>
                      <p className="text-sm italic">"Ser promovido a gerente até junho de 2026"</p>
                      <p className="text-sm italic">"Perder 10kg em 6 meses praticando 4x/semana"</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    O que é SMART?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    SMART é um método para criar metas eficazes através de 5 critérios:
                  </p>
                  <div className="grid sm:grid-cols-5 gap-2">
                    {["Específico", "Mensurável", "Atingível", "Relevante", "Temporal"].map((item, i) => (
                      <Badge key={i} className="justify-center">{item}</Badge>
                    ))}
                  </div>
                </div>

                {/* AI Mentor Info */}
                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-violet-600" />
                    Mentoria IA Integrada
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    A cada passo, você pode solicitar feedback de um mentor de IA que avalia a consistência, 
                    profundidade e alinhamento do seu texto com o objetivo e sua Visão de Vida Desejada.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>1 uso gratuito</strong> • Usos adicionais disponíveis por R$ 1,00
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={handleProximo} size="lg" className="gap-2 shadow-lg">
                Começar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Etapa 1: Seleção de Objetivo */}
        {etapa === 1 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Selecione um Objetivo
                </CardTitle>
                <CardDescription>
                  Escolha um dos seus objetivos do Plano de Vida para transformá-lo em meta SMART
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {objetivos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Você ainda não tem objetivos cadastrados
                    </p>
                    <Link to="/home">
                      <Button variant="outline">
                        Ir para Plano de Vida
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {objetivos.map((obj) => (
                      <div
                        key={obj.id}
                        onClick={() => handleSelecionarObjetivo(obj.id.toString())}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          objetivoSelecionado?.id === obj.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              objetivoSelecionado?.id === obj.id
                                ? "bg-primary/20"
                                : "bg-muted"
                            }`}>
                              <Target className={`w-5 h-5 ${
                                objetivoSelecionado?.id === obj.id
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`} />
                            </div>
                            <p className="font-medium">{obj.texto}</p>
                          </div>
                          {objetivoSelecionado?.id === obj.id && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Etapas 2-6: SMART */}
        {etapa >= 2 && etapa <= 6 && (
          <div className="space-y-6 animate-fade-in">
            {(() => {
              const etapaAtual = etapas[etapa - 2];
              const Icon = etapaAtual.icon;
              const stepLetter = getStepLetter(etapa);
              
              return (
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{etapaAtual.titulo}</CardTitle>
                        <CardDescription>{etapaAtual.descricao}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm">
                        <strong>Objetivo:</strong> {objetivoSelecionado?.texto}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold">{etapaAtual.pergunta}</Label>
                      {etapa === 6 ? (
                        <div className="space-y-4">
                          <Textarea
                            value={metaSmart[etapaAtual.campo]}
                            onChange={(e) => setMetaSmart({ ...metaSmart, [etapaAtual.campo]: e.target.value })}
                            placeholder={etapaAtual.placeholder}
                            className="min-h-[100px]"
                          />
                          <div>
                            <Label>Data Alvo</Label>
                            <Input
                              type="date"
                              value={metaSmart.dataAlvo}
                              onChange={(e) => setMetaSmart({ ...metaSmart, dataAlvo: e.target.value })}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      ) : (
                        <Textarea
                          value={metaSmart[etapaAtual.campo]}
                          onChange={(e) => setMetaSmart({ ...metaSmart, [etapaAtual.campo]: e.target.value })}
                          placeholder={etapaAtual.placeholder}
                          className="min-h-[120px]"
                        />
                      )}
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Dica:</strong> {etapaAtual.dica}</span>
                      </p>
                    </div>

                    {/* AI Feedback Section */}
                    <AIFeedbackSection step={stepLetter} />
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Etapa 7: Preview */}
        {etapa === 7 && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sua Meta SMART está pronta! 🎉</CardTitle>
                    <CardDescription>Revise antes de importar para o Plano de Vida</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border-2 border-primary/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Objetivo Base
                  </h3>
                  <p className="text-sm mb-4 italic">{objetivoSelecionado?.texto}</p>

                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Meta SMART
                  </h3>
                  <p className="text-sm leading-relaxed">{gerarPreviewMeta()}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Específico", valor: metaSmart.especifico, icon: Target },
                    { label: "Mensurável", valor: metaSmart.mensuravel, icon: BarChart3 },
                    { label: "Atingível", valor: metaSmart.atingivel, icon: TrendingUp },
                    { label: "Relevante", valor: metaSmart.relevante, icon: Sparkles },
                    { label: "Temporal", valor: `${metaSmart.temporal} (${new Date(metaSmart.dataAlvo).toLocaleDateString('pt-BR')})`, icon: Calendar },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="p-3 bg-card rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-sm">{item.label}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.valor}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Final AI Evaluation */}
                <AIFeedbackSection step="FINAL" />

                <div className="flex justify-center">
                  <Button 
                    onClick={handleImportar} 
                    size="lg" 
                    className="gap-2 shadow-lg"
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Importar para Plano de Vida
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navegação */}
        {etapa > 0 && etapa < 7 && (
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={handleVoltar} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button onClick={handleProximo} className="gap-2">
              {etapa === 6 ? "Ver Prévia" : "Próximo"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Botões de navegação (rodapé) */}
        {(etapa === 0 || etapa === 7) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/ferramentas" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar às Ferramentas
              </Button>
            </Link>
            <Link to="/home" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Ir para Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* SMART Scientific Modal */}
      <SmartScientificModal 
        open={isSmartModalOpen} 
        onOpenChange={setIsSmartModalOpen} 
      />
    </div>
  );
};

export default MetodoSmart;
