import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Target, 
  ArrowLeft, 
  CircleDot, 
  Grid2X2, 
  Compass, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  LayoutGrid, 
  Brain,
  Wrench
} from "lucide-react";

const Ferramentas = () => {
  const ferramentas = [
    {
      nome: "Roda da Vida",
      descricao: "Avalie o equilíbrio entre as diferentes áreas da sua vida",
      icon: CircleDot,
      link: "/ferramentas/roda-da-vida",
      color: "text-primary"
    },
    {
      nome: "Análise SWOT",
      descricao: "Identifique suas forças, fraquezas, oportunidades e ameaças",
      icon: Grid2X2,
      link: "/ferramentas/swot",
      color: "text-accent"
    },
    {
      nome: "Método VVD",
      descricao: "Defina sua Visão, Valores e Direção de vida",
      icon: Compass,
      link: "/ferramentas/vvd",
      color: "text-primary"
    },
    {
      nome: "SMART",
      descricao: "Crie metas específicas, mensuráveis, alcançáveis, relevantes e temporais",
      icon: CheckCircle2,
      link: "/ferramentas/smart",
      color: "text-accent"
    },
    {
      nome: "Valores",
      descricao: "Descubra e priorize seus valores essenciais",
      icon: Heart,
      link: "/ferramentas/valores",
      color: "text-destructive"
    },
    {
      nome: "Pedido ao Gênio",
      descricao: "Visualize seus desejos mais profundos e autênticos",
      icon: Sparkles,
      link: "/ferramentas/genio",
      color: "text-primary"
    },
    {
      nome: "Matriz de Eisenhower",
      descricao: "Organize tarefas por urgência e importância",
      icon: LayoutGrid,
      link: "/ferramentas/eisenhower",
      color: "text-accent"
    },
    {
      nome: "Crenças",
      descricao: "Identifique e transforme crenças limitantes",
      icon: Brain,
      link: "/ferramentas/crencas",
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wrench className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Ferramentas de Desenvolvimento</h1>
            </div>
            <Link to="/home">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Seção Introdutória */}
        <Card className="shadow-large border-primary/20 animate-slide-up">
          <CardHeader className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">
                  Por que usar ferramentas de autodesenvolvimento?
                </CardTitle>
                <CardDescription className="text-base">
                  Transforme intenções em ações concretas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              O autodesenvolvimento é uma jornada contínua que requer clareza, estrutura e método. 
              As ferramentas certas funcionam como mapas que iluminam o caminho, revelando onde você está, 
              para onde quer ir e como chegar lá.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">Autoconhecimento</h3>
                <p className="text-sm text-muted-foreground">
                  Descubra seus valores, forças e áreas de crescimento com profundidade
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                <h3 className="font-semibold text-accent mb-2">Clareza de Propósito</h3>
                <p className="text-sm text-muted-foreground">
                  Defina objetivos alinhados com sua visão e valores essenciais
                </p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">Ação Estratégica</h3>
                <p className="text-sm text-muted-foreground">
                  Transforme insights em planos práticos e mensuráveis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Ferramentas */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Escolha sua ferramenta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ferramentas.map((ferramenta, index) => {
              const Icon = ferramenta.icon;
              return (
                <Card 
                  key={ferramenta.nome}
                  className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/30 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={ferramenta.link}>
                    <CardContent className="pt-6 space-y-4">
                      <div className={`w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow ${ferramenta.color}`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {ferramenta.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {ferramenta.descricao}
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                          Começar
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20 shadow-medium">
          <CardContent className="py-8 text-center space-y-3">
            <h3 className="text-xl font-semibold">Pronto para dar o próximo passo?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada ferramenta foi projetada para revelar insights únicos sobre você e sua jornada. 
              Comece pela que mais ressoa com o momento atual da sua vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/home">
                <Button variant="outline" className="w-full sm:w-auto">
                  Voltar ao Dashboard
                </Button>
              </Link>
              <Link to="/construcao-guiada">
                <Button className="w-full sm:w-auto gap-2">
                  <Compass className="w-4 h-4" />
                  Construção Guiada
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Ferramentas;
