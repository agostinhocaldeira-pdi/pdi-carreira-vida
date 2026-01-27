import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StoicReflectionSection from "@/components/home/StoicReflectionSection";

const Reflexao = () => {
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
              Diário
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Registre sua jornada
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Diary Section */}
        <section className="animate-slide-up">
          <StoicReflectionSection />
        </section>
      </main>
    </div>
  );
};

export default Reflexao;
