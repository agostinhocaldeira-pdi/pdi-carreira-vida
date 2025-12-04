import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Rocket, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  Compass,
  Brain,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Heart,
  Lightbulb,
  User,
  Building2
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const journeySteps = [
    {
      icon: Rocket,
      title: "Onboarding Personalizado",
      description: "Comece sua jornada com um processo guiado que entende sua fase de vida e expectativas.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Brain,
      title: "Autoconhecimento Profundo",
      description: "Descubra seus valores, crenças e visão de vida através de ferramentas como VVD, Roda da Vida e Análise SWOT.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Compass,
      title: "Plano de Vida Estruturado",
      description: "Defina quem você é, para onde vai e como chegará lá com um plano claro e acionável.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Objetivos & Metas SMART",
      description: "Transforme sonhos em objetivos concretos com metodologia comprovada e prazos definidos.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: BookOpen,
      title: "Diário de Reflexão",
      description: "Registre seu humor, conquistas e gratidão diariamente para acompanhar sua evolução.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: CheckCircle2,
      title: "Acompanhamento de Progresso",
      description: "Visualize seu avanço com gráficos, alertas de prazos e insights personalizados por IA.",
      color: "from-green-500 to-lime-500"
    }
  ];

  const tools = [
    "Roda da Vida",
    "Análise SWOT", 
    "Método VVD",
    "Metas SMART",
    "Matriz de Eisenhower",
    "Exercício de Valores",
    "Transformação de Crenças",
    "Autoavaliação 360º"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <span className="font-bold text-sm sm:text-xl whitespace-nowrap">PDI</span>
            <span className="font-bold text-sm sm:text-xl hidden sm:inline whitespace-nowrap">- Carreira & Vida</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Transforme sua vida com clareza e propósito
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Um sistema completo de desenvolvimento pessoal que integra carreira e vida. 
            Do autoconhecimento à execução diária das suas metas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setIsModalOpen(true)}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
            >
              Começar minha jornada
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Sua jornada de transformação
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Um passo de cada vez, do autoconhecimento à realização dos seus objetivos
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((step, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      Etapa {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            8 ferramentas poderosas
          </h2>
          <p className="text-muted-foreground mb-8">
            Metodologias comprovadas para seu desenvolvimento
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-background border border-border rounded-full text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Clareza de Propósito</h3>
              <p className="text-muted-foreground text-sm">
                Entenda quem você é e o que realmente importa na sua vida
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Progresso Mensurável</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe sua evolução com métricas e insights em tempo real
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Ação Direcionada</h3>
              <p className="text-muted-foreground text-sm">
                Transforme planos em ações diárias que levam a resultados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8">
            Sua transformação começa com o primeiro passo. Cadastre-se gratuitamente.
          </p>
          <Button 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 bg-primary hover:bg-primary/90 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Criar meu PDI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 PDI - Carreira & Vida. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Como deseja se cadastrar?</DialogTitle>
            <DialogDescription className="text-center">
              Escolha a opção que melhor se aplica a você
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsModalOpen(false);
                navigate("/signup");
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Pessoa Física</div>
                <div className="text-sm text-muted-foreground">Quero criar meu PDI pessoal</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsModalOpen(false);
                navigate("/cadastrar-empresa");
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Empresa</div>
                <div className="text-sm text-muted-foreground">Quero cadastrar minha empresa</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
