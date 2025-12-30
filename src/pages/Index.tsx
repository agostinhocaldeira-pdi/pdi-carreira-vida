import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Rocket, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  Compass,
  Brain,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Heart,
  Lightbulb,
  User,
  Building2,
  Check,
  Users,
  BarChart3,
  Calendar,
  Bell,
  FileText,
  Star,
  Zap,
  Crown,
  Cpu,
  Mail,
  MessageCircle,
  Download,
  Shield,
  Smartphone,
  Play,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import DiaryScientificModal from "@/components/DiaryScientificModal";
import ValuesScientificModal from "@/components/ValuesScientificModal";
import { LifeWheelScientificModal } from "@/components/LifeWheelScientificModal";
import SwotScientificModal from "@/components/SwotScientificModal";
import VvdScientificModal from "@/components/VvdScientificModal";
import SmartScientificModal from "@/components/SmartScientificModal";
import EisenhowerScientificModal from "@/components/EisenhowerScientificModal";
import BeliefsScientificModal from "@/components/BeliefsScientificModal";
import Autoavaliacao360ScientificModal from "@/components/Autoavaliacao360ScientificModal";
import heroPdiTarget from "@/assets/hero-pdi-target.png";
import journeyPath from "@/assets/journey-path.jpg";
import selfDiscovery from "@/assets/self-discovery.jpg";
import growthStairs from "@/assets/growth-stairs.jpg";
import problemSolution from "@/assets/problem-solution.png";
import pdiFocusTarget from "@/assets/pdi-focus-target.png";
import agostinhoCaldeira from "@/assets/agostinho-caldeira-new.jpg";
import diaryMoodChart from "@/assets/diary-mood-chart-example.png";

