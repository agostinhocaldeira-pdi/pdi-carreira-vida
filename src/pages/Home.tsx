import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Target, TrendingUp, BookOpen, MessagesSquare, Book, Sparkles } from "lucide-react";
import ProgressSection from "@/components/home/ProgressSection";
import PlanoDeVida from "@/components/home/PlanoDeVida";
import MaoNaMassa from "@/components/home/MaoNaMassa";

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">PDI - Carreira & Vida</h1>
              <p className="text-sm text-muted-foreground">Olá, {userName || "Usuário"}!</p>
            </div>
            <Button variant="outline" size="sm">
              Perfil
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Progresso Section */}
        <section className="animate-slide-up">
          <ProgressSection />
        </section>

        {/* Plano de Vida Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <PlanoDeVida />
        </section>

        {/* Mão na Massa Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <MaoNaMassa />
        </section>

        {/* Navegação Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Recursos
              </CardTitle>
              <CardDescription>Acesse ferramentas e suporte para sua jornada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/construcao-guiada">
                  <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Construção Guiada</h3>
                      <p className="text-sm text-muted-foreground">
                        Trilha passo a passo para construir seu PDI
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/ferramentas">
                  <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Ferramentas</h3>
                      <p className="text-sm text-muted-foreground">
                        SWOT, Roda da Vida e mais
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/suporte">
                  <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <MessagesSquare className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Suporte</h3>
                      <p className="text-sm text-muted-foreground">
                        Chat de ajuda e orientação
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/diario">
                  <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Book className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Diário</h3>
                      <p className="text-sm text-muted-foreground">
                        Registre reflexões e avanços
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Home;
