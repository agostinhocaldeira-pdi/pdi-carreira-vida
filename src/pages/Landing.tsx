import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  TrendingUp, 
  Brain, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Eye,
  Layout,
  BarChart3,
  Cpu,
  Calendar,
  Compass
} from "lucide-react";
import Logo from "@/components/Logo";

// Import platform images
import dashboardOverview from "@/assets/tutorial/dashboard-overview.jpg";
import planoVida from "@/assets/tutorial/plano-vida.jpg";
import maoNaMassa from "@/assets/tutorial/mao-na-massa.jpg";
import progresso from "@/assets/tutorial/progresso.jpg";
import ferramentas from "@/assets/tutorial/ferramentas.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const platformFeatures = [
    {
      icon: Eye,
      title: "Sua Vida, Sua Carreira: Uma Visão Integrada",
      description: "Tenha uma perspectiva clara de todos os aspectos importantes da sua vida e carreira em um só lugar.",
      image: dashboardOverview
    },
    {
      icon: Target,
      title: "Clareza para o Futuro",
      description: "Defina seus objetivos de forma estratégica e alinhada com seus valores e aspirações.",
      image: planoVida
    },
    {
      icon: Layout,
      title: "Do Planejamento à Execução",
      description: "Transforme seus objetivos em planos de ação concretos e gerenciáveis.",
      image: maoNaMassa
    },
    {
      icon: BarChart3,
      title: "Evolução Constante",
      description: "Monitore seu progresso de forma visual e intuitiva, mantendo-se motivado e no caminho certo.",
      image: progresso
    },
    {
      icon: Cpu,
      title: "Inteligência Artificial a Seu Favor",
      description: "Conte com o suporte da IA para insights, sugestões e otimização contínua do seu planejamento.",
      image: ferramentas
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/login")}
            className="text-primary border-primary/30 hover:bg-primary/10 text-xs sm:text-sm"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 1) HERO SECTION - ABERTURA REFLEXIVA */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            Em algum momento, a vida cobra{" "}
            <span className="text-primary">organização</span>.
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 sm:mb-12 font-light">
            A diferença é se você se antecipa… ou reage.
          </p>
          
          <Button 
            size="lg" 
            variant="outline"
            className="text-base sm:text-lg px-8 py-6 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            onClick={() => scrollToSection("contexto")}
          >
            Entender como funciona
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2) SEÇÃO DE CONTEXTO E DESEJO */}
      {/* ============================================================ */}
      <section id="contexto" className="py-16 sm:py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Onde você se encontra?
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            Você não está perdido, mas talvez sinta que falta um controle mais firme sobre os próximos passos. 
            É natural desejar a <strong className="text-foreground">estabilidade</strong>, a <strong className="text-foreground">clareza</strong> e 
            a <strong className="text-foreground">tranquilidade</strong> para sustentar a vida que você construiu e planejou.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3) SEÇÃO DO PROBLEMA REAL */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
              O Desafio da Constância
            </h2>
          </div>
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-8 sm:p-12">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                Muitas vezes, o que nos impede não é a falta de esforço ou capacidade, mas a{" "}
                <strong className="text-foreground">ausência de um sistema confiável</strong>. 
                Um método que ofereça <span className="text-primary font-medium">estrutura para suas decisões</span>, 
                {" "}<span className="text-primary font-medium">clareza para seu foco</span> e{" "}
                <span className="text-primary font-medium">constância para suas ações</span>, dia após dia.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4) APRESENTAÇÃO DO MÉTODO PDI */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Compass className="w-4 h-4 mr-2 inline" />
              O Método
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
              O PDI: Seu Sistema de Organização Pessoal
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              O PDI é um <strong className="text-foreground">sistema prático de organização de vida e carreira</strong>, 
              desenvolvido para oferecer clareza e direção. Com acompanhamento contínuo e o apoio da inteligência artificial, 
              ele foi criado para te ajudar a navegar pelas complexidades do dia a dia com mais segurança e propósito.
            </p>
          </div>

          {/* 3 Pilares do Método */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                phase: "Autoconhecimento",
                icon: Brain,
                description: "Descubra seus valores, crenças e o que realmente importa para você através de ferramentas validadas."
              },
              {
                phase: "Planejamento",
                icon: Target,
                description: "Defina objetivos claros e construa um plano estruturado que conecta onde você está com onde quer chegar."
              },
              {
                phase: "Execução",
                icon: TrendingUp,
                description: "Transforme seu plano em ações diárias com acompanhamento contínuo e suporte inteligente."
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary/50 bg-card">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.phase}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5) FUNCIONALIDADES DA PLATAFORMA (VISUAL FIRST) */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Uma Plataforma Completa
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Conheça as principais funcionalidades que vão te ajudar a organizar sua vida e carreira.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {platformFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`space-y-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="rounded-xl shadow-xl w-full border border-border/30"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6) SEGURANÇA DE USO — GARANTIA DE 30 DIAS */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 shadow-xl bg-card">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Experimente Sem Compromisso
              </h2>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                Confiamos no poder transformador do PDI. Por isso, oferecemos a você a oportunidade de{" "}
                <strong className="text-foreground">usar o sistema completo por 30 dias, sem qualquer risco</strong>. 
                Você só será cobrado após este período. Caso decida que o PDI não é para você, 
                o cancelamento é simples, rápido e sem burocracia — <strong className="text-foreground">sem cobrança alguma</strong>.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>30 dias grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Cancele quando quiser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Sem burocracia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7) APRESENTAÇÃO DO LABORATÓRIO DE FUNDADORES */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <Users className="w-4 h-4 mr-2 inline" />
              Convite Especial
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Torne-se um Fundador do PDI
            </h2>
          </div>

          <Card className="border border-accent/30 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-8 sm:p-12">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 text-center">
                Convidamos você a fazer parte de um <strong className="text-foreground">grupo seleto de 100 pessoas</strong> para 
                integrar o <strong className="text-foreground">Laboratório de Fundadores</strong>. Como fundador, você terá:
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {[
                  "Acesso completo ao sistema por 12 meses",
                  "Participação ativa na validação do método",
                  "Contribuição direta no aprimoramento do PDI",
                  "Possibilidade de condições especiais futuras"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-foreground text-sm sm:text-base">{item}</p>
                  </div>
                ))}
              </div>

              <div className="text-center pt-6 border-t border-border/50">
                <p className="text-muted-foreground mb-2">Valor simbólico para fundadores:</p>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  R$ 67
                </div>
                <p className="text-sm text-muted-foreground">
                  Pagamento único • Não renovável • Acesso por 12 meses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8) CTA FINAL */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Dê o Próximo Passo com Confiança
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Comece hoje a construir a organização e a clareza que sua vida e carreira merecem. 
            Lembre-se: você tem <strong className="text-foreground">30 dias para experimentar o PDI sem risco</strong>.
          </p>

          <Button 
            size="lg" 
            className="text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/signup")}
          >
            Iniciar minha Experiência de 30 Dias
            <Sparkles className="ml-3 w-5 h-5" />
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            Acesso imediato • Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDI - Carreira & Vida. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