// Import testimonial photos
import ericPereira from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleCampos from "@/assets/testimonials/gabriele-campos.jpg";
import larissaSchuartz from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasSa from "@/assets/testimonials/lucas-sa.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJourneyExpanded, setIsJourneyExpanded] = useState(true);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isValuesModalOpen, setIsValuesModalOpen] = useState(false);
  const [isLifeWheelModalOpen, setIsLifeWheelModalOpen] = useState(false);
  const [isSwotModalOpen, setIsSwotModalOpen] = useState(false);
  const [isVvdModalOpen, setIsVvdModalOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [isEisenhowerModalOpen, setIsEisenhowerModalOpen] = useState(false);
  const [isBeliefsModalOpen, setIsBeliefsModalOpen] = useState(false);
  const [isAutoavaliacaoModalOpen, setIsAutoavaliacaoModalOpen] = useState(false);

  const journeySteps = [
    {
      icon: Rocket,
      title: "Onboarding Personalizado",
      description: "Você não é todo mundo. Por isso, começamos entendendo sua fase de vida, seus desafios e o que você espera conquistar. Sem fórmulas genéricas.",
      insight: "A clareza sobre onde você está é o primeiro passo para chegar onde quer.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Brain,
      title: "Autoconhecimento Profundo",
      description: "Antes de traçar qualquer rota, você precisa saber quem você realmente é. Descubra seus valores, reconheça suas crenças e construa sua Visão de Vida Desejada.",
      insight: "Quem se conhece, faz escolhas melhores.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Compass,
      title: "Plano de Vida Estruturado",
      description: "Sonhos sem plano são apenas desejos. Aqui você organiza tudo: quem você é, para onde vai e — mais importante — como vai chegar lá.",
      insight: "Um bom plano transforma ansiedade em ação.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Objetivos & Metas SMART",
      description: "Chega de metas vagas. Com a metodologia SMART, seus objetivos ganham clareza, prazo e métricas. Você sabe exatamente quando está avançando.",
      insight: "O que pode ser medido, pode ser melhorado.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: BookOpen,
      title: "Diário de Reflexão",
      description: "5 minutos por dia que mudam tudo. Registre seu humor, celebre pequenas vitórias e cultive gratidão. A consistência constrói resultados extraordinários.",
      insight: "Quem reflete, evolui mais rápido.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: CheckCircle2,
      title: "Acompanhamento Inteligente",
      description: "Gráficos de progresso, alertas de prazos e insights gerados por IA. Você nunca mais vai se perder no meio do caminho.",
      insight: "Visibilidade gera responsabilidade. Responsabilidade gera resultado.",
      color: "from-green-500 to-lime-500"
    }
  ];

  const tools = [
    { name: "Roda da Vida", desc: "Equilibre as 8 áreas da sua vida" },
    { name: "Análise SWOT", desc: "Conheça forças e oportunidades" },
    { name: "Método VVD", desc: "Defina sua Visão de Vida Desejada" },
    { name: "Metas SMART", desc: "Objetivos claros e alcançáveis" },
    { name: "Matriz de Eisenhower", desc: "Priorize o que importa" },
    { name: "Exercício de Valores", desc: "Descubra o que te move" },
    { name: "Transformação de Crenças", desc: "Supere bloqueios internos" },
    { name: "Autoavaliação 360º", desc: "Feedback completo de si mesmo" }
  ];

  const individualPlans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "por 30 dias",
      description: "Experimente sem compromisso",
      features: [
        "1 objetivo ativo",
        "1 meta por objetivo",
        "5 ações por meta",
        "4 ferramentas ilimitadas",
        "4 ferramentas com 1 uso",
        "Diário de reflexão"
      ],
      cta: "Começar grátis",
      variant: "outline" as const,
      highlight: false
    },
    {
      name: "Básico",
      price: "R$ 14,90",
      period: "/mês",
      description: "Tudo que você precisa para evoluir",
      badge: "🚀 Promoção de lançamento",
      features: [
        "PDI ilimitado",
        "1 insight de IA por mês",
        "Todas as ferramentas ilimitadas",
        "Integração Google Calendar",
        "Construção Guiada completa",
        "Suporte prioritário"
      ],
      cta: "Assinar agora",
      variant: "default" as const,
      highlight: true
    },
    {
      name: "Completo",
      price: "R$ 59",
      period: "/mês",
      description: "Máximo potencial de crescimento",
      badge: "Em breve",
      features: [
        "Tudo do Básico",
        "Insights de IA ilimitados",
        "Notificações por e-mail",
        "Notificações por WhatsApp",
        "Relatórios em PDF",
        "Acompanhamento personalizado"
      ],
      cta: "Em breve",
      variant: "outline" as const,
      highlight: false,
      disabled: true
    }
  ];


  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePessoaFisicaClick = () => {
    setIsModalOpen(false);
    if (selectedPlan === 'basico') {
      navigate("/signup?plan=basico");
    } else {
      navigate("/signup");
    }
  };

  const handlePlanClick = (planName: string) => {
    const normalizedPlan = planName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    setSelectedPlan(normalizedPlan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-elegant">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/login")}
            className="text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          >
            Login
          </Button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* NOVO HERO SECTION */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
              <span className="text-primary/90">
                Construa uma vida e uma carreira com clareza, direção e progresso real.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistema guiado por método, mentoria especializada e Inteligência Artificial para quem quer evoluir com clareza e consistência.
            </p>
            
            {/* Video Section */}
            <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8">
              <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-border/50" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/F50nE1vYjaY?rel=0&controls=1"
                  title="PDI - Carreira e Vida"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 inline-block">
                <p className="text-sm sm:text-base font-semibold text-primary">
                  R$ 67,00/ano <span className="text-muted-foreground font-normal">• Acesso completo por 12 meses</span>
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90"
              >
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Mentoria especializada + Inteligência Artificial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO PAREDE - Identificação Emocional */}
      {/* ============================================================ */}
      
      {/* Frase motivacional */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-1 lg:order-1">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  Quem planeja tem futuro, <span className="text-primary">quem não planeja tem destino.</span>
                </h2>
                <p className="text-sm text-muted-foreground text-right mt-2">— Mario Nazar</p>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
                Vi centenas de pessoas competentes travarem em suas carreiras e vida pessoal. Objetivos importantes eram deixados de lado, decisões se acumulavam e o progresso parecia impossível.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
                Não é motivação que faltava — faltava estrutura, clareza e um método para transformar intenção em ação consistente.
              </p>
              <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
                Foi assim que nasceu o <strong className="text-primary">Método SEPP</strong> (Sistema de Evolução Pessoal e Profissional), testado e validado, agora aplicado no PDI – Carreira e Vida, que ajuda pessoas a transformar objetivos em resultados reais, de forma consciente e sustentável.
              </p>
            </div>
            <div className="flex items-center justify-center order-2 lg:order-2 mt-6 lg:mt-0">
              <img 
                src={problemSolution} 
                alt="Confusão vs Evolução - Transformação com PDI" 
                className="rounded-2xl shadow-xl w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Por que agora? Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-14">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              O momento é agora
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Por que agora?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Não é sobre o momento perfeito. É sobre decidir que você merece mais.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Motivo 1 */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Porque você sabe que pode mais
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <p>
                    Você sente — mesmo que não diga em voz alta — que existe uma versão muito melhor de você esperando para nascer.
                  </p>
                  <p>
                    Uma versão mais leve, mais clara e mais firme. Mas essa versão não aparece sozinha. Ela precisa de <strong className="text-foreground">direção</strong>. E direção precisa de um <strong className="text-foreground">plano</strong>.
                  </p>
                  <p className="text-primary font-medium pt-2 border-t border-border/30">
                    O motivo para começar agora é simples: você se deve essa chance.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Motivo 2 */}
            <Card className="border-orange-500/20 bg-gradient-to-br from-card to-orange-500/5 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-500">2</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Porque o automático está te drenando
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <p>
                    Acordar, sobreviver ao dia, dormir… repetir. Esse ciclo silencioso vai apagando sua identidade, seus sonhos e sua força.
                  </p>
                  <p>
                    A verdade é dura, mas libertadora: <strong className="text-foreground">sem um mapa, você vai rodar em círculos</strong>.
                  </p>
                  <p className="text-orange-500 font-medium pt-2 border-t border-border/30">
                    Começar o PDI hoje é recuperar o controle da sua própria história.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Motivo 3 */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-500">3</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Porque seu futuro está sendo decidido agora
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <p>
                    Existe um "você de amanhã" observando o que você faz hoje. Ele pode te agradecer… ou te cobrar.
                  </p>
                  <p>
                    O futuro não acontece do nada: ele é construído por pequenas escolhas feitas agora. E escolher não fazer nada também é uma escolha — <strong className="text-foreground">normalmente a mais cara delas</strong>.
                  </p>
                  <p className="text-purple-500 font-medium pt-2 border-t border-border/30">
                    Começar agora é dizer para a vida: "Eu estou no comando."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Motivo 4 */}
            <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-500">4</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Porque você merece viver com sentido
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <p>
                    Quantas vezes você adiou seus sonhos "para quando der"? Quantas vezes colocou todo mundo na frente de você?
                  </p>
                  <p>
                    Você não precisa esperar o caos, nem o próximo susto. O PDI existe para <strong className="text-foreground">te devolver o sentido que você perdeu pelo caminho</strong>.
                  </p>
                  <p className="text-emerald-500 font-medium pt-2 border-t border-border/30">
                    Começar agora não é só inteligente. É um ato de amor-próprio.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA da Seção PAREDE */}
          <div className="text-center mt-10 sm:mt-14">
            <Button 
              size="lg" 
              onClick={() => handlePlanClick('gratuito')}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90"
            >
              Retomar o controle
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              Com mentoria especializada e apoio da Inteligência Artificial
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO QUADRO - Resultado Desejado */}
      {/* ============================================================ */}

      {/* Confusão vs Evolução - Benefícios do sistema */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Como o Sistema PDI - Carreira e Vida transforma sua evolução
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Um método estruturado para sair da intenção e ir para a ação.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Clareza e Diagnóstico</h3>
                <p className="text-muted-foreground text-sm">
                  Organize prioridades, identifique lacunas e defina metas concretas.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent hover:shadow-lg transition-all">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Estrutura e Método</h3>
                <p className="text-muted-foreground text-sm">
                  Transforme intenções em ações repetíveis e mensuráveis.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent hover:shadow-lg transition-all">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Acompanhamento Contínuo</h3>
                <p className="text-muted-foreground text-sm">
                  Utilize tecnologia e processos do método para manter evolução consistente.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent hover:shadow-lg transition-all">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <User className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Protagonismo do Usuário</h3>
                <p className="text-muted-foreground text-sm">
                  Você conduz sua própria jornada, com suporte e método ao seu lado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* O que você ganha com o Sistema */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                O que o Sistema PDI - Carreira e Vida faz por você
              </h2>
              <ul className="space-y-4 text-left">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg text-foreground">Clareza e direção em sua carreira e vida pessoal</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg text-foreground">Transformação de objetivos em ações mensuráveis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg text-foreground">Redução de confusão, procrastinação e decisões dispersas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg text-foreground">Evolução contínua e sustentável</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg text-foreground">Aplicação prática do método com suporte de tecnologia</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 lg:mt-0 flex justify-center">
              <img 
                src={pdiFocusTarget} 
                alt="PDI - Foco em objetivos com direção clara" 
                className="rounded-2xl shadow-xl w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Garantia - 30 dias grátis */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5 border-2 border-accent/30 p-8 sm:p-12">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              {/* Shield icon with glow effect */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30">
                    <Shield className="h-10 w-10 text-accent-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Main headline */}
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 text-xs sm:text-sm px-4 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Garantia de Avaliação
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-accent">
                  30 dias para experimentar. Grátis.
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
                  Você não precisa decidir agora. Explore todas as ferramentas, construa seu PDI, 
                  e só então decida se quer continuar.
                </p>
              </div>
              
              {/* Benefits grid */}
              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center border border-accent/20">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base mb-1">Acesso Imediato</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Comece agora mesmo com todas as funcionalidades liberadas
                  </p>
                </div>
                
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center border border-accent/20">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Crown className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base mb-1">100% Completo</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Nada de versão limitada — você testa o sistema completo
                  </p>
                </div>
                
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center border border-accent/20">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base mb-1">Sem Compromisso</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Cobrança só após 30 dias — se você escolher continuar
                  </p>
                </div>
              </div>
              
              {/* CTA */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 bg-background/80 rounded-2xl p-4 sm:p-5 border border-accent/30 max-w-lg mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-accent">30</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm sm:text-base">Dias de teste gratuito</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Depois, apenas R$ 67/ano</p>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-xs sm:text-base shadow-lg shadow-accent/30 px-4 sm:px-6 whitespace-nowrap"
                  >
                    Testar grátis
                    <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                  Sem pegadinhas. Se não gostar, basta não usar — você não paga nada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sua jornada começa aqui (Etapas 1 a 6) */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <button 
            onClick={() => setIsJourneyExpanded(!isJourneyExpanded)}
            className="w-full flex items-center justify-center gap-2 mb-3 sm:mb-4 group"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center group-hover:text-primary transition-colors">
              Sua jornada começa aqui
            </h2>
            {isJourneyExpanded ? (
              <ChevronUp className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>
          
          {isJourneyExpanded && (
            <>
              <p className="text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
                Não é sobre fazer mais. É sobre fazer o que importa, com clareza e consistência.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {journeySteps.map((step, index) => (
                  <Card 
                    key={index} 
                    className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                        <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          Etapa {index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-3">{step.description}</p>
                      <p className="text-xs text-primary/80 italic border-l-2 border-primary/30 pl-3">
                        {step.insight}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* CTA da Seção QUADRO */}
          <div className="text-center mt-10 sm:mt-14">
            <Button 
              size="lg" 
              onClick={() => handlePlanClick('gratuito')}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90"
            >
              Criar meu plano
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              Método estruturado com acompanhamento humano e IA
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO FURADEIRA - Método, Sistema e Tecnologia */}
      {/* ============================================================ */}

      {/* Por que o PDI funciona (Método SEPP) */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Por que o PDI – Carreira & Vida funciona
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              O PDI – Carreira & Vida não foi criado como uma fórmula mágica ou um método motivacional passageiro. 
              Ele funciona porque organiza, de forma prática e acessível, princípios amplamente utilizados em 
              psicologia comportamental, planejamento estratégico, desenvolvimento de carreira e gestão de metas, 
              aplicados à realidade da vida pessoal e profissional.
            </p>
          </div>
        </div>
      </section>

      {/* Diário Digital Inteligente Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-purple-500/5 via-background to-primary/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm bg-purple-500/10 text-purple-600 border-0">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Funcionalidade Exclusiva
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Diário Digital Inteligente: por que registrar seu dia transforma sua clareza, foco e bem-estar!
            </h2>
            <div className="text-left space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              <p>
                Em meio à rotina acelerada, excesso de informações e múltiplas responsabilidades, muitas pessoas sentem dificuldade em organizar pensamentos, compreender emoções e perceber avanços reais na própria vida e carreira.
              </p>
              <p>
                O <strong className="text-foreground">Diário Digital Inteligente do PDI – Carreira e Vida</strong> foi concebido exatamente para responder a esse desafio: oferecer um espaço estruturado de reflexão diária que favorece clareza mental, autorregulação emocional e consciência de progresso.
              </p>
              <p>
                Essa funcionalidade não é intuitiva ou casual. Ela se apoia em fundamentos amplamente estudados pela Psicologia, especialmente pela <strong className="text-foreground">Psicologia Cognitivo-Comportamental</strong> e pela <strong className="text-foreground">Psicologia Positiva</strong>.
              </p>
            </div>
          </div>

          {/* Feature: Histórico e Gráfico */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-10">
            <div className="order-2 lg:order-1">
              <img 
                src={diaryMoodChart} 
                alt="Gráfico de acompanhamento de humor do Diário Digital" 
                className="rounded-xl shadow-lg border border-border/50 w-full h-auto"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Exemplo do gráfico de acompanhamento de humor por período
              </p>
            </div>
            <div className="order-1 lg:order-2 text-left">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                Visualize sua evolução ao longo do tempo
              </h3>
              <div className="space-y-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                <p>
                  Além de registrar seu dia, o Diário Digital Inteligente permite que você <strong className="text-foreground">consulte todo o seu histórico por período de até um ano</strong>, revisitando anotações, conquistas e reflexões passadas.
                </p>
                <p>
                  E para tornar sua jornada ainda mais clara, você tem acesso a um <strong className="text-foreground">gráfico interativo que mostra o comparativo do seu humor dia a dia</strong>, permitindo identificar padrões emocionais, momentos de maior bem-estar e períodos que merecem atenção.
                </p>
                <p>
                  Essa visão ampliada transforma dados em autoconhecimento — e autoconhecimento em poder de decisão.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <button
              onClick={() => setIsDiaryModalOpen(true)}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm sm:text-base transition-colors underline underline-offset-4"
            >
              Conheça o embasamento científico validado por trás desta ferramenta
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <div className="flex flex-col items-center gap-3">
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 inline-block">
                <p className="text-sm sm:text-base font-semibold text-primary">
                  R$ 67,00/ano <span className="text-muted-foreground font-normal">• Acesso por 12 meses</span>
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Começar o diário
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Reflexão guiada com insights de IA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section - 8 Ferramentas */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4">
            8 ferramentas que realmente funcionam
          </h2>
          <p className="text-muted-foreground text-center mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">
            Metodologias usadas por coaches, terapeutas e líderes de alta performance — agora na palma da sua mão.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {tools.map((tool, index) => {
              const isValoresCard = tool.name === "Exercício de Valores";
              const isRodaDaVidaCard = tool.name === "Roda da Vida";
              const isSwotCard = tool.name === "Análise SWOT";
              const isVvdCard = tool.name === "Método VVD";
              const isSmartCard = tool.name === "Metas SMART";
              const isEisenhowerCard = tool.name === "Matriz de Eisenhower";
              const isBeliefsCard = tool.name === "Transformação de Crenças";
              const isAutoavaliacaoCard = tool.name === "Autoavaliação 360º";
              
              return (
                <Card 
                  key={index} 
                  className="p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => {
                    if (isValoresCard) setIsValuesModalOpen(true);
                    else if (isRodaDaVidaCard) setIsLifeWheelModalOpen(true);
                    else if (isSwotCard) setIsSwotModalOpen(true);
                    else if (isVvdCard) setIsVvdModalOpen(true);
                    else if (isSmartCard) setIsSmartModalOpen(true);
                    else if (isEisenhowerCard) setIsEisenhowerModalOpen(true);
                    else if (isBeliefsCard) setIsBeliefsModalOpen(true);
                    else if (isAutoavaliacaoCard) setIsAutoavaliacaoModalOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm sm:text-base">{tool.name}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{tool.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* VVD Section - Visão de Vida Desejada */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
                <Compass className="h-3.5 w-3.5 mr-1.5" />
                Ferramenta Principal
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                VVD: Construa sua Visão de Vida Desejada
              </h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">
                A maioria das pessoas sabe o que <em>não</em> quer. Poucas conseguem descrever com clareza 
                o que <em>realmente</em> desejam para suas vidas. O VVD é um processo guiado e profundo 
                de construção da sua <strong>Visão de Vida Desejada</strong> — um texto vivo que descreve 
                quem você quer ser, como quer viver e o que quer conquistar nos próximos anos.
              </p>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
                Não é sobre sonhar acordado. É sobre criar um norte tão claro que cada decisão do seu 
                dia-a-dia passa a fazer sentido. <em>Quando você sabe para onde vai, o caminho aparece.</em>
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Processo guiado passo a passo</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Perguntas estratégicas que extraem o melhor de você</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Integração com seus objetivos</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Cada meta que você cria se conecta à sua VVD</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Documento vivo e editável</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Sua visão evolui junto com você</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm sm:text-base"
                >
                  Criar minha visão
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Mentoria guiada + apoio da IA
                </p>
              </div>
            </div>

            {/* Visual - VVD Illustration */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 sm:p-8 border border-primary/20">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <Compass className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sua Visão de Vida</h3>
                    <p className="text-sm text-muted-foreground">Um norte claro para suas decisões</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Quem você quer ser?</p>
                      <p className="text-sm text-foreground italic">"Uma pessoa realizada, equilibrada..."</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Como quer viver?</p>
                      <p className="text-sm text-foreground italic">"Com propósito, liberdade e conexões..."</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">O que quer conquistar?</p>
                      <p className="text-sm text-foreground italic">"Impacto positivo, crescimento..."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Tecnologia de ponta
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Uma plataforma moderna, feita para o seu ritmo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Não basta ter boas intenções. Você precisa de ferramentas que trabalhem por você — 
              lembrando, organizando, analisando. É isso que a tecnologia faz aqui.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* AI Card */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Inteligência Artificial</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                  Insights personalizados sobre sua jornada, gerados por IA que entende seu contexto. 
                  Como ter um coach particular disponível 24 horas.
                </p>
                <p className="text-xs text-primary/80 italic">
                  A tecnologia lê seus dados e te mostra o que você ainda não viu.
                </p>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Notificações Inteligentes</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                  Lembretes por <strong>e-mail</strong> e <strong>WhatsApp</strong> na hora certa. 
                  Prazos, diário, metas — você nunca mais esquece o que importa.
                </p>
                <div className="flex gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    <Mail className="h-3 w-3" /> E-mail
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    <MessageCircle className="h-3 w-3" /> WhatsApp
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Integration */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Google Calendar</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                  Suas metas e prazos sincronizados automaticamente na sua agenda. 
                  Sem copiar, sem esquecer, sem retrabalho.
                </p>
                <p className="text-xs text-primary/80 italic">
                  Seu planejamento de vida integrado à sua rotina real.
                </p>
              </CardContent>
            </Card>

            {/* Reports Card */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Relatórios Completos</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                  Exporte seu PDI completo e relatórios de progresso em <strong>PDF</strong>. 
                  Perfeito para compartilhar com seu gestor, coach ou terapeuta.
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full w-fit mt-2">
                  <Download className="h-3 w-3" /> PDF exportável
                </div>
              </CardContent>
            </Card>

            {/* Mobile Card */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">100% Responsivo</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                  Use no celular, tablet ou computador. A experiência é fluida em qualquer tela — 
                  porque sua evolução não pode esperar você chegar em casa.
                </p>
                <p className="text-xs text-primary/80 italic">
                  Seu PDI no bolso, disponível a qualquer momento.
                </p>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Segurança & LGPD</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                  Seus dados são criptografados e protegidos. Você tem controle total sobre suas informações 
                  — pode exportar ou excluir quando quiser.
                </p>
                <p className="text-xs text-primary/80 italic">
                  Sua privacidade é levada a sério aqui.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Seção de Benefícios e Limites */}
      <section id="planos" className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              <Star className="h-3.5 w-3.5 mr-1.5" />
              O que você recebe
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Tudo que você precisa para evoluir
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Acesso completo a todas as ferramentas e recursos por apenas <strong className="text-primary">R$ 67/ano</strong>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Plano de Vida */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Plano de Vida Ilimitado</h3>
                <p className="text-sm text-muted-foreground">Objetivos, metas e ações sem limites para organizar toda sua jornada</p>
              </CardContent>
            </Card>

            {/* Ferramentas */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <Compass className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">8 Ferramentas de Autoconhecimento</h3>
                <p className="text-sm text-muted-foreground">Roda da Vida, SWOT, VVD, SMART, Eisenhower, Valores, Crenças e mais</p>
              </CardContent>
            </Card>

            {/* Diário */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="font-semibold mb-2">Diário de Reflexão Completo</h3>
                <p className="text-sm text-muted-foreground">Registro diário com humor, gratidão, conquistas e gráficos de progresso</p>
              </CardContent>
            </Card>

            {/* IA */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Cpu className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Insights de IA</h3>
                <p className="text-sm text-muted-foreground">1 insight personalizado por mês sobre sua jornada e evolução</p>
              </CardContent>
            </Card>

            {/* Construção Guiada */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Construção Guiada</h3>
                <p className="text-sm text-muted-foreground">Passo a passo para construir seu PDI do zero com mentoria</p>
              </CardContent>
            </Card>

            {/* Integrações */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Google Calendar</h3>
                <p className="text-sm text-muted-foreground">Sincronize suas metas e prazos com sua agenda automaticamente</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 sm:p-8 border border-primary/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Comece sua transformação hoje
              </h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Acesso completo por 12 meses com renovação automática
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-background/80 rounded-xl px-4 py-2 inline-block">
                  <p className="text-lg sm:text-xl font-bold text-primary">
                    R$ 67,00<span className="text-sm font-normal text-muted-foreground">/ano</span>
                  </p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-primary hover:bg-primary/90 text-sm sm:text-base"
                >
                  Assinar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Mentoria especializada + IA durante toda a jornada
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO DECISÃO - Prova e Compromisso */}
      {/* ============================================================ */}

      {/* Social Proof - Depoimentos Reais */}
      <section className="py-12 sm:py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Quem já transformou sua vida
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Depoimentos reais de quem viveu a jornada
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Pessoas comuns que decidiram investir em si mesmas e colheram resultados extraordinários.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Depoimento 1 - Eric */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Participar do PDI foi extremamente importante para mim. Além de sair com um plano de execução 
                  muito bem estruturado, ganhei conhecimento para repetir sozinho o ciclo de reflexão, planejamento 
                  e ação. Vale muito a pena."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={ericPereira} 
                    alt="Eric Pereira" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Eric Pereira</p>
                    <a 
                      href="https://www.linkedin.com/in/eric-pereira-b05a5611b/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Eric Pereira"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalUrl("i1VgEBOW4PI")}
                  className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento completo</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 2 - Gabriele */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "O PDI me ajudou a enxergar padrões que eu mesma criava e que me impediam de avançar. 
                  O processo de reflexão foi transformador — hoje tenho clareza sobre minhas prioridades 
                  e consigo agir com muito mais consistência."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={gabrieleCampos} 
                    alt="Gabriele Campos" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Gabriele Campos</p>
                    <a 
                      href="https://www.linkedin.com/in/gabriele-ribeiro-campos/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Gabriele Campos"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalUrl("NjEA4WBiUvA")}
                  className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento completo</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 3 - Larissa */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Eu estava travada há muito tempo, sem saber exatamente por quê. O PDI me ajudou a 
                  identificar o que estava me prendendo e, mais importante, me deu ferramentas práticas 
                  para superar esses bloqueios. Recomendo muito!"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={larissaSchuartz} 
                    alt="Larissa Schuartz" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Larissa Schuartz</p>
                    <a 
                      href="https://www.linkedin.com/in/larissa-dos-santos-schuartz-17a7aa189/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Larissa Schuartz"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalUrl("Tpz2mmxUYHc")}
                  className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento completo</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 4 - Lucas */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Antes do PDI eu tinha muitos objetivos, mas nenhuma organização para alcançá-los. 
                  O sistema me ensinou a priorizar, planejar e executar de forma consistente. 
                  Em 6 meses conquistei mais do que nos últimos 3 anos."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={lucasSa} 
                    alt="Lucas Sá" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Lucas Sá</p>
                    <a 
                      href="https://www.linkedin.com/in/lucazartu/?locale=pt_BR" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Lucas Sá"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto max-w-3xl text-center">
          <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            O melhor momento para começar era ontem. O segundo melhor é agora.
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
            Você já sabe o que precisa fazer. Nós vamos te ajudar a realmente fazer.
          </p>
          <div className="flex flex-col items-center gap-2">
            <Button 
              size="lg" 
              onClick={() => handlePlanClick('gratuito')}
              className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 bg-primary hover:bg-primary/90 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
            >
              Assumir o comando
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              No seu ritmo • Com suporte humano e Inteligência Artificial
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium mb-2 text-sm sm:text-base">Preciso de experiência com desenvolvimento pessoal?</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Não. O PDI foi feito para qualquer pessoa que queira mais clareza e direção na vida — 
                iniciantes ou experientes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium mb-2 text-sm sm:text-base">Quanto tempo preciso dedicar por dia?</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                5 a 10 minutos são suficientes para manter seu diário e acompanhar seu progresso.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium mb-2 text-sm sm:text-base">Posso cancelar a qualquer momento?</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Sim. Sem burocracia, sem perguntas. Mas apostamos que você vai querer ficar.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button variant="link" onClick={() => navigate("/faq")}>
              Ver todas as perguntas →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 border-t border-border/50 bg-muted/10">
        <div className="container mx-auto max-w-4xl">
          {/* Conheça o autor - Destacado */}
          <div 
            onClick={() => navigate("/sobre")}
            className="flex items-center justify-center gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all group"
          >
            <img 
              src={agostinhoCaldeira}
              alt="Agostinho Caldeira - Criador do PDI"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover object-top border-2 border-primary/30 group-hover:border-primary transition-colors"
            />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Criador do Método SEPP</p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Conheça o autor</p>
              <p className="text-sm text-muted-foreground">Agostinho Caldeira</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>© 2024 PDI - Carreira & Vida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Registration Type Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Como deseja se cadastrar?</DialogTitle>
            <DialogDescription className="text-center">
              Escolha a opção que melhor se aplica a você
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5"
              onClick={handlePessoaFisicaClick}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Pessoa Física</div>
                <div className="text-sm text-muted-foreground">Quero criar meu PDI pessoal</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsModalOpen(false);
                navigate("/empresas");
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Empresa</div>
                <div className="text-sm text-muted-foreground">Conheça o PDI corporativo</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={!!videoModalUrl} onOpenChange={() => setVideoModalUrl(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black border-none">
          <div className="relative pt-[56.25%]">
            {videoModalUrl && (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoModalUrl}?autoplay=1`}
                title="Depoimento"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <button 
            onClick={() => setVideoModalUrl(null)}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>

      {/* Diary Scientific Modal */}
      <DiaryScientificModal 
        open={isDiaryModalOpen} 
        onOpenChange={setIsDiaryModalOpen} 
      />

      {/* Values Scientific Modal */}
      <ValuesScientificModal 
        open={isValuesModalOpen} 
        onOpenChange={setIsValuesModalOpen} 
      />

      {/* Life Wheel Scientific Modal */}
      <LifeWheelScientificModal 
        open={isLifeWheelModalOpen} 
        onOpenChange={setIsLifeWheelModalOpen} 
      />

      {/* SWOT Scientific Modal */}
      <SwotScientificModal 
        open={isSwotModalOpen} 
        onOpenChange={setIsSwotModalOpen} 
      />

      {/* VVD Scientific Modal */}
      <VvdScientificModal 
        open={isVvdModalOpen} 
        onOpenChange={setIsVvdModalOpen} 
      />

      {/* SMART Scientific Modal */}
      <SmartScientificModal 
        open={isSmartModalOpen} 
        onOpenChange={setIsSmartModalOpen} 
      />

      {/* Eisenhower Scientific Modal */}
      <EisenhowerScientificModal 
        open={isEisenhowerModalOpen} 
        onOpenChange={setIsEisenhowerModalOpen} 
      />

      {/* Beliefs Scientific Modal */}
      <BeliefsScientificModal 
        open={isBeliefsModalOpen} 
        onOpenChange={setIsBeliefsModalOpen} 
      />

      {/* Autoavaliacao 360 Scientific Modal */}
      <Autoavaliacao360ScientificModal 
        open={isAutoavaliacaoModalOpen} 
        onOpenChange={setIsAutoavaliacaoModalOpen} 
      />
    </div>
  );
};

export default Index;