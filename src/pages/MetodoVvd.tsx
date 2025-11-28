import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Heart, Star, Loader2, Edit, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MetodoVvd = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [freeText, setFreeText] = useState("");
  const [paragraphText, setParagraphText] = useState("");
  const [sentenceText, setSentenceText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingParagraph, setIsEditingParagraph] = useState(false);
  const [isEditingSentence, setIsEditingSentence] = useState(false);

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

  const handleStep1Save = async () => {
    if (!freeText.trim()) {
      toast.error("Por favor, escreva sua visão de vida antes de continuar.");
      return;
    }

    const result = await processVvd(freeText, "paragraph");
    if (result) {
      setParagraphText(result);
      setStep(2);
      toast.success("Texto resumido com sucesso!", {
        description: "Revise e edite se desejar, depois salve para continuar."
      });
    }
  };

  const handleStep2Save = async () => {
    if (!paragraphText.trim()) {
      toast.error("O parágrafo não pode estar vazio.");
      return;
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

  const handleFinalSave = () => {
    if (!sentenceText.trim()) {
      toast.error("A frase não pode estar vazia.");
      return;
    }

    // Salvar no localStorage
    localStorage.setItem("vvd", sentenceText);
    
    // Disparar evento customizado para sincronizar com PlanoDeVida
    window.dispatchEvent(new CustomEvent("vvdUpdated"));

    toast.success("Visão de Vida Desejada salva com sucesso!", {
      description: "Sua VVD foi automaticamente adicionada ao seu Plano de Vida."
    });

    // Redirecionar para home
    setTimeout(() => navigate("/home"), 1500);
  };

  return (
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
          </div>
          <div className="flex gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Free Text */}
        {step === 1 && (
          <Card className="border-2 border-primary/20 shadow-xl animate-fade-in">
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

              <div className="flex justify-end">
                <Button
                  onClick={handleStep1Save}
                  disabled={!freeText.trim() || isProcessing}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Resumir para um Parágrafo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Paragraph */}
        {step === 2 && (
          <Card className="border-2 border-primary/20 shadow-xl animate-fade-in">
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
              <div className="relative">
                <Textarea
                  value={paragraphText}
                  onChange={(e) => setParagraphText(e.target.value)}
                  disabled={!isEditingParagraph}
                  className={`min-h-[200px] text-lg font-medium leading-relaxed ${
                    !isEditingParagraph ? 'bg-muted/30' : 'bg-background'
                  }`}
                  spellCheck
                />
                {!isEditingParagraph && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingParagraph(true)}
                    className="absolute top-2 right-2"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  onClick={handleStep2Save}
                  disabled={!paragraphText.trim() || isProcessing}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Resumir para uma Frase
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Sentence */}
        {step === 3 && (
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
              <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-xl p-8 border-2 border-primary/30">
                {!isEditingSentence ? (
                  <>
                    <p className="text-2xl font-bold text-center leading-relaxed">
                      "{sentenceText}"
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingSentence(true)}
                      className="absolute top-2 right-2"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      value={sentenceText}
                      onChange={(e) => setSentenceText(e.target.value)}
                      className="text-xl font-medium text-center min-h-[120px]"
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

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-center text-muted-foreground">
                  ✨ Esta frase será automaticamente adicionada à seção "Minha Visão de Vida Desejada" no seu Plano de Vida
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  onClick={handleFinalSave}
                  disabled={!sentenceText.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Salvar no Plano de Vida
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MetodoVvd;