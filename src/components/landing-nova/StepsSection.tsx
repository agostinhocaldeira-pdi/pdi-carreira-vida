import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Rocket, TrendingUp } from "lucide-react";

// Import step images
import planoVidaImg from "@/assets/tutorial/plano-vida.jpg";
import maoNaMassaImg from "@/assets/tutorial/mao-na-massa.jpg";
import progressoImg from "@/assets/tutorial/progresso.jpg";

const steps = [
  {
    number: "1",
    title: "Planejar",
    subtitle: "Módulo de Clareza",
    description: "Entenda seu momento atual, prioridades e o que realmente importa agora, para definir objetivos e transformá-los em ações compatíveis com sua rotina real.",
    icon: Lightbulb,
    image: planoVidaImg,
    color: "primary"
  },
  {
    number: "2",
    title: "Agir",
    subtitle: "Módulo de Rotina",
    description: "O sistema transforma \"sonhos grandes\" em tarefas semanais. Você acorda na segunda-feira sabendo exatamente o que priorizar.",
    icon: Rocket,
    image: maoNaMassaImg,
    color: "accent"
  },
  {
    number: "3",
    title: "Evoluir",
    subtitle: "Módulo de IA",
    description: "Acompanhe seu progresso com gráficos e relatórios, e receba feedbacks da nossa Inteligência Artificial para corrigir a rota.",
    icon: TrendingUp,
    image: progressoImg,
    color: "success"
  }
];

const StepsSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Do Caos à Clareza em 3 Passos
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Um método simples e eficaz para transformar seus objetivos em realidade
        </p>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-t-4 hover:shadow-xl transition-all duration-300"
              style={{ borderTopColor: `hsl(var(--${step.color}))` }}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  
                  {/* Step number badge */}
                  <div 
                    className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: `hsl(var(--${step.color}))` }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon 
                      className="w-6 h-6" 
                      style={{ color: `hsl(var(--${step.color}))` }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: `hsl(var(--${step.color}))` }}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
