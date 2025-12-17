import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
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
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { usePDIStorage } from "@/hooks/usePDIStorage";

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

const MetodoSmart = () => {
  const navigate = useNavigate();
  const storage = usePDIStorage();
  const [etapa, setEtapa] = useState(0); // 0=intro, 1=selecao objetivo, 2-6=SMART, 7=preview
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<Objetivo | null>(null);
  
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

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadObjetivos = async () => {
      // Carregar objetivos do Supabase
      const savedObjetivos = await storage.getObjetivos();
      if (savedObjetivos && savedObjetivos.length > 0) {
        setObjetivos(savedObjetivos.map((obj: any) => ({
          id: obj.id,
          texto: obj.texto
        })));
      } else {
        // Fallback para localStorage
        const localObjetivos = localStorage.getItem("objetivos");
        if (localObjetivos) {
          setObjetivos(JSON.parse(localObjetivos));
        }
      }
    };

    loadObjetivos();
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

  const handleProximo = () => {
    if (etapa === 1 && !objetivoSelecionado) {
      toast.error("Selecione um objetivo para continuar");
      return;
    }
    
    // Validações por etapa
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
    
    setEtapa(etapa + 1);
  };

  const handleVoltar = () => {
    if (etapa > 0) {
      setEtapa(etapa - 1);
    }
  };

  const handleImportar = () => {
    // Construir texto da meta SMART completo
    const metaTexto = `${metaSmart.especifico}. ${metaSmart.mensuravel}. ${metaSmart.atingivel}`;
    
    const novaMeta = {
      id: Date.now(),
      objetivoId: metaSmart.objetivoId,
      texto: metaTexto,
      dataAlvo: metaSmart.dataAlvo,
      medicao: metaSmart.mensuravel,
      inicio: new Date().toISOString().split('T')[0],
      periodicidade: "mensalmente",
      concluida: false,
      acoes: [],
      passos: [],
      fromSmart: true, // Flag para identificar origem
    };

    // Salvar no localStorage
    const metasExistentes = JSON.parse(localStorage.getItem("metas") || "[]");
    const metasAtualizadas = [...metasExistentes, novaMeta];
    localStorage.setItem("metas", JSON.stringify(metasAtualizadas));

    // Salvar temporariamente para destacar na home
    localStorage.setItem("metaImportadaSmart", JSON.stringify(novaMeta));

    toast.success("🎯 Meta SMART importada com sucesso!", {
      description: "Agora vá até 'Metas Cadastradas' no Plano de Vida e complete o cadastro com as ações e passos necessários",
      duration: 5000,
    });

    // Redirecionar para home
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  const getProgress = () => {
    if (etapa === 0) return 0;
    if (etapa === 1) return 10;
    return ((etapa - 1) / 6) * 100;
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

                <div className="flex justify-center">
                  <Button onClick={handleImportar} size="lg" className="gap-2 shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    Importar para Plano de Vida
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
    </div>
  );
};

export default MetodoSmart;
