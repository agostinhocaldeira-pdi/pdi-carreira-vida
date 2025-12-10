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
  Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJourneyExpanded, setIsJourneyExpanded] = useState(true);

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

  const companyPricing = [
    { range: "1-10 funcionários", price: "R$ 50/mês" },
    { range: "11-20 funcionários", price: "R$ 90/mês" },
    { range: "21+ funcionários", price: "R$ 150/mês" }
  ];

  const companyFeatures = [
    { icon: Users, text: "Gestão de equipes e gestores" },
    { icon: BarChart3, text: "Dashboard de progresso coletivo" },
    { icon: Target, text: "OKRs corporativos vinculados ao PDI" },
    { icon: FileText, text: "Relatórios consolidados para RH" },
    { icon: Bell, text: "Notificações automáticas" },
    { icon: Calendar, text: "Funcionários não pagam assinatura" }
  ];

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePessoaFisicaClick = () => {
    setIsModalOpen(false);
    // Pass the selected plan as a query parameter
    if (selectedPlan === 'basico') {
      navigate("/signup?plan=basico");
    } else {
      navigate("/signup");
    }
  };

  const handlePlanClick = (planName: string) => {
    // Normalize plan name: remove accents and convert to lowercase
    const normalizedPlan = planName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    setSelectedPlan(normalizedPlan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <span className="font-bold text-sm sm:text-xl whitespace-nowrap">PDI</span>
            <span className="font-bold text-sm sm:text-xl hidden sm:inline whitespace-nowrap">- Carreira & Vida</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
            +2.000 pessoas transformando suas vidas
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Você não precisa de mais motivação. Precisa de um plano.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            O PDI integra carreira e vida porque, no fundo, você sabe: não dá pra separar uma da outra. 
            Aqui você vai do autoconhecimento à ação — todos os dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handlePlanClick('gratuito')}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90"
            >
              Começar minha jornada
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
            >
              Ver planos
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-4">
            Comece grátis. Sem cartão de crédito.
          </p>
        </div>
      </section>

      {/* Problem-Solution */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-base sm:text-lg text-muted-foreground mb-4 italic">
            "Eu sei o que preciso fazer, mas não consigo manter o foco..."
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 italic">
            "Tenho tantos objetivos que não sei por onde começar..."
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 italic">
            "Já tentei de tudo, mas sempre volto à estaca zero..."
          </p>
          <p className="text-lg sm:text-xl font-medium text-foreground">
            Se você se identificou, o problema não é você. É a falta de um sistema.
          </p>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <button 
            onClick={() => setIsJourneyExpanded(!isJourneyExpanded)}
            className="w-full flex items-center justify-center gap-2 mb-3 sm:mb-4 group"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center group-hover:text-primary transition-colors">
              Minha Jornada
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
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4">
            8 ferramentas que realmente funcionam
          </h2>
          <p className="text-muted-foreground text-center mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">
            Metodologias usadas por coaches, terapeutas e líderes de alta performance — agora na palma da sua mão.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {tools.map((tool, index) => (
              <div 
                key={index}
                className="p-3 sm:p-4 bg-background border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
              >
                <p className="font-medium text-sm sm:text-base mb-1">{tool.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Clareza de Propósito</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Quando você sabe o que quer, as decisões ficam mais fáceis. E a vida, mais leve.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Progresso Visível</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Gráficos e métricas que mostram sua evolução. Você vai se surpreender consigo mesmo.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Ação Diária</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Pequenos passos consistentes constroem resultados extraordinários.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VVD Method Section */}
      <section className="py-12 sm:py-20 px-4 bg-muted/30 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <Badge variant="secondary" className="mb-4 text-xs sm:text-sm bg-primary/10 text-primary border-0">
                ✨ Metodologia Exclusiva
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Método VVD: Sua Visão de Vida Desejada
              </h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">
                A maioria das pessoas sabe o que <em>não</em> quer. Mas pouquíssimas conseguem descrever, 
                com clareza, a vida que realmente desejam viver. É aí que entra o <strong>Método VVD</strong>.
              </p>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">
                Desenvolvido especialmente para o PDI - Carreira & Vida, o VVD te guia num processo 
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

              <Button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm sm:text-base"
              >
                Criar minha Visão de Vida
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Visual */}
            <div className="order-1 lg:order-2">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-sm text-primary">Exemplo de VVD</span>
                  </div>
                  <div className="bg-background/80 rounded-lg p-4 sm:p-6 border border-border/50">
                    <p className="text-sm sm:text-base text-foreground/90 italic leading-relaxed">
                      "Em 2027, sou uma profissional realizada que equilibra uma carreira em ascensão 
                      com tempo de qualidade para minha família. Acordo cedo, pratico exercícios e 
                      trabalho com projetos que me desafiam e fazem diferença. Tenho autonomia financeira, 
                      viajo pelo menos duas vezes ao ano e cultivo amizades verdadeiras. 
                      Sou reconhecida pela minha competência e pela forma como inspiro outras pessoas..."
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Isso não é ficção. É um norte. E você vai construir o seu.
                  </p>
                </CardContent>
              </Card>
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

      {/* Pricing Section */}
      <section id="planos" className="py-12 sm:py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4">
            Escolha seu plano
          </h2>
          <p className="text-muted-foreground text-center mb-8 sm:mb-12 max-w-xl mx-auto text-sm sm:text-base">
            Invista em você. O retorno é para a vida toda.
          </p>

          {/* Individual Plans */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8 flex items-center justify-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Para Pessoas Físicas
            </h3>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {individualPlans.map((plan, index) => (
                <Card 
                  key={index}
                  className={`relative overflow-hidden transition-all ${
                    plan.highlight 
                      ? 'border-primary shadow-lg scale-[1.02]' 
                      : 'border-border/50 hover:border-primary/30'
                  } ${plan.disabled ? 'opacity-60' : ''}`}
                >
                  {plan.badge && (
                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg ${
                      plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {plan.badge}
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 sm:mb-6">
                      <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                    <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full text-sm sm:text-base"
                      variant={plan.variant}
                      disabled={plan.disabled}
                      onClick={() => !plan.disabled && handlePlanClick(plan.name)}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Company Plans */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8 flex items-center justify-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Para Empresas
            </h3>
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Company Features */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Desenvolva sua equipe</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    PDI corporativo com gestão centralizada e OKRs alinhados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {companyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-xs sm:text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Company Pricing */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Preços por tamanho</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Quanto maior a equipe, maior o impacto na cultura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {companyPricing.map((tier, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50"
                      >
                        <span className="font-medium text-sm sm:text-base">{tier.range}</span>
                        <span className="text-primary font-bold text-sm sm:text-base">{tier.price}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full text-sm sm:text-base"
                    onClick={() => navigate("/cadastrar-empresa")}
                  >
                    Cadastrar minha empresa
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-base sm:text-lg text-muted-foreground italic mb-4">
            "Pela primeira vez, sinto que tenho controle sobre minha vida e minha carreira. 
            O PDI me deu clareza para tomar decisões que eu vinha adiando há anos."
          </p>
          <p className="text-sm font-medium">— Mariana S., Gerente de Projetos</p>
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
          <Button 
            size="lg" 
            onClick={() => handlePlanClick('gratuito')}
            className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 bg-primary hover:bg-primary/90"
          >
            Criar meu PDI gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            30 dias grátis • Cancele quando quiser
          </p>
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
      <footer className="py-6 sm:py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2024 PDI - Carreira & Vida. Todos os direitos reservados.</p>
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
                navigate("/cadastrar-empresa");
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Empresa</div>
                <div className="text-sm text-muted-foreground">Quero cadastrar minha empresa</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
