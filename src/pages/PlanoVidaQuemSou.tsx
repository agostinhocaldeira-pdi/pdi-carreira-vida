import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowRight, Edit, ArrowLeft, Home, Sparkles, Lightbulb, Compass, Target, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { PDILoader } from "@/components/ui/pdi-loader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import { useAIUsage } from "@/hooks/useAIUsage";
import { AIUsageLimitModal } from "@/components/AIUsageLimitModal";
import { useUserRole } from "@/hooks/useUserRole";

const PlanoVidaQuemSou = () => {
  const { isLoading: roleLoading, userRole } = useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const { isAdmin } = useUserRole();
  const storage = usePDIStorage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [vvd, setVvd] = useState("");
  const [isEditingVvd, setIsEditingVvd] = useState(true);
  const [valores, setValores] = useState<string[]>(Array(6).fill(""));
  const [isEditingValores, setIsEditingValores] = useState(true);
  const [areasVida, setAreasVida] = useState<Array<{
    area: string;
    notaAtual: string | number;
    notaDesejada: string | number;
  }>>([]);
  const [isEditingAreas, setIsEditingAreas] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Insight states
  const [insightInicial, setInsightInicial] = useState("");
  const [hasGeneratedInsight, setHasGeneratedInsight] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [showAILimitModal, setShowAILimitModal] = useState(false);
  
  // AI Usage hook
  const aiUsage = useAIUsage('insight');

  // Sincronizar valores com a página de exercício
  useEffect(() => {
    const syncValores = () => {
      const savedMeusValores = localStorage.getItem("meus_valores");
      if (savedMeusValores) {
        const meusValores = JSON.parse(savedMeusValores);
        const valoresCompletos = [...meusValores.slice(0, 6), ...Array(Math.max(0, 6 - meusValores.length)).fill("")];
        setValores(valoresCompletos);
      }
    };

    syncValores();
    window.addEventListener("valoresUpdated", syncValores);

    return () => {
      window.removeEventListener("valoresUpdated", syncValores);
    };
  }, []);

  // Sincronizar VVD com a ferramenta Método VVD
  useEffect(() => {
    const syncVvd = () => {
      const savedVvd = localStorage.getItem("vvd");
      if (savedVvd) {
        setVvd(savedVvd);
        setIsEditingVvd(false);
      }
    };

    syncVvd();
    window.addEventListener("vvdUpdated", syncVvd);

    return () => {
      window.removeEventListener("vvdUpdated", syncVvd);
    };
  }, []);

  // Carregar dados salvos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // VVD
        const savedVvd = await storage.getVvd();
        if (savedVvd) {
          setVvd(savedVvd);
          setIsEditingVvd(false);
        } else {
          const localVvd = localStorage.getItem("vvd");
          if (localVvd) {
            setVvd(localVvd);
            setIsEditingVvd(false);
          }
        }

        // Valores - limitado a 6 campos
        const savedValores = await storage.getValores();
        if (savedValores && savedValores.length > 0) {
          const limitedValores = savedValores.slice(0, 6);
          const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
          setValores(valoresCompletos);
          setIsEditingValores(false);
        } else {
          const localValores = localStorage.getItem("valores");
          if (localValores) {
            const parsed = JSON.parse(localValores);
            const limitedValores = parsed.slice(0, 6);
            const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
            setValores(valoresCompletos);
            setIsEditingValores(false);
          }
        }

        // Áreas da Vida
        const savedAreas = await storage.getAreasVida();
        if (savedAreas && savedAreas.length > 0) {
          const normalizedAreas = savedAreas.map((area: any) => ({
            area: area.area,
            notaAtual: String(area.nota_atual ?? area.notaAtual ?? ""),
            notaDesejada: String(area.nota_desejada ?? area.notaDesejada ?? "")
          }));
          setAreasVida(normalizedAreas);
          setIsEditingAreas(false);
        } else {
          const localAreas = localStorage.getItem("areasVida");
          if (localAreas) {
            const loadedAreas = JSON.parse(localAreas);
            const normalizedAreas = loadedAreas.map((area: any) => ({
              ...area,
              notaAtual: String(area.notaAtual ?? ""),
              notaDesejada: String(area.notaDesejada ?? "")
            }));
            setAreasVida(normalizedAreas);
            setIsEditingAreas(false);
          }
        }

        // Load insight inicial
        const savedInsightInicial = localStorage.getItem("insightInicial");
        if (savedInsightInicial) {
          const parsed = JSON.parse(savedInsightInicial);
          setInsightInicial(parsed.insight || "");
          setHasGeneratedInsight(!!parsed.insight);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storage.isAuthenticated]);

  // Listen for valores updates from the Valores tool
  useEffect(() => {
    const handleValoresUpdated = async () => {
      try {
        const savedValores = await storage.getValores();
        if (savedValores && savedValores.length > 0) {
          const limitedValores = savedValores.slice(0, 6);
          const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
          setValores(valoresCompletos);
          setIsEditingValores(false);
        }
      } catch (error) {
        console.error("Error reloading valores:", error);
      }
    };

    window.addEventListener("valoresUpdated", handleValoresUpdated);
    return () => window.removeEventListener("valoresUpdated", handleValoresUpdated);
  }, [storage]);

  const handleSaveVvd = () => {
    localStorage.setItem("vvd", vvd);
    setIsEditingVvd(false);
    toast.success("Visão de Vida Desejada salva!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Visão de Vida Desejada (VVD)");
    }
    
    storage.saveVvd(vvd).catch(error => {
      console.error("Background VVD sync error:", error);
    });
  };

  const handleEditVvd = () => {
    setIsEditingVvd(true);
  };

  const handleSaveValores = () => {
    const filteredValores = valores.filter(v => v.trim() !== "");
    localStorage.setItem("valores", JSON.stringify(valores));
    setIsEditingValores(false);
    toast.success("Valores salvos!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Valores");
    }
    
    storage.saveValores(filteredValores).catch(error => {
      console.error("Background valores sync error:", error);
    });
  };

  const handleEditValores = () => {
    setIsEditingValores(true);
  };

  const updateValor = (index: number, value: string) => {
    const newValores = [...valores];
    newValores[index] = value;
    setValores(newValores);
  };

  const isValoresComplete = valores.some((valor) => valor.trim() !== "");
  const isAreasComplete = areasVida.length > 0 && areasVida.every(
    (area) => String(area.notaAtual).trim() !== "" && String(area.notaDesejada).trim() !== ""
  );

  // Calcular progresso
  const calculateProgress = () => {
    let count = 0;
    if (vvd && vvd.trim()) count++;
    if (isValoresComplete) count++;
    if (isAreasComplete) count++;
    return Math.round((count / 3) * 100);
  };

  // Handle generate insight
  const handleGenerateInsight = async (fromPurchase = false) => {
    // Administradores não têm limite
    if (!isAdmin && hasGeneratedInsight && !fromPurchase && !aiUsage.hasAvailablePurchase) {
      setShowAILimitModal(true);
      return;
    }

    // Se estiver usando uma compra paga, consumir primeiro
    if (!isAdmin && hasGeneratedInsight && !fromPurchase && aiUsage.hasAvailablePurchase) {
      const consumed = await aiUsage.consumePurchase();
      if (!consumed) {
        toast.error("Erro ao processar sua compra. Tente novamente.");
        return;
      }
    }

    // Validar requisitos mínimos
    const missingItems: string[] = [];
    if (!vvd || vvd.trim() === "") {
      missingItems.push("VVD (Visão de Vida Desejada)");
    }
    if (!isValoresComplete) {
      missingItems.push("Valores pessoais");
    }
    if (!isAreasComplete) {
      missingItems.push("Roda da Vida (Áreas da Vida)");
    }

    if (missingItems.length > 0) {
      toast.error(
        `Para gerar o insight inicial, preencha: ${missingItems.join(", ")}`,
        { duration: 6000 }
      );
      return;
    }

    setIsGeneratingInsight(true);

    try {
      const surveyData = JSON.parse(localStorage.getItem("userSurvey") || "{}");
      const onboardingData = JSON.parse(localStorage.getItem("onboarding") || "{}");

      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { vvd, valores, areasVida, surveyData, onboardingData }
      });

      if (error) {
        console.error("Error generating insight:", error);
        toast.error(error.message || "Erro ao gerar insight");
        return;
      }

      if (data?.insight) {
        setInsightInicial(data.insight);
        setHasGeneratedInsight(true);
        
        // Save to localStorage
        localStorage.setItem("insightInicial", JSON.stringify({
          insight: data.insight,
          date: new Date().toISOString()
        }));
        
        toast.success("Insight inicial gerado com sucesso!");
      }
    } catch (error) {
      console.error("Error generating insight:", error);
      toast.error("Erro ao gerar insight. Tente novamente.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Handle AI purchase
  const handleAIPurchase = async () => {
    const url = await aiUsage.createPurchase('/plano-vida/quem-sou');
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PDILoader text="Carregando..." size="lg" variant="sparkles" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/home")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <LogoutButton />
        </div>

        {/* Inspirational Message Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-lg">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  A jornada começa por dentro
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Antes de traçar seu caminho, é preciso <strong className="text-foreground">saber quem você é</strong>. 
                  O autoconhecimento é a fundação que sustenta seus sonhos. Quando você entende seus valores, 
                  sua essência e o que realmente importa, tudo fica mais claro: seus <strong className="text-foreground">objetivos</strong> ganham 
                  propósito, suas <strong className="text-foreground">metas</strong> ganham direção, suas <strong className="text-foreground">ações</strong> ganham 
                  força, e cada <strong className="text-foreground">passo</strong> se torna uma conquista rumo à vida que você deseja.
                </p>
                <p className="text-sm text-primary font-medium italic">
                  "Conhece-te a ti mesmo e conhecerás o universo." — Oráculo de Delfos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Passo 1</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl">Quem sou Eu</CardTitle>
                <CardDescription>VVD, Valores e Roda da Vida</CardDescription>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{calculateProgress()}%</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="py-8">
                <PDILoader text="Carregando dados..." size="md" variant="sparkles" />
              </div>
            ) : (
              <>
                {/* VVD */}
                <div className="space-y-3">
                  <Label htmlFor="vvd">Visão de Vida Desejada (VVD)</Label>
                  <Textarea
                    id="vvd"
                    placeholder="Escreva sua visão de vida ideal em uma frase..."
                    value={vvd}
                    onChange={(e) => setVvd(e.target.value)}
                    disabled={!isEditingVvd}
                    rows={4}
                    spellCheck="true"
                    className="text-sm"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/ferramentas/metodo-vvd")}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      <Target className="w-4 h-4" />
                      Meu VVD
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {!isEditingVvd && (
                        <Button onClick={handleEditVvd} size="sm" variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                      )}
                      <Button 
                        onClick={handleSaveVvd} 
                        size="sm" 
                        variant="outline"
                        disabled={!vvd || !isEditingVvd}
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Valores */}
                <div className="space-y-3">
                  <Label>Meus Valores (6 principais)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {valores.slice(0, 6).map((valor, index) => (
                      <Input
                        key={index}
                        placeholder={`Valor ${index + 1}`}
                        value={valor}
                        onChange={(e) => updateValor(index, e.target.value)}
                        disabled={!isEditingValores}
                        className="text-sm"
                        spellCheck="true"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/ferramentas/valores")}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      <Heart className="w-4 h-4" />
                      Descobrir valores
                    </Button>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {!isEditingValores && (
                        <Button onClick={handleEditValores} size="sm" variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                      )}
                      <Button 
                        onClick={handleSaveValores} 
                        size="sm" 
                        variant="outline"
                        disabled={!isValoresComplete || !isEditingValores}
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Áreas da Vida */}
                <div className="space-y-3">
                  <Label>Áreas da Vida</Label>
                  
                  {areasVida.length > 0 ? (
                    <div className="rounded-lg border p-4 bg-card max-w-full overflow-hidden">
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={areasVida.map(area => ({
                          area: area.area,
                          atual: Number(area.notaAtual) || 0,
                          desejada: Number(area.notaDesejada) || 0
                        }))}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis
                            dataKey="area"
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 10]}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          />
                          <Radar
                            name="Nota Atual"
                            dataKey="atual"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                          <Radar
                            name="Nota Desejada"
                            dataKey="desejada"
                            stroke="hsl(var(--accent))"
                            fill="hsl(var(--accent))"
                            fillOpacity={0.3}
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-6 bg-muted/20 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhuma área da vida cadastrada. Acesse a Roda da Vida para configurar.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-start">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/roda-da-vida")}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Roda da Vida
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Insight Inicial Section */}
        <Collapsible defaultOpen={!!insightInicial}>
          <Card className="shadow-medium overflow-hidden border-accent/30">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-md">
                      <Lightbulb className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Seu Insight Inicial</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Uma análise sobre quem você é, baseada no seu VVD, valores e áreas da vida
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                {insightInicial ? (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm sm:text-base text-foreground whitespace-pre-line leading-relaxed">
                      {insightInicial}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border bg-muted/20 p-6 text-center">
                    <Lightbulb className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Gere seu insight inicial para descobrir um pouco mais sobre você, 
                      baseado nas informações que você forneceu.
                    </p>
                  </div>
                )}

                {/* Warning for users who already generated */}
                {!isAdmin && hasGeneratedInsight && !aiUsage.hasAvailablePurchase && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                      Você já gerou seu insight inicial gratuito. Para gerar um novo,{' '}
                      <button 
                        onClick={() => setShowAILimitModal(true)}
                        className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-300"
                      >
                        adquira um uso adicional por R$ 10,00
                      </button>.
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleGenerateInsight(false)}
                  disabled={isGeneratingInsight}
                  className="w-full gap-2"
                  variant={hasGeneratedInsight ? "outline" : "default"}
                >
                  {isGeneratingInsight ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Gerando insight...
                    </>
                  ) : hasGeneratedInsight ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Novo Insight
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Insight Inicial
                    </>
                  )}
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Next Step Section */}
        <Card className="shadow-medium border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-5 sm:p-6 text-center space-y-4">
            <Button 
              onClick={() => navigate("/plano-vida/para-onde")} 
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Target className="w-5 h-5" />
              Para onde vou
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Agora que você tem mais clareza sobre quem você é, o próximo passo é criar um objetivo 
              para conquistar o que realmente deseja.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/home")} className="gap-2">
            <Home className="w-4 h-4" />
            Voltar à Home
          </Button>
        </div>
      </div>

      {/* AI Limit Modal */}
      <AIUsageLimitModal
        isOpen={showAILimitModal}
        onClose={() => setShowAILimitModal(false)}
        onPurchase={handleAIPurchase}
        isLoading={aiUsage.isLoading}
        featureType="insight"
        featureName="Insight Inicial"
      />
    </div>
  );
};

export default PlanoVidaQuemSou;
