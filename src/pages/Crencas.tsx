import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Brain, 
  Lock,
  Unlock,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  ChevronRight,
  Check,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LogoutButton from "@/components/LogoutButton";
import BeliefsScientificModal from "@/components/BeliefsScientificModal";

interface CrencaData {
  crencaLimitante: string;
  origem: string;
  impacto: string;
  evidenciasContra: string;
  crencaPositiva: string;
  planoAcao: string;
  dataCriacao: string;
}

const Crencas = () => {
  const [etapa, setEtapa] = useState(0);
  const [crencaData, setCrencaData] = useState<CrencaData>({
    crencaLimitante: "",
    origem: "",
    impacto: "",
    evidenciasContra: "",
    crencaPositiva: "",
    planoAcao: "",
    dataCriacao: new Date().toISOString()
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [crencasSalvas, setCrencasSalvas] = useState<CrencaData[]>([]);
  const [isBeliefsModalOpen, setIsBeliefsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem("crencas_trabalho");
    if (saved) {
      setCrencasSalvas(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (field: keyof CrencaData, value: string) => {
    setCrencaData(prev => ({ ...prev, [field]: value }));
  };

  const podeAvancar = () => {
    switch (etapa) {
      case 0: return true; // Introdução
      case 1: return crencaData.crencaLimitante.trim().length > 0;
      case 2: return crencaData.origem.trim().length > 0;
      case 3: return crencaData.impacto.trim().length > 0;
      case 4: return crencaData.evidenciasContra.trim().length > 0;
      case 5: return crencaData.crencaPositiva.trim().length > 0;
      case 6: return crencaData.planoAcao.trim().length > 0;
      default: return false;
    }
  };

  const handleProximo = () => {
    if (etapa < 6) {
      setEtapa(etapa + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVoltar = () => {
    if (etapa > 0) {
      setEtapa(etapa - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSalvar = () => {
    const novasCrencas = [...crencasSalvas, crencaData];
    localStorage.setItem("crencas_trabalho", JSON.stringify(novasCrencas));
    setCrencasSalvas(novasCrencas);
    setShowSuccessDialog(true);
    toast.success("Transformação de crença concluída!");
  };

  const handleNovaCrenca = () => {
    setCrencaData({
      crencaLimitante: "",
      origem: "",
      impacto: "",
      evidenciasContra: "",
      crencaPositiva: "",
      planoAcao: "",
      dataCriacao: new Date().toISOString()
    });
    setEtapa(0);
    setShowSuccessDialog(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressoPercentual = ((etapa + 1) / 7) * 100;

  const renderEtapa = () => {
    switch (etapa) {
      case 0:
        return (
          <div className="space-y-8 animate-fade-in">
            <Card className="border-2 border-primary/30 shadow-elegant bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">O Poder das Crenças</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Nossas crenças moldam nossa realidade. Elas funcionam como filtros mentais que determinam 
                      o que consideramos possível ou impossível em nossas vidas.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Unlock className="w-5 h-5 text-green-600" />
                        <CardTitle className="text-base text-green-600">Crenças Positivas</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        São crenças que nos impulsionam, fortalecem nossa autoconfiança e nos permitem crescer:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>"Sou capaz de aprender coisas novas"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>"Mereço sucesso e felicidade"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>"Posso superar desafios"</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/30 bg-red-500/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        <CardTitle className="text-base text-red-600">Crenças Limitantes</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        São crenças que nos aprisionam, sabotam nosso potencial e impedem nosso crescimento:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>"Não sou bom o suficiente"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>"Nunca vou conseguir"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>"Não mereço ser feliz"</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-destructive mb-2">⚠️ Atenção Importante</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Muitas vezes, <strong>crenças limitantes invisíveis</strong> estão te impedindo de alcançar 
                          seus objetivos sem que você perceba. Elas atuam como sabotadores silenciosos, 
                          criando barreiras mentais que parecem reais, mas são apenas construções da sua mente.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center pt-4">
                  <p className="text-lg font-medium mb-2">
                    Vamos identificar e transformar suas crenças limitantes?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Este processo guiado vai te ajudar a reconhecer, questionar e substituir crenças que te limitam.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-red-500/30 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-glow">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Identifique sua Crença Limitante</CardTitle>
                    <CardDescription>Qual crença está te impedindo de avançar?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">💭 Exemplos de crenças limitantes comuns:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• "Não tenho tempo suficiente para mudar"</li>
                    <li>• "Sou velho demais para começar algo novo"</li>
                    <li>• "Não sou inteligente o suficiente"</li>
                    <li>• "Preciso ser perfeito para começar"</li>
                    <li>• "Minha história define meu futuro"</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Escreva aqui sua crença limitante <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex: Eu não sou bom o suficiente para conseguir essa promoção..."
                    value={crencaData.crencaLimitante}
                    onChange={(e) => handleInputChange("crencaLimitante", e.target.value)}
                    className="min-h-[120px] resize-none"
                    spellCheck="true"
                  />
                  <p className="text-xs text-muted-foreground">
                    Seja honesto(a) consigo mesmo(a). Este é um espaço seguro para reflexão.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-primary/30 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Descubra a Origem</CardTitle>
                    <CardDescription>De onde veio essa crença?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium mb-2">🔍 Sua crença limitante:</p>
                    <p className="text-base italic text-muted-foreground">"{crencaData.crencaLimitante}"</p>
                  </CardContent>
                </Card>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">💡 Perguntas para reflexão:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Quando você começou a acreditar nisso?</li>
                    <li>• Quem te disse isso pela primeira vez?</li>
                    <li>• Que experiência originou essa crença?</li>
                    <li>• Essa crença é realmente sua ou você a "herdou" de alguém?</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Qual a origem dessa crença? <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex: Desde criança, meus pais sempre diziam que eu não era bom em matemática, e isso me fez acreditar que eu não era inteligente..."
                    value={crencaData.origem}
                    onChange={(e) => handleInputChange("origem", e.target.value)}
                    className="min-h-[120px] resize-none"
                    spellCheck="true"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-destructive/30 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-destructive to-red-600 rounded-xl flex items-center justify-center shadow-glow">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Reconheça o Impacto</CardTitle>
                    <CardDescription>Como essa crença afeta sua vida?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium mb-2">🔍 Sua crença limitante:</p>
                    <p className="text-base italic text-muted-foreground">"{crencaData.crencaLimitante}"</p>
                  </CardContent>
                </Card>

                <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-2">⚠️ Impactos de crenças limitantes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Oportunidades perdidas por medo de tentar</li>
                    <li>• Baixa autoestima e confiança reduzida</li>
                    <li>• Relacionamentos afetados negativamente</li>
                    <li>• Procrastinação e autossabotagem</li>
                    <li>• Objetivos não alcançados</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Como essa crença tem impactado sua vida, carreira e relacionamentos? <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex: Esta crença me fez recusar várias oportunidades de promoção porque achava que não era capaz. Também afetou minha confiança em reuniões..."
                    value={crencaData.impacto}
                    onChange={(e) => handleInputChange("impacto", e.target.value)}
                    className="min-h-[140px] resize-none"
                    spellCheck="true"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-primary/30 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Questione a Crença</CardTitle>
                    <CardDescription>Busque evidências contrárias</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium mb-2">🔍 Sua crença limitante:</p>
                    <p className="text-base italic text-muted-foreground">"{crencaData.crencaLimitante}"</p>
                  </CardContent>
                </Card>

                <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/20">
                  <p className="text-sm font-medium text-green-700 mb-2">✅ Desafie sua crença:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Que evidências concretas provam que essa crença é FALSA?</li>
                    <li>• Quando você já provou o contrário dessa crença?</li>
                    <li>• Você conhece alguém que superou uma crença similar?</li>
                    <li>• Que conquistas suas contradizem essa crença?</li>
                    <li>• Se um amigo dissesse isso sobre si mesmo, o que você diria?</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Liste evidências que CONTRADIZEM sua crença limitante <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex: Já fui promovido duas vezes na minha carreira. Meus colegas me procuram para tirar dúvidas. Concluí uma especialização com boas notas..."
                    value={crencaData.evidenciasContra}
                    onChange={(e) => handleInputChange("evidenciasContra", e.target.value)}
                    className="min-h-[140px] resize-none"
                    spellCheck="true"
                  />
                  <p className="text-xs text-muted-foreground">
                    Seja generoso(a) consigo mesmo(a). Liste todas as evidências que você conseguir lembrar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-green-500/30 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-glow">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Crie uma Crença Positiva</CardTitle>
                    <CardDescription>Reformule sua crença de forma empoderadora</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-red-500/5 border-red-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-medium text-red-600">Crença Antiga (Limitante)</p>
                      </div>
                      <p className="text-sm italic text-muted-foreground">"{crencaData.crencaLimitante}"</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Unlock className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-green-600">Nova Crença (Empoderadora)</p>
                      </div>
                      <p className="text-sm text-muted-foreground">A ser criada por você agora ↓</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/20">
                  <p className="text-sm font-medium text-green-700 mb-2">💚 Dicas para criar uma crença positiva:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Use o tempo PRESENTE ("Eu sou" ao invés de "Eu serei")</li>
                    <li>• Seja ESPECÍFICO e realista</li>
                    <li>• Foque no que você QUER (não no que não quer)</li>
                    <li>• Use palavras que te inspirem e motivem</li>
                    <li>• Baseie-se nas evidências que você listou</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Sua nova crença empoderadora <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex: Eu sou competente e capaz de alcançar minhas metas profissionais. Tenho habilidades valiosas e continuo aprendendo todos os dias..."
                    value={crencaData.crencaPositiva}
                    onChange={(e) => handleInputChange("crencaPositiva", e.target.value)}
                    className="min-h-[120px] resize-none border-green-500/30 focus:border-green-500"
                    spellCheck="true"
                  />
                  <p className="text-xs text-green-600 font-medium">
                    ✨ Esta será sua nova verdade. Repita-a diariamente!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-primary/30 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Plano de Ação</CardTitle>
                    <CardDescription>Como você vai reforçar sua nova crença?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-600">Sua nova crença empoderadora:</p>
                    </div>
                    <p className="text-base italic text-foreground font-medium">"{crencaData.crencaPositiva}"</p>
                  </CardContent>
                </Card>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">🎯 Sugestões de ações para fortalecer sua nova crença:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Escreva sua nova crença em post-its e cole em lugares visíveis</li>
                    <li>• Repita sua nova crença em voz alta todos os dias ao acordar</li>
                    <li>• Busque uma pequena vitória diária que comprove sua nova crença</li>
                    <li>• Cerque-se de pessoas que reforcem sua nova identidade</li>
                    <li>• Leia livros ou assista vídeos sobre pessoas que superaram crenças similares</li>
                    <li>• Celebre cada progresso, por menor que seja</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Que ações concretas você vai tomar para fortalecer esta crença? <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Ex: Vou escrever minha nova crença no espelho do banheiro. Toda semana, vou fazer uma tarefa que antes evitava por falta de confiança. Vou conversar com meu mentor sobre minhas conquistas..."
                    value={crencaData.planoAcao}
                    onChange={(e) => handleInputChange("planoAcao", e.target.value)}
                    className="min-h-[140px] resize-none"
                    spellCheck="true"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold truncate">Transformação de Crenças</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/ferramentas">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Link para modal científico */}
        <div className="mb-6">
          <button
            onClick={() => setIsBeliefsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="sm:hidden">Entenda melhor</span>
            <span className="hidden sm:inline">Entenda a importância de transformar suas crenças limitantes</span>
          </button>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 shadow-medium">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso da Transformação</span>
                <span className="text-muted-foreground">Etapa {etapa + 1} de 7</span>
              </div>
              <Progress value={progressoPercentual} className="h-2" />
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Introdução",
                  "Identificar",
                  "Origem",
                  "Impacto",
                  "Questionar",
                  "Reformular",
                  "Agir"
                ].map((label, index) => (
                  <Badge
                    key={index}
                    variant={index === etapa ? "default" : index < etapa ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {index < etapa && <Check className="w-3 h-3 mr-1" />}
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo da Etapa */}
        {renderEtapa()}

        {/* Botões de Navegação */}
        <Card className="mt-6 shadow-medium">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                variant="outline"
                onClick={handleVoltar}
                disabled={etapa === 0}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              {etapa < 6 ? (
                <Button
                  onClick={handleProximo}
                  disabled={!podeAvancar()}
                  className="w-full sm:w-auto gap-2"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSalvar}
                  disabled={!podeAvancar()}
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Sparkles className="w-4 h-4" />
                  Concluir Transformação
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crenças Trabalhadas */}
        {crencasSalvas.length > 0 && etapa === 0 && (
          <Card className="mt-6 shadow-medium animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Suas Transformações ({crencasSalvas.length})
              </CardTitle>
              <CardDescription>Crenças que você já trabalhou</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {crencasSalvas.map((crenca, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Crença antiga:</p>
                        <p className="text-sm line-through opacity-70">{crenca.crencaLimitante}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Nova crença:</p>
                        <p className="text-sm font-medium text-green-700">{crenca.crencaPositiva}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trabalhada em: {new Date(crenca.dataCriacao).toLocaleDateString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Botões Finais */}
        {etapa === 0 && (
          <Card className="mt-6 shadow-medium">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/home">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Dashboard
                  </Button>
                </Link>
                <Link to="/ferramentas">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar às Ferramentas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-glow animate-scale-in">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Transformação Concluída! 🎉</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-base">
                Parabéns! Você deu um passo importante no seu desenvolvimento pessoal.
              </p>
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-green-700 mb-2">Sua nova crença:</p>
                  <p className="text-sm italic">"{crencaData.crencaPositiva}"</p>
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground">
                Lembre-se de praticar diariamente as ações do seu plano para fortalecer essa nova crença!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleNovaCrenca} className="w-full">
              Trabalhar Outra Crença
            </Button>
            <Link to="/home" className="w-full">
              <Button variant="outline" className="w-full">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Científico */}
      <BeliefsScientificModal 
        open={isBeliefsModalOpen} 
        onOpenChange={setIsBeliefsModalOpen} 
      />
    </div>
  );
};

export default Crencas;