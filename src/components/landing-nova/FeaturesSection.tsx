import { Target, Calendar, TrendingUp, Brain, ListChecks, BookOpen } from "lucide-react";

const features = [
  {
    icon: Target,
    text: "Planejamento guiado de objetivos (vida e carreira)"
  },
  {
    icon: ListChecks,
    text: "Transformação de metas em planos semanais possíveis"
  },
  {
    icon: Calendar,
    text: "Agenda Inteligente, integrada com seus planos"
  },
  {
    icon: TrendingUp,
    text: "Acompanhamento visual de progresso"
  },
  {
    icon: Brain,
    text: "Apoio de Inteligência Artificial para clareza e organização"
  },
  {
    icon: BookOpen,
    text: "Página de Reflexão e diário, para registrar sua jornada"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          O que você encontra dentro da plataforma
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-foreground font-medium">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
