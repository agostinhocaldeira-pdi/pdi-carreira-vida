import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Sparkles, Heart, Star, Loader2, Edit, Check, ExternalLink, HelpCircle, ClipboardList, Lightbulb, Home, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import VvdScientificModal from "@/components/VvdScientificModal";
import { useAIUsage } from "@/hooks/useAIUsage";
import { AIUsageLimitModal } from "@/components/AIUsageLimitModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SurveyData {
  currentPhase: string;
  expectations: string;
  wakeUpTime: string;
  exerciseFrequency: string;
  mainGoal: string;
  learningStyle: string;
  biggestChallenge: string;
  motivationSource: string;
}

const MetodoVvd = () => {
  const navigate = useNavigate();
  const { saveVvd, getValores, getAreasVida } = usePDIStorage();
  const [step, setStep] = useState(1);
  const [freeText, setFreeText] = useState("");
  const [paragraphText, setParagraphText] = useState("");
  const [sentenceText, setSentenceText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingParagraph, setIsEditingParagraph] = useState(false);
  const [isEditingSentence, setIsEditingSentence] = useState(false);
  const [hasUsedAI, setHasUsedAI] = useState(false);
  const [isVvdModalOpen, setIsVvdModalOpen] = useState(false);
  const [showSurveySection, setShowSurveySection] = useState(true); // Always show survey
  const [userId, setUserId] = useState<string | null>(null);
  const [showAILimitModal, setShowAILimitModal] = useState(false);
  const [pendingAIStep, setPendingAIStep] = useState<"step1" | "step2" | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // AI Usage hook for purchasing additional usage
  const aiUsage = useAIUsage('vvd');

  const [surveyData, setSurveyData] = useState<SurveyData>({
    currentPhase: "",
    expectations: "",
    wakeUpTime: "",
    exerciseFrequency: "",
    mainGoal: "",
    learningStyle: "",
    biggestChallenge: "",
    motivationSource: "",
  });

  // Verificar se o usuário já usou a IA e obter ID
  useEffect(() => {
    const vvdAIUsed = localStorage.getItem("vvd_ai_used");
    if (vvdAIUsed === "true") {
      setHasUsedAI(true);
    }

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Load existing survey data if available
        const { data: surveyDataDb } = await supabase
          .from("user_surveys")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (surveyDataDb) {
          setSurveyData(prev => ({
            ...prev,
            wakeUpTime: surveyDataDb.wake_up_time || "",
            exerciseFrequency: surveyDataDb.exercise_frequency || "",
            mainGoal: surveyDataDb.main_goal || "",
            learningStyle: surveyDataDb.learning_style || "",
            biggestChallenge: surveyDataDb.biggest_challenge || "",
            motivationSource: surveyDataDb.motivation_source || "",
          }));
        }

        const { data: onboardingData } = await supabase
          .from("user_onboarding")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (onboardingData) {
          setSurveyData(prev => ({
            ...prev,
            currentPhase: onboardingData.current_phase || "",
            expectations: onboardingData.expectations || "",
          }));
        }
      }
    };
    getUser();
  }, []);

  const processVvd = async (text: string, stepType: "paragraph" | "sentence") => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-vvd", {
        body: { text, step: stepType }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error("Erro ao processar VVD:", error);
      toast.error("Erro ao processar seu texto. Tente novamente.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStep1Save = async (fromPurchase = false) => {
    if (!freeText.trim()) {
      toast.error("Por favor, escreva sua visão de vida antes de continuar.");
      return;
    }

    if (hasUsedAI && !fromPurchase && !aiUsage.hasAvailablePurchase) {
      // Show purchase modal
      setPendingAIStep("step1");
      setShowAILimitModal(true);
      return;
    }

    // If using a paid purchase, consume it
    if (hasUsedAI && !fromPurchase && aiUsage.hasAvailablePurchase) {
      const consumed = await aiUsage.consumePurchase();
      if (!consumed) {
        toast.error("Erro ao processar sua compra. Tente novamente.");
        return;
      }
    }

    const result = await processVvd(freeText, "paragraph");
    if (result) {
      setParagraphText(result);
      setStep(2);
      setShowSurveySection(true);
      // Marcar que a IA foi usada (apenas primeira vez gratuita)
      if (!hasUsedAI) {
        localStorage.setItem("vvd_ai_used", "true");
        setHasUsedAI(true);
      }
      toast.success("Texto resumido com sucesso!", {
        description: "Revise e edite se desejar, depois salve para continuar."
      });
    }
  };

  const handleStep1ManualSave = () => {
    if (!freeText.trim()) {
      toast.error("Por favor, escreva sua visão de vida antes de continuar.");
      return;
    }
    setParagraphText(freeText);
    setStep(2);
    setShowSurveySection(true); // Show survey questions
    toast.success("Texto salvo!", {
      description: "Agora você pode prosseguir para a próxima etapa."
    });
  };

  const handleStep2Save = async (fromPurchase = false) => {
    if (!paragraphText.trim()) {
      toast.error("O parágrafo não pode estar vazio.");
      return;
    }

    if (hasUsedAI && !fromPurchase && !aiUsage.hasAvailablePurchase) {
      setPendingAIStep("step2");
      setShowAILimitModal(true);
      return;
    }

    if (hasUsedAI && !fromPurchase && aiUsage.hasAvailablePurchase) {
      const consumed = await aiUsage.consumePurchase();
      if (!consumed) {
        toast.error("Erro ao processar sua compra. Tente novamente.");
        return;
      }
    }

    const result = await processVvd(paragraphText, "sentence");
    if (result) {
      setSentenceText(result);
      setStep(3);
      toast.success("Sua essência foi capturada!", {
        description: "Revise sua frase final e salve quando estiver pronto."
      });
    }
  };

  const handleStep2ManualSave = () => {
    if (!paragraphText.trim()) {
      toast.error("O parágrafo não pode estar vazio.");
      return;
    }
    setSentenceText(paragraphText);
    setStep(3);
    toast.success("Parágrafo salvo!", {
      description: "Agora você pode finalizar sua VVD."
    });
  };

  const saveSurveyData = async () => {
    if (!userId) return;

    try {
      // Save onboarding data
      await supabase
        .from("user_onboarding")
        .upsert({
          user_id: userId,
          current_phase: surveyData.currentPhase,
          expectations: surveyData.expectations,
        }, { onConflict: "user_id" });

      // Save survey data
      await supabase
        .from("user_surveys")
        .upsert({
          user_id: userId,
          wake_up_time: surveyData.wakeUpTime,
          exercise_frequency: surveyData.exerciseFrequency,
          main_goal: surveyData.mainGoal,
          learning_style: surveyData.learningStyle,
          biggest_challenge: surveyData.biggestChallenge,
          motivation_source: surveyData.motivationSource,
        }, { onConflict: "user_id" });

      // Save locally too
      localStorage.setItem("onboarding", JSON.stringify({
        currentPhase: surveyData.currentPhase,
        expectations: surveyData.expectations,
      }));
      localStorage.setItem("userSurvey", JSON.stringify(surveyData));
    } catch (error) {
      console.error("Erro ao salvar dados complementares:", error);
    }
  };

  const checkNextTool = async (): Promise<string | null> => {
    try {
      // Check Valores
      const valores = await getValores();
      const hasValores = valores && valores.length >= 6;
      
      if (!hasValores) {
        return "/ferramentas/valores";
      }

      // Check Roda da Vida
      const areas = await getAreasVida();
      const hasRodaVida = areas && areas.some(a => a.nota_atual > 0 || a.nota_desejada > 0);
      
      if (!hasRodaVida) {
        return "/roda-da-vida";
      }

      // All tools completed
      return null;
    } catch (error) {
      console.error("Erro ao verificar próxima ferramenta:", error);
      return null;
    }
  };

  const handleFinalSave = async () => {
    if (!sentenceText.trim()) {
      toast.error("A frase não pode estar vazia.");
      return;
    }

    try {
      // Salvar dados do survey junto com o VVD
      await saveSurveyData();

      // Salvar via usePDIStorage (Supabase ou localStorage)
      await saveVvd(sentenceText);
      
      // Disparar evento customizado para sincronizar com PlanoDeVida
      window.dispatchEvent(new CustomEvent("vvdUpdated"));

      toast.success("Visão de Vida Desejada salva com sucesso!", {
        description: "Sua VVD foi automaticamente adicionada ao seu Plano de Vida."
      });

      // Check next tool to navigate
      const nextTool = await checkNextTool();
      
      if (nextTool) {
        // Navigate to next unfilled tool
        setTimeout(() => navigate(nextTool), 1500);
      } else {
        // All tools completed - show modal
        setTimeout(() => setShowCompletionModal(true), 1500);
      }
    } catch (error) {
      console.error("Erro ao salvar VVD:", error);
      toast.error("Erro ao salvar VVD. Tente novamente.");
    }
  };

  const handlePurchaseAI = async () => {
    const url = await aiUsage.createPurchase('/ferramentas/vvd');
    if (url) {
      window.location.href = url;
    }
  };

  // Handle purchase verification and trigger AI
  useEffect(() => {
    if (aiUsage.hasAvailablePurchase && pendingAIStep) {
      if (pendingAIStep === "step1") {
        handleStep1Save(true);
      } else if (pendingAIStep === "step2") {
        handleStep2Save(true);
      }
      setPendingAIStep(null);
    }
  }, [aiUsage.hasAvailablePurchase]);

  return (
    <>
      <AIUsageLimitModal
        isOpen={showAILimitModal}
        onClose={() => setShowAILimitModal(false)}
        onPurchase={handlePurchaseAI}
        isLoading={aiUsage.isLoading}
        featureType="vvd"
        featureName="VVD com IA"
      />
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/ferramentas")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Método VVD
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão de Vida Desejada - Descubra sua essência
            </p>
            <button 
              onClick={() => setIsVvdModalOpen(true)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              <span className="sm:hidden">Entenda melhor</span>
              <span className="hidden sm:inline">Entenda a importância de saber claramente o que você quer para sua vida</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${step === 1 ? 'ring-2 ring-primary ring-offset-2' : ''} cursor-pointer`}
            >
              1
            </button>
            <button
              onClick={() => paragraphText && setStep(2)}
              disabled={!paragraphText}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${step === 2 ? 'ring-2 ring-primary ring-offset-2' : ''} ${paragraphText ? 'cursor-pointer' : ''}`}
            >
              2
            </button>
            <button
              onClick={() => sentenceText && setStep(3)}
              disabled={!sentenceText}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
                step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${step === 3 ? 'ring-2 ring-primary ring-offset-2' : ''} ${sentenceText ? 'cursor-pointer' : ''}`}
            >
              3
            </button>
          </div>
        </div>

        {/* Step 1: Free Text */}
        {step >= 1 && (
          <Card className={`border-2 shadow-xl animate-fade-in mb-6 ${step === 1 ? 'border-primary/20' : 'border-muted/20'}`}>
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Como você deseja que sua vida seja?</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Escreva livremente sobre a vida que você sonha viver, baseado em seus valores e nas áreas que mais importam para você.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent" />
                      Exemplo de VVD:
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      "Quero viver com integridade, ser uma pessoa honesta, responsável e compassiva, buscando sempre o crescimento pessoal e profissional.
                      Eu valorizo a importância da família e dos amigos, e me esforço para cultivar relacionamentos saudáveis e significativos..."
                    </p>
                  </div>

                  <Textarea
                    value={freeText}
                    onChange={(e) => setFreeText(e.target.value)}
                    placeholder="Comece a escrever sua visão de vida desejada aqui..."
                    className="min-h-[300px] text-base resize-none focus:ring-2 focus:ring-primary"
                    spellCheck
                  />

                  {hasUsedAI && (
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        ℹ️ Você já utilizou a IA para criar seu VVD. Para fazer alterações, prossiga manualmente ou use o botão Editar nas próximas etapas.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                      onClick={handleStep1ManualSave}
                      disabled={!freeText.trim()}
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={() => handleStep1Save()}
                      disabled={!freeText.trim() || isProcessing}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processando...
                        </>
                      ) : hasUsedAI ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          IA já utilizada
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Resumir para um Parágrafo
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-muted">
                    <Button
                      variant="ghost"
                      className="w-full justify-center gap-2 text-muted-foreground hover:text-primary"
                      onClick={() => navigate("/home")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Voltar Dashboard
                    </Button>
                  </div>
                </>
              )}
              
              {step > 1 && (
                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{freeText}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Paragraph + Survey Questions */}
        {step >= 2 && (
          <>
            <Card className={`border-2 shadow-xl animate-fade-in mb-6 ${step === 2 ? 'border-primary/20' : 'border-muted/20'}`}>
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sua Visão em um Parágrafo</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Aqui está a essência do que você realmente quer para sua vida. Revise e edite se desejar.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 2 && (
                  <>
                    <div className="space-y-3">
                      {!isEditingParagraph && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingParagraph(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      )}
                      <Textarea
                        value={paragraphText}
                        onChange={(e) => setParagraphText(e.target.value)}
                        disabled={!isEditingParagraph}
                        className={`min-h-[200px] text-lg font-medium leading-relaxed ${
                          !isEditingParagraph ? 'bg-muted/30' : 'bg-background'
                        }`}
                        spellCheck
                      />
                    </div>

                    {hasUsedAI && (
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground text-center">
                          ℹ️ Você já utilizou a IA. Para continuar, edite manualmente o texto acima ou prossiga para a próxima etapa.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        disabled={isProcessing}
                        className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                      </Button>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                          onClick={handleStep2ManualSave}
                          disabled={!paragraphText.trim()}
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          Salvar
                        </Button>
                        <Button
                          onClick={() => handleStep2Save()}
                          disabled={!paragraphText.trim() || isProcessing}
                          size="lg"
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Processando...
                            </>
                          ) : hasUsedAI ? (
                            <>
                              <Sparkles className="h-5 w-5 mr-2" />
                              IA já utilizada
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5 mr-2" />
                              Resumir para uma Frase
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-muted">
                      <Button
                        variant="ghost"
                        className="w-full justify-center gap-2 text-muted-foreground hover:text-primary"
                        onClick={() => navigate("/home")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Voltar Dashboard
                      </Button>
                    </div>
                  </>
                )}

                {step > 2 && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                    <p className="text-base font-medium text-muted-foreground whitespace-pre-wrap">{paragraphText}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Survey Questions Section - appears after paragraph generation */}
            {showSurveySection && step === 2 && (
              <Card className="border-2 border-accent/30 shadow-xl animate-fade-in mb-6">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Complemente seu VVD</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Complete estas informações para extrair um insight mais profundo da IA
                      </CardDescription>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      ✨ <strong>Estas informações nos ajudarão a criar uma experiência personalizada para você.</strong> 
                      Conhecer seus hábitos e preferências nos permite oferecer insights mais relevantes e 
                      sugestões alinhadas com seu estilo de vida.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Fase Atual */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPhase" className="font-semibold">Como você descreveria o momento que está vivendo agora?</Label>
                    <Input
                      id="currentPhase"
                      placeholder="Ex: Em transição de carreira, buscando propósito..."
                      value={surveyData.currentPhase}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, currentPhase: e.target.value }))}
                      spellCheck
                    />
                  </div>

                  {/* Expectativas */}
                  <div className="space-y-2">
                    <Label htmlFor="expectations" className="font-semibold">O que você espera alcançar com o PDI?</Label>
                    <Textarea
                      id="expectations"
                      placeholder="Compartilhe suas expectativas, sonhos e o que deseja conquistar..."
                      value={surveyData.expectations}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, expectations: e.target.value }))}
                      rows={3}
                      spellCheck
                    />
                  </div>

                  {/* Horário de acordar */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Que horas você costuma acordar?</Label>
                    <RadioGroup
                      value={surveyData.wakeUpTime}
                      onValueChange={(value) => setSurveyData(prev => ({ ...prev, wakeUpTime: value }))}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="antes-6h" id="vvd-antes-6h" />
                        <Label htmlFor="vvd-antes-6h" className="font-normal cursor-pointer">Antes das 6h</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6h-8h" id="vvd-6h-8h" />
                        <Label htmlFor="vvd-6h-8h" className="font-normal cursor-pointer">Entre 6h e 8h</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="8h-10h" id="vvd-8h-10h" />
                        <Label htmlFor="vvd-8h-10h" className="font-normal cursor-pointer">Entre 8h e 10h</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="depois-10h" id="vvd-depois-10h" />
                        <Label htmlFor="vvd-depois-10h" className="font-normal cursor-pointer">Depois das 10h</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Frequência de exercícios */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Com que frequência você pratica exercícios físicos?</Label>
                    <RadioGroup
                      value={surveyData.exerciseFrequency}
                      onValueChange={(value) => setSurveyData(prev => ({ ...prev, exerciseFrequency: value }))}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nunca" id="vvd-nunca" />
                        <Label htmlFor="vvd-nunca" className="font-normal cursor-pointer">Raramente/Nunca</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-2x" id="vvd-1-2x" />
                        <Label htmlFor="vvd-1-2x" className="font-normal cursor-pointer">1-2x por semana</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3-4x" id="vvd-3-4x" />
                        <Label htmlFor="vvd-3-4x" className="font-normal cursor-pointer">3-4x por semana</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5+x" id="vvd-5+x" />
                        <Label htmlFor="vvd-5+x" className="font-normal cursor-pointer">5x ou mais</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Principal objetivo */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Qual seu principal objetivo agora?</Label>
                    <RadioGroup
                      value={surveyData.mainGoal}
                      onValueChange={(value) => setSurveyData(prev => ({ ...prev, mainGoal: value }))}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="carreira" id="vvd-carreira" />
                        <Label htmlFor="vvd-carreira" className="font-normal cursor-pointer">Crescer na carreira</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="saude" id="vvd-saude" />
                        <Label htmlFor="vvd-saude" className="font-normal cursor-pointer">Melhorar a saúde</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="financeiro" id="vvd-financeiro" />
                        <Label htmlFor="vvd-financeiro" className="font-normal cursor-pointer">Estabilidade financeira</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="relacionamentos" id="vvd-relacionamentos" />
                        <Label htmlFor="vvd-relacionamentos" className="font-normal cursor-pointer">Melhorar relacionamentos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equilibrio" id="vvd-equilibrio" />
                        <Label htmlFor="vvd-equilibrio" className="font-normal cursor-pointer">Equilíbrio vida/trabalho</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="autoconhecimento" id="vvd-autoconhecimento" />
                        <Label htmlFor="vvd-autoconhecimento" className="font-normal cursor-pointer">Autoconhecimento</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Estilo de aprendizado */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Como você prefere aprender coisas novas?</Label>
                    <RadioGroup
                      value={surveyData.learningStyle}
                      onValueChange={(value) => setSurveyData(prev => ({ ...prev, learningStyle: value }))}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lendo" id="vvd-lendo" />
                        <Label htmlFor="vvd-lendo" className="font-normal cursor-pointer">Lendo livros/artigos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="videos" id="vvd-videos" />
                        <Label htmlFor="vvd-videos" className="font-normal cursor-pointer">Assistindo vídeos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="praticando" id="vvd-praticando" />
                        <Label htmlFor="vvd-praticando" className="font-normal cursor-pointer">Praticando/Fazendo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conversando" id="vvd-conversando" />
                        <Label htmlFor="vvd-conversando" className="font-normal cursor-pointer">Conversando com pessoas</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Maior desafio */}
                  <div className="space-y-2">
                    <Label htmlFor="biggestChallenge" className="font-semibold">Qual seu maior desafio no momento?</Label>
                    <Textarea
                      id="biggestChallenge"
                      placeholder="Descreva brevemente seu maior desafio atual..."
                      value={surveyData.biggestChallenge}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, biggestChallenge: e.target.value }))}
                      rows={3}
                      spellCheck
                    />
                  </div>

                  {/* Fonte de motivação */}
                  <div className="space-y-2">
                    <Label htmlFor="motivationSource" className="font-semibold">O que mais te motiva?</Label>
                    <Textarea
                      id="motivationSource"
                      placeholder="O que te faz levantar da cama todos os dias?"
                      value={surveyData.motivationSource}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, motivationSource: e.target.value }))}
                      rows={3}
                      spellCheck
                    />
                  </div>

                  {/* Botão Salvar Informações Complementares */}
                  <div className="pt-4 border-t border-muted">
                    <Button
                      onClick={async () => {
                        await saveSurveyData();
                        toast.success("Informações complementares salvas!", {
                          description: "Esses dados serão utilizados para gerar insights mais profundos."
                        });
                      }}
                      disabled={!surveyData.currentPhase && !surveyData.expectations && !surveyData.biggestChallenge && !surveyData.motivationSource}
                      className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Salvar Informações Complementares
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      💡 Essas informações serão utilizadas para gerar insights personalizados mais profundos
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Step 3: Sentence */}
        {step >= 3 && (
          <Card className="border-2 border-primary/20 shadow-xl animate-fade-in">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Sua Essência em Uma Frase</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Esta é sua declaração de Visão de Vida Desejada. Carregue-a sempre com você.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {!isEditingSentence && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingSentence(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                )}
                <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-xl p-4 sm:p-8 border-2 border-primary/30">
                  {!isEditingSentence ? (
                    <p className="text-lg sm:text-2xl font-bold text-center leading-relaxed break-words">
                      "{sentenceText}"
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <Textarea
                        value={sentenceText}
                        onChange={(e) => setSentenceText(e.target.value)}
                        className="text-base sm:text-xl font-medium text-center min-h-[120px]"
                        spellCheck
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingSentence(false)}
                        className="w-full"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirmar Edição
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar página
                </Button>
                <Button
                  onClick={handleFinalSave}
                  disabled={!sentenceText.trim()}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Salvar no Plano de Vida
                </Button>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-center text-muted-foreground">
                  ✨ Esta frase será automaticamente adicionada à seção "Minha Visão de Vida Desejada" no seu Plano de Vida
                </p>
              </div>

              <div className="pt-4 border-t border-muted">
                <Button
                  variant="ghost"
                  className="w-full justify-center gap-2 text-muted-foreground hover:text-primary"
                  onClick={() => navigate("/home")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Voltar Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* VVD Scientific Modal */}
      <VvdScientificModal 
        open={isVvdModalOpen} 
        onOpenChange={setIsVvdModalOpen} 
      />

      {/* Completion Modal - All Step 1 tools completed */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              🎉 Parabéns!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Você concluiu todas as atividades do <strong>Passo 1: Quem Sou Eu</strong>!
              <br /><br />
              O que deseja fazer agora?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => {
                setShowCompletionModal(false);
                navigate("/plano-vida/para-onde");
              }}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Iniciar Passo 2: Para Onde Vou
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCompletionModal(false);
                navigate("/home");
              }}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar para Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default MetodoVvd;
