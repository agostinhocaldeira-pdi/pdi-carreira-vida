import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, PlayCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import LogoutButton from "@/components/LogoutButton";

const ConstrucaoGuiada = () => {
  const modulos = [
    {
      id: "modulo-1",
      titulo: "Introdução",
      descricao: "Entenda o método PDI e como ele pode transformar sua vida pessoal e profissional",
      aulas: []
    },
    {
      id: "modulo-2",
      titulo: "Quem sou eu",
      descricao: "Descubra seus valores, propósito e identidade através de ferramentas de autoconhecimento",
      aulas: []
    },
    {
      id: "modulo-3",
      titulo: "Para onde vou",
      descricao: "Defina seus objetivos e visualize o futuro que você deseja construir",
      aulas: []
    },
    {
      id: "modulo-4",
      titulo: "Como vou chegar lá",
      descricao: "Planeje suas metas, ações e estratégias para alcançar seus objetivos",
      aulas: []
    },
    {
      id: "modulo-5",
      titulo: "Refine o Instrumento",
      descricao: "Ajuste e otimize seu PDI com base em sua experiência e aprendizados",
      aulas: []
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-2xl font-bold truncate">Construção Guiada do PDI</h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Seção Introdutória */}
        <Card className="shadow-large border-primary/20 animate-slide-up">
          <CardHeader className="space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
                <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-2">
                  Trilha de Desenvolvimento PDI
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Siga esta jornada estruturada para construir seu Plano de Desenvolvimento Individual completo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              Esta trilha guiada foi desenvolvida para te acompanhar em cada etapa da construção do seu PDI. 
              Cada módulo contém aulas com vídeos explicativos e materiais de apoio para facilitar seu aprendizado e aplicação prática.
            </p>
          </CardContent>
        </Card>

        {/* Módulos da Trilha */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Módulos da Trilha</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Expanda cada módulo para acessar as aulas e materiais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {modulos.map((modulo, index) => (
                <AccordionItem key={modulo.id} value={modulo.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg">{modulo.titulo}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{modulo.descricao}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-11 pt-4 space-y-4">
                      {modulo.aulas.length === 0 ? (
                        <div className="bg-muted/30 rounded-lg p-6 text-center">
                          <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">
                            As aulas deste módulo serão adicionadas em breve
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {modulo.aulas.map((aula: any, aulaIndex: number) => (
                            <div key={aulaIndex} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <PlayCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <h4 className="font-medium mb-1">{aula.titulo}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{aula.descricao}</p>
                                  {aula.materiais && aula.materiais.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {aula.materiais.map((material: string, matIndex: number) => (
                                        <Button key={matIndex} variant="outline" size="sm" className="gap-2">
                                          <FileText className="w-3 h-3" />
                                          Material {matIndex + 1}
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Botão Voltar ao Dashboard */}
        <Card className="shadow-large">
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Link to="/home">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConstrucaoGuiada;
