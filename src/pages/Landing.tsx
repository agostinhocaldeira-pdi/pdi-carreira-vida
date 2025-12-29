import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Heart, 
  Zap, 
  CheckCircle2, 
  Star,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Award
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: "Clareza de Propósito",
      description: "Descubra quem você é e para onde realmente quer ir na vida e carreira"
    },
    {
      icon: Brain,
      title: "Autoconhecimento Profundo",
      description: "8 ferramentas cientificamente validadas para entender suas crenças, valores e potencial"
    },
    {
      icon: TrendingUp,
      title: "Metas que Funcionam",
      description: "Transforme sonhos vagos em objetivos SMART acionáveis com acompanhamento diário"
    },
    {
      icon: Heart,
      title: "Equilíbrio Vida-Carreira",
      description: "Alcance sucesso profissional sem sacrificar sua saúde, relacionamentos e felicidade"
    },
    {
      icon: Zap,
      title: "Ação Consistente",
      description: "Sistema de hábitos e reflexões diárias que garantem progresso contínuo"
    },
    {
      icon: Sparkles,
      title: "Insights com IA",
      description: "Análises inteligentes que revelam padrões ocultos e oportunidades de crescimento"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Gerente de Projetos",
      content: "Em 3 meses consegui a promoção que perseguia há anos. O PDI me deu clareza sobre meus valores e como comunicá-los.",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Empreendedor",
      content: "Estava perdido entre mil ideias. O método VVD me ajudou a focar no que realmente importa. Meu negócio cresceu 200%.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Advogada",
      content: "Finalmente entendi que sucesso não é só carreira. Hoje tenho equilíbrio, propósito e realização em todas as áreas.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10.000+", label: "Vidas Transformadas" },
    { number: "94%", label: "Taxa de Sucesso" },
    { number: "8", label: "Ferramentas Exclusivas" },
    { number: "24/7", label: "Acesso Ilimitado" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4 py-6 sm:py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center space-y-2 sm:space-y-4 md:space-y-6 animate-fade-in">
            <Badge className="mx-auto bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              +10.000 Pessoas Transformadas
            </Badge>
            
            <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold leading-snug">
              Transforme Sua
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
                Vida e Carreira
              </span>
              Hoje
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed hidden sm:block">
              <span className="font-semibold text-foreground">89% das pessoas vivem no piloto automático</span>. 
              <span className="font-semibold text-foreground"> Esse dia é hoje.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center pt-2 sm:pt-4">
              <Button 
                size="default" 
                className="text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
                onClick={() => navigate("/signup")}
              >
                Começar Agora
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="default" 
                variant="outline" 
                className="text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-6 border-2 w-full sm:w-auto"
                onClick={() => {
                  document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Conhecer o Método
              </Button>
            </div>

            <div className="hidden sm:flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>7 dias de garantia</span>
              <span className="text-muted-foreground/50">•</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Você Já Se Sentiu Assim?
              </h2>
              <p className="text-xl text-muted-foreground">
                Se alguma dessas situações é familiar, você não está sozinho...
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Acordo todos os dias sem entusiasmo, apenas cumprindo obrigações",
                "Trabalho duro, mas não vejo progresso real na minha carreira",
                "Tenho mil planos na cabeça, mas nenhum sai do papel",
                "Sacrifico minha saúde e relacionamentos pelo trabalho",
                "Não sei qual é meu verdadeiro propósito de vida",
                "Vejo outros conquistando seus sonhos enquanto fico parado"
              ].map((problem, index) => (
                <Card key={index} className="p-6 border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
                  <p className="text-foreground">{problem}</p>
                </Card>
              ))}
            </div>

            <div className="text-center space-y-6 pt-8">
              <p className="text-2xl font-semibold text-foreground">
                A verdade é que <span className="text-primary">você não precisa de mais motivação</span>.
              </p>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Você precisa de um <span className="font-semibold text-foreground">sistema claro, estruturado e científico</span> que 
                transforme suas intenções em ações concretas. Você precisa do <span className="font-bold text-primary">PDI - Carreira & Vida</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="como-funciona" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <Badge className="mx-auto bg-primary/10 text-primary border-primary/20">
                O Método PDI
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold">
                Como o PDI Transforma Sua Vida
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Um caminho estruturado em 3 fases para você sair da confusão e alcançar clareza total
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  phase: "Fase 1",
                  title: "Quem Sou Eu",
                  icon: Heart,
                  description: "Descubra seus valores, crenças e identidade real através de ferramentas como VVD, Valores e Roda da Vida"
                },
                {
                  phase: "Fase 2",
                  title: "Para Onde Vou",
                  icon: Target,
                  description: "Defina sua visão de futuro e objetivos claros usando métodos validados como SMART e Análise SWOT"
                },
                {
                  phase: "Fase 3",
                  title: "Como Chegar Lá",
                  icon: Zap,
                  description: "Execute com consistência através de metas, ações diárias e sistema de acompanhamento inteligente"
                }
              ].map((phase, index) => (
                <Card key={index} className="p-8 text-center space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-primary">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <phase.icon className="w-8 h-8 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">{phase.phase}</Badge>
                  <h3 className="text-2xl font-bold">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                8 Ferramentas Poderosas em Um Só Lugar
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tudo que você precisa para construir uma vida extraordinária
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <Badge className="mx-auto bg-primary/10 text-primary border-primary/20">
                <Users className="w-4 h-4 mr-2 inline" />
                Prova Social
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold">
                Veja o Que Nossos Usuários Dizem
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 space-y-4 hover:shadow-xl transition-shadow">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground italic">"{testimonial.content}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 border-2 border-primary/20 shadow-2xl">
            <div className="text-center space-y-6">
              <Badge className="mx-auto bg-destructive/10 text-destructive border-destructive/20 px-4 py-2">
                <Clock className="w-4 h-4 mr-2 inline" />
                Oferta por Tempo Limitado
              </Badge>
              
              <h2 className="text-3xl md:text-5xl font-bold">
                O Custo de Não Agir Agora
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Cada dia que passa sem clareza é um dia perdido. Quanto vale para você 
                <span className="font-semibold text-foreground"> acordar amanhã com propósito</span>, 
                sabendo exatamente onde quer chegar e como vai fazer isso acontecer?
              </p>

              <div className="grid md:grid-cols-3 gap-6 pt-8">
                {[
                  { icon: Award, text: "7 dias de garantia" },
                  { icon: Zap, text: "Acesso imediato" },
                  { icon: CheckCircle2, text: "Suporte dedicado" }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <item.icon className="w-8 h-8 text-primary" />
                    <p className="text-sm font-medium">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-pulse"
                  onClick={() => navigate("/signup")}
                >
                  Começar Minha Transformação Agora
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Junte-se a mais de 10.000 pessoas que já transformaram suas vidas
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Sua Nova Vida Começa Hoje
            </h2>
            <p className="text-xl text-muted-foreground">
              Não deixe mais um ano passar sem realizar seus sonhos. 
              A clareza que você busca está a um clique de distância.
            </p>
            <Button 
              size="lg" 
              className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/signup")}
            >
              Sim, Quero Ter Clareza Total
              <Sparkles className="ml-3 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 PDI - Carreira & Vida. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;