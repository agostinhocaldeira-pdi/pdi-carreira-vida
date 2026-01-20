import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Zap, ArrowRight } from "lucide-react";

const QuizCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 px-4 bg-primary">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
              Você tem capacidade, mas a execução trava. Sabe por quê?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-6 leading-relaxed">
              Existe um <span className="font-semibold">"padrão oculto"</span> rodando no seu piloto automático que impede seus planos de saírem do papel.
            </p>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Nossa IA identifica qual é o seu em <span className="font-bold">2 minutos</span>.
            </p>
            
            <div className="flex flex-col items-center lg:items-start gap-3">
              <Button 
                size="lg"
                onClick={() => navigate("/quiz")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
              >
                👉 Quero entender meu padrão
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-primary-foreground/70">
                Responda 5 perguntas rápidas para entender qual padrão de comportamento pode estar drenando sua energia hoje.
              </p>
            </div>
          </div>

          {/* Right side - Icon/Card */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Floating card with X-ray/magnifying glass effect */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  {/* Main search icon */}
                  <Search className="w-20 h-20 sm:w-24 sm:h-24 text-primary-foreground" strokeWidth={1.5} />
                  
                  {/* Zap icon overlay for "discovery" effect */}
                  <div className="absolute -top-2 -right-2 bg-accent rounded-full p-2 shadow-lg animate-pulse">
                    <Zap className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-accent/30 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizCTASection;
