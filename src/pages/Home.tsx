import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Target, TrendingUp, BookOpen, MessagesSquare, Book, Sparkles, LogIn, User, Zap, Star, Shield, Lock } from "lucide-react";
import ProgressSection from "@/components/home/ProgressSection";
import DiarioSection from "@/components/home/DiarioSection";
import PlanoDeVida from "@/components/home/PlanoDeVida";
import MaoNaMassa from "@/components/home/MaoNaMassa";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("quem-sou");
  const [planoDeVidaOpen, setPlanoDeVidaOpen] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const quotes = [
    "Acredite em si mesmo e todo o resto se encaixará. 💪",
    "O sucesso é a soma de pequenos esforços repetidos. 🌟",
    "Sua única limitação é você mesmo. 🚀",
    "Grandes conquistas exigem tempo. Continue avançando! ⭐",
    "Cada passo conta na sua jornada de crescimento. 🎯",
    "O melhor momento para começar é agora. ✨",
    "Transforme seus sonhos em objetivos e seus objetivos em realidade. 🌈",
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
      
      // Verifica se o usuário está cadastrado como administrador
      const savedAdmins = localStorage.getItem("administrators");
      if (savedAdmins) {
        const administrators = JSON.parse(savedAdmins);
        const userIsAdmin = administrators.some(
          (admin: { email: string }) => admin.email === userData.email
        );
        setIsAdmin(userIsAdmin);
      }
    }

    // Seleciona uma frase motivacional baseada no dia
    const today = new Date().getDate();
    setMotivationalQuote(quotes[today % quotes.length]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-to-r from-card via-card to-primary/5 border-b shadow-elegant backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Top row - Logo, Quote and Actions */}
          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate">
                    PDI - Carreira & Vida
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary flex-shrink-0" />
                    <span className="truncate">Olá, {userName || "Usuário"}!</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {!userName ? (
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </Button>
              )}
            </div>
          </div>

          {/* Bottom row - Motivational quote and progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground/90 line-clamp-2">
                {motivationalQuote}
              </p>
            </div>
            
            <Badge variant="secondary" className="gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 whitespace-nowrap self-start sm:self-auto">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Em progresso</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Progresso Section */}
        <section className="animate-slide-up">
          <ProgressSection />
        </section>

        {/* Diário Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <DiarioSection />
        </section>

        {/* Plano de Vida Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <PlanoDeVida onTabChange={setActiveTab} onOpenChange={setPlanoDeVidaOpen} />
        </section>

        {/* Mão na Massa Section - aparece ao clicar em "Como chegar lá" */}
        {planoDeVidaOpen && activeTab === "como-chegar" && (
          <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <MaoNaMassa />
          </section>
        )}

        {/* Recursos Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Recursos
              </CardTitle>
              <CardDescription>Acesse ferramentas e suporte para sua jornada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Área Restrita - Apenas para Administradores */}
        {isAdmin && (
          <section className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <Card className="shadow-medium border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-xl">Área Restrita</CardTitle>
                </div>
                <CardDescription>Acesso exclusivo para administradores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1">Painel Administrativo</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Gerencie usuários, visualize estatísticas e configure o sistema
                      </p>
                    </div>
                  </div>
                  <Link to="/admin" className="w-full sm:w-auto">
                    <Button variant="destructive" className="w-full sm:w-auto gap-2">
                      <Shield className="w-4 h-4" />
                      Acessar Painel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
