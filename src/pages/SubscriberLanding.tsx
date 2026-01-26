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
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            onClick={() => navigate("/login")}
            className="bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] text-sm sm:text-base font-semibold"
          >
            Entrar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section - Emocional e Direto */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#D4AF37]/3" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 mb-6">
            <Flame className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#D4AF37]">Bem-vindo de volta</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Sua evolução está{" "}
            <span className="text-[#D4AF37]">esperando por você</span>.
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 font-light leading-relaxed">
            Cada dia é uma nova oportunidade de transformar seus sonhos em conquistas reais.
          </p>
          
          <div className="pt-6">
            <p className="text-white/50 mb-2">Ainda não é assinante?</p>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              Conheça o PDI
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Seção Motivacional - 3 Pilares */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Por que continuar hoje?
            </h2>
            <p className="text-white/60 text-lg">
              O progresso não espera. Seus objetivos também não.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#D4AF37]/60 bg-[#222222] border-white/10">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Clareza</h3>
                <p className="text-white/60 leading-relaxed">
                  Seu plano de vida te espera. Cada reflexão registrada é um passo mais perto de quem você quer ser.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#D4AF37]/60 bg-[#222222] border-white/10">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Foco</h3>
                <p className="text-white/60 leading-relaxed">
                  Suas metas estão definidas. Agora é hora de agir. Cada ação concluída te aproxima da vitória.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#D4AF37]/60 bg-[#222222] border-white/10">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Progresso</h3>
                <p className="text-white/60 leading-relaxed">
                  Você já começou. Continue. A consistência é o que separa sonhos de conquistas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção de Impacto Emocional */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-[#252525] via-[#1A1A1A] to-[#D4AF37]/5">
        <div className="container mx-auto max-w-3xl text-center">
          <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
          
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed italic">
            "A pessoa que você será daqui a um ano está sendo construída{" "}
            <span className="text-[#D4AF37] not-italic font-bold">agora</span>, pelas escolhas que você faz{" "}
            <span className="text-[#D4AF37] not-italic font-bold">hoje</span>."
          </blockquote>
          
          <p className="text-white/60 text-lg mb-10">
            Não deixe seus objetivos para amanhã. Seu futuro agradece cada passo dado hoje.
          </p>

          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-base sm:text-lg px-8 py-6 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] font-semibold shadow-lg"
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
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#222222] border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
              <Star className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Diário de Reflexão</p>
                <p className="text-sm text-white/60">5 minutos que mudam seu dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#222222] border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
              <Target className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Suas Metas</p>
                <p className="text-sm text-white/60">Acompanhe seu progresso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-t from-[#D4AF37]/10 to-[#1A1A1A]">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            Pronto para evoluir?
          </h2>
          <p className="text-white/60 mb-8">
            Seu plano de desenvolvimento pessoal está a um clique de distância.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-lg px-10 py-7 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Entrar agora
            <Sparkles className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="py-6 border-t border-white/10 bg-[#151515]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} PDI - Carreira e Vida. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SubscriberLanding;
