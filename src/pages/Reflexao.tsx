import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MousePointerClick } from "lucide-react";
import StoicReflectionCard from "@/components/home/StoicReflectionCard";
import StoicReflectionSection from "@/components/home/StoicReflectionSection";
import DiaryScientificModal from "@/components/DiaryScientificModal";

const Reflexao = () => {
  const [isScientificModalOpen, setIsScientificModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/home">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Reflexão & Diário
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Cultive sua mente e registre sua jornada
            </p>
            <button
              onClick={() => setIsScientificModalOpen(true)}
              className="inline-flex items-center gap-2 text-wine hover:text-wine/80 font-medium text-xs sm:text-sm transition-colors underline underline-offset-4 mt-1"
            >
              <MousePointerClick className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
              Clique aqui: Entenda o que diz a ciência sobre ter um diário
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stoic Reflection Card */}
        <section className="animate-slide-up">
          <StoicReflectionCard />
        </section>

        {/* Diary & Reflection Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <StoicReflectionSection />
        </section>
      </main>

      <DiaryScientificModal 
        open={isScientificModalOpen} 
        onOpenChange={setIsScientificModalOpen} 
      />
    </div>
  );
};

export default Reflexao;
