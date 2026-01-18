import { Button } from "@/components/ui/button";
import { CheckCircle2, Smartphone, Target, Calendar, Brain, Headphones, ArrowRight } from "lucide-react";

const accessItems = [
  {
    icon: Smartphone,
    text: "Acesso completo à Plataforma Web e Mobile"
  },
  {
    icon: Target,
    text: "Ferramenta de Metas SMART GUIADA (exclusiva do PDI)"
  },
  {
    icon: Calendar,
    text: "Agenda Inteligente Integrada"
  },
  {
    icon: Brain,
    text: "Análise de Perfil com IA"
  },
  {
    icon: Headphones,
    text: "Suporte com especialista"
  }
];

interface AccessSectionProps {
  onCTA: () => void;
}

const AccessSection = ({ onCTA }: AccessSectionProps) => {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Seu acesso gratuito libera imediatamente:
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {accessItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-5 rounded-xl bg-success/10 border border-success/20"
            >
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-success" />
              </div>
              <p className="text-foreground font-medium">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onCTA}
            className="text-base sm:text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Testar Gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
