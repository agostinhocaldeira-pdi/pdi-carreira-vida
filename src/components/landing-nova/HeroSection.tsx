import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onCTA: () => void;
}

const HeroSection = ({ onCTA }: HeroSectionProps) => {
  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            PDI – Carreira e Vida
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary font-medium mb-6">
            A plataforma digital para organizar vida e carreira em um plano claro, prático e executável.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Pare de tentar organizar sua vida em cadernos ou planilhas soltas. Use um sistema com apoio da{" "}
            <span className="text-primary font-medium">Inteligência Artificial</span> que integra seus objetivos à sua rotina real.
          </p>
        </div>

        {/* Video Preview - YouTube Embed */}
        <div className="relative mx-auto max-w-5xl mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-video">
            <iframe
              src="https://www.youtube.com/embed/jatbs2MI37w?autoplay=1&mute=1&loop=1&playlist=jatbs2MI37w&controls=0&showinfo=0&rel=0&modestbranding=1"
              title="PDI - Carreira e Vida"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onCTA}
            className="text-base sm:text-lg px-6 sm:px-8 py-6 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-normal h-auto"
          >
            <span className="text-center">Começar meu Teste Grátis na Plataforma</span>
            <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
          </Button>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Acesso imediato
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Sem cartão de crédito
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Cancele quando quiser
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
