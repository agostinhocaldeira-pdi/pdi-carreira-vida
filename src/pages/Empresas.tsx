import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Target, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Bell,
  FileText,
  Calendar,
  Crown,
  Award,
  Briefcase,
  LineChart,
  Heart,
  Check,
  Star,
  MessageCircle
} from "lucide-react";
import Logo from "@/components/Logo";

// Import marketing images
import teamCollaboration from "@/assets/team-collaboration.jpg";
import leadershipMentoring from "@/assets/leadership-mentoring.jpg";
import teamSuccess from "@/assets/team-success.jpg";
import corporateGrowth from "@/assets/corporate-growth.jpg";

const Empresas = () => {
  const navigate = useNavigate();

  const companyBenefits = [
    {
      icon: Users,
      title: "Gestão Centralizada de Equipes",
      description: "Gerencie gestores e funcionários em um único painel. Acompanhe quem está evoluindo e quem precisa de atenção — sem planilhas, sem retrabalho."
    },
    {
      icon: Target,
      title: "OKRs Corporativos Alinhados",
      description: "Defina OKRs da empresa e veja como cada colaborador está contribuindo. Alinhamento estratégico que vai do C-Level ao operacional."
    },
    {
      icon: BarChart3,
      title: "Dashboard de Progresso Coletivo",
      description: "Visualize métricas de engajamento, taxa de conclusão de metas e evolução da equipe em tempo real. Dados que impulsionam decisões."
    },
    {
      icon: FileText,
      title: "Relatórios Consolidados para RH",
      description: "Exporte relatórios completos em PDF para apresentações, feedbacks e auditorias. Documentação profissional sempre à mão."
    },
    {
      icon: Bell,
      title: "Notificações Automáticas",
      description: "E-mails e lembretes automáticos mantêm toda a equipe engajada. Ninguém esquece prazos, metas ou reflexões diárias."
    },
    {
      icon: Calendar,
      title: "Funcionários Não Pagam",
      description: "O investimento é da empresa. Funcionários têm acesso completo sem custos individuais — democratizando o desenvolvimento pessoal."
    }
  ];

  const companyPricing = [
    { range: "1-10 funcionários", price: "R$ 300", period: "/mês", perEmployee: "R$ 30,00/funcionário" },
    { range: "11-50 funcionários", price: "R$ 600", period: "/mês", perEmployee: "R$ 12,00/funcionário" },
    { range: "51+ funcionários", price: "R$ 900", period: "/mês", perEmployee: "A partir de R$ 17,65/funcionário", highlight: true }
  ];

  const whyCompaniesNeed = [
    {
      icon: TrendingUp,
      stat: "67%",
      label: "dos funcionários querem desenvolvimento",
      description: "Colaboradores buscam crescimento — e abandonam empresas que não investem neles."
    },
    {
      icon: Award,
      stat: "2.5x",
      label: "maior retenção de talentos",
      description: "Empresas com programas de desenvolvimento retêm talentos por muito mais tempo."
    },
    {
      icon: LineChart,
      stat: "40%",
      label: "aumento de produtividade",
      description: "Times com clareza de objetivos entregam significativamente mais."
    },
    {
      icon: Heart,
      stat: "89%",
      label: "maior satisfação no trabalho",
      description: "Quando pessoas crescem, elas se sentem valorizadas e engajadas."
    }
  ];

  const differentiators = [
    {
      title: "Não é só RH, é cultura",
      description: "O PDI vai além de processos burocráticos. Ele cria uma cultura de autodesenvolvimento que permeia toda a organização."
    },
    {
      title: "Setup em minutos, não meses",
      description: "Convide gestores e funcionários por e-mail. Eles recebem acesso instantâneo — sem treinamentos complexos ou implementações longas."
    },
    {
      title: "Integra vida e carreira",
      description: "Funcionários felizes na vida pessoal performam melhor no trabalho. O PDI cuida do profissional inteiro, não só do cargo."
    },
    {
      title: "IA que entende contexto",
      description: "Insights personalizados por inteligência artificial que considera a jornada individual de cada colaborador."
    }
  ];

  const useCases = [
    {
      icon: Briefcase,
      title: "Onboarding de novos colaboradores",
      description: "Novos funcionários começam com clareza sobre objetivos e expectativas desde o primeiro dia."
    },
    {
      icon: TrendingUp,
      title: "Programas de desenvolvimento",
      description: "Estruture trilhas de crescimento para diferentes níveis e áreas da empresa."
    },
    {
      icon: Target,
      title: "Avaliações de desempenho",
      description: "Use dados reais do PDI para feedbacks mais objetivos e construtivos."
    },
    {
      icon: Users,
      title: "Gestão de times remotos",
      description: "Mantenha alinhamento e acompanhamento mesmo com equipes distribuídas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="md" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            >
              Para você
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 text-xs sm:text-sm bg-primary/10 text-primary border-0">
                <Building2 className="h-3 w-3 mr-1" />
                PDI para Empresas
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                Desenvolva sua equipe com clareza, não com burocracia.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                PDI corporativo que alinha objetivos individuais aos OKRs da empresa. 
                Gestão centralizada, relatórios inteligentes e equipes mais engajadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/cadastrar-empresa")}
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90"
                >
                  Cadastrar minha empresa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
                >
                  Ver preços
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                Funcionários não pagam nada. Investimento apenas da empresa.
              </p>
            </div>
            <div className="hidden lg:block">
              <img 
                src={teamCollaboration} 
                alt="Equipe colaborando em ambiente corporativo" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Companies Need This */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Por que investir no desenvolvimento da equipe?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Dados não mentem: empresas que investem em pessoas colhem resultados exponenciais.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyCompaniesNeed.map((item, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm text-center hover:shadow-lg transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{item.stat}</div>
                  <p className="font-medium text-sm sm:text-base mb-2">{item.label}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-foreground">
            O problema que empresas enfrentam <span className="text-primary">todos os dias</span>
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-base sm:text-lg text-muted-foreground italic">
              "Fazemos PDI uma vez por ano e depois ninguém olha mais..."
            </p>
            <p className="text-base sm:text-lg text-muted-foreground italic">
              "Não conseguimos acompanhar o desenvolvimento de cada pessoa..."
            </p>
            <p className="text-base sm:text-lg text-muted-foreground italic">
              "Os OKRs ficam no PowerPoint, não na rotina da equipe..."
            </p>
          </div>
          <p className="text-lg sm:text-xl font-medium text-foreground">
            O PDI - Carreira & Vida resolve isso. <span className="text-primary">De verdade.</span>
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 sm:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Funcionalidades para empresas
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Tudo que sua empresa precisa para desenvolver talentos
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {companyBenefits.map((benefit, index) => (
              <Card key={index} className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="hidden lg:block">
              <img 
                src={leadershipMentoring} 
                alt="Líder orientando equipe" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div>
              <div className="text-center lg:text-left mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Por que o PDI é diferente?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base">
                  Não é mais uma ferramenta de RH. É uma plataforma que as pessoas realmente usam.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {differentiators.map((diff, index) => (
                  <div 
                    key={index}
                    className="p-5 sm:p-6 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{diff.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{diff.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="text-center lg:text-left mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Casos de uso
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base">
                  Como empresas estão usando o PDI para transformar suas equipes
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {useCases.map((useCase, index) => (
                  <Card key={index} className="border-border/50 bg-card/50 hover:shadow-md transition-all">
                    <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <useCase.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base mb-1">{useCase.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{useCase.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src={corporateGrowth} 
                alt="Equipe analisando resultados de crescimento" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Preços transparentes
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Investimento por tamanho da equipe
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Quanto maior a equipe, menor o custo por pessoa. Funcionários não pagam nada.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {companyPricing.map((tier, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all ${
                  tier.highlight 
                    ? 'border-primary shadow-lg scale-[1.02]' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-primary text-primary-foreground">
                    Mais popular
                  </div>
                )}
                <CardContent className="p-5 sm:p-6 text-center">
                  <p className="font-medium text-sm sm:text-base mb-4">{tier.range}</p>
                  <div className="mb-2">
                    <span className="text-3xl sm:text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{tier.perEmployee}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/cadastrar-empresa")}
              className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 bg-primary hover:bg-primary/90"
            >
              Cadastrar minha empresa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              Setup em minutos • Suporte dedicado • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            O que está incluído em todos os planos
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              "Gestão ilimitada de gestores",
              "Dashboard de progresso",
              "Relatórios em PDF",
              "OKRs corporativos",
              "8 ferramentas de autoconhecimento",
              "Diário de reflexão",
              "Notificações por e-mail",
              "Suporte prioritário",
              "LGPD compliance"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="hidden lg:block">
              <img 
                src={teamSuccess} 
                alt="Equipe celebrando conquista" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-base sm:text-lg text-muted-foreground italic mb-4">
                "Consiga acompanhar o desenvolvimento de cada pessoa do time. 
                O PDI transforma a cultura de feedbacks e aumenta muito o engajamento."
              </p>
              <p className="text-sm font-medium">— Ricardo M., Diretor de RH</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto max-w-3xl text-center">
          <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Pronto para transformar sua equipe?
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
            O PDI é a ponte entre os objetivos da empresa e o crescimento de cada colaborador.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/cadastrar-empresa")}
              className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 bg-primary hover:bg-primary/90"
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a 
              href="https://wa.me/5511995677999?text=Ol%C3%A1!%20Tenho%20interesse%20no%20PDI%20para%20minha%20empresa." 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 w-full sm:w-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Tirar Dúvidas pelo WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2024 PDI - Carreira & Vida. Todos os direitos reservados.</p>
          <Button 
            variant="link" 
            size="sm"
            onClick={() => navigate("/")}
            className="mt-2 text-muted-foreground"
          >
            Conhecer o PDI para pessoas físicas
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Empresas;
