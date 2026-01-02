import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight,
  Sparkles,
  Target,
  Brain,
  TrendingUp,
  Heart,
  Flame,
  Star
} from "lucide-react";
import Logo from "@/components/Logo";

const SubscriberLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-sm sm:text-base"
          >
            Entrar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section - Emocional e Direto */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Bem-vindo de volta</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            Sua evolução está{" "}
            <span className="text-primary">esperando por você</span>.
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 font-light leading-relaxed">
            Cada dia é uma nova oportunidade de transformar seus sonhos em conquistas reais.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-lg sm:text-xl px-10 py-7 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Continuar minha jornada
            <Sparkles className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Seção Motivacional - 3 Pilares */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Por que continuar hoje?
            </h2>
            <p className="text-muted-foreground text-lg">
              O progresso não espera. Seus objetivos também não.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary/60 bg-gradient-to-b from-card to-primary/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Clareza</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seu plano de vida te espera. Cada reflexão registrada é um passo mais perto de quem você quer ser.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent/60 bg-gradient-to-b from-card to-accent/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Foco</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Suas metas estão definidas. Agora é hora de agir. Cada ação concluída te aproxima da vitória.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-success/60 bg-gradient-to-b from-card to-success/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Progresso</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Você já começou. Continue. A consistência é o que separa sonhos de conquistas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção de Impacto Emocional */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-muted/20 via-background to-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
          
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed italic">
            "A pessoa que você será daqui a um ano está sendo construída{" "}
            <span className="text-primary not-italic font-bold">agora</span>, pelas escolhas que você faz{" "}
            <span className="text-primary not-italic font-bold">hoje</span>."
          </blockquote>
          
          <p className="text-muted-foreground text-lg mb-10">
            Não deixe seus objetivos para amanhã. Seu futuro agradece cada passo dado hoje.
          </p>

          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-base sm:text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg"
          >
            Acessar meu PDI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Lembretes Rápidos */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <Star className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Diário de Reflexão</p>
                <p className="text-sm text-muted-foreground">5 minutos que mudam seu dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <Target className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Suas Metas</p>
                <p className="text-sm text-muted-foreground">Acompanhe seu progresso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-t from-primary/10 to-background">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            Pronto para evoluir?
          </h2>
          <p className="text-muted-foreground mb-8">
            Seu plano de desenvolvimento pessoal está a um clique de distância.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Entrar agora
            <Sparkles className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="py-6 border-t bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDI - Carreira e Vida. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SubscriberLanding;
