import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { useState } from "react";

// Import section components
import HeroSectionPersonalized from "@/components/landing-nova/HeroSectionPersonalized";
import LandingWhatIsSection from "@/components/landing-nova/WhatIsSection";
import LandingFeaturesSection from "@/components/landing-nova/FeaturesSection";
import LandingStepsSection from "@/components/landing-nova/StepsSection";
import LandingTestimonialsSection from "@/components/landing-nova/TestimonialsSection";
import LandingAccessSection from "@/components/landing-nova/AccessSection";
import LandingRiskFreeSection from "@/components/landing-nova/RiskFreeSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const LandingConstancia = () => {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleCTA = () => {
    navigate("/signup");
  };

  const openVideoModal = (url: string) => {
    setVideoUrl(url);
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-sm sm:text-base"
            >
              Entrar
            </Button>
            <Button 
              onClick={handleCTA}
              className="bg-primary hover:bg-primary/90 text-sm sm:text-base"
            >
              Começar Grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSectionPersonalized 
          onCTA={handleCTA}
          headline="Não confie na força de vontade. Confie no Progresso Visual."
          subheadline="A motivação acaba, mas o hábito fica. Gere dopamina diária vendo seus gráficos de evolução subirem, mesmo nos dias difíceis."
          ctaText="👉 Ativar meu Rastreador de Hábito"
        />
        <LandingWhatIsSection />
        <LandingFeaturesSection />
        <LandingStepsSection />
        <LandingTestimonialsSection onOpenVideo={openVideoModal} />
        <LandingAccessSection onCTA={handleCTA} />
        <LandingRiskFreeSection onCTA={handleCTA} />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDI - Carreira e Vida. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Video Modal */}
      {videoModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl"
              onClick={() => setVideoModalOpen(false)}
            >
              ✕
            </button>
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingConstancia;
