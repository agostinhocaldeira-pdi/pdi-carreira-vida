import { Button } from "@/components/ui/button";
import { Shield, Calendar, CreditCard, MousePointerClick, ArrowRight, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Calendar,
    text: "30 dias de uso completo"
  },
  {
    icon: CreditCard,
    text: "Sem cartão de crédito"
  },
  {
    icon: MousePointerClick,
    text: "Cancele quando quiser com um clique"
  }
];

interface RiskFreeSectionProps {
  onCTA: () => void;
}

const RiskFreeSection = ({ onCTA }: RiskFreeSectionProps) => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-t from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
          <Shield className="w-5 h-5 text-success" />
          <span className="text-success font-medium">Garantia de satisfação</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Experimente sem risco
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border/50"
            >
              <benefit.icon className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        <Button 
          size="lg" 
          onClick={onCTA}
          className="text-base sm:text-lg px-6 sm:px-10 py-6 sm:py-7 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-normal h-auto"
        >
          <span className="mr-2">👉</span>
          <span className="text-center">Criar minha conta gratuita</span>
          <Sparkles className="ml-2 sm:ml-3 w-5 h-5 flex-shrink-0" />
        </Button>
      </div>
    </section>
  );
};

export default RiskFreeSection;
