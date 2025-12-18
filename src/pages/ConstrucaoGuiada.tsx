import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import VvdLessonContent from "@/components/construcao-guiada/VvdLessonContent";
import ValoresLessonContent from "@/components/construcao-guiada/ValoresLessonContent";
import RodaDaVidaLessonContent from "@/components/construcao-guiada/RodaDaVidaLessonContent";
import CrencasLessonContent from "@/components/construcao-guiada/CrencasLessonContent";
import AutoavaliacaoLessonContent from "@/components/construcao-guiada/AutoavaliacaoLessonContent";
import SwotLessonContent from "@/components/construcao-guiada/SwotLessonContent";
import SmartLessonContent from "@/components/construcao-guiada/SmartLessonContent";
import EisenhowerLessonContent from "@/components/construcao-guiada/EisenhowerLessonContent";

const ConstrucaoGuiada = () => {
  useRoleProtection({ allowedRoles: ["user", "gestor"] });
  
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
      aulas: [
        { id: "aula-2-1", titulo: "Método VVD", component: VvdLessonContent },
        { id: "aula-2-2", titulo: "Valores", component: ValoresLessonContent },
        { id: "aula-2-3", titulo: "Roda da Vida", component: RodaDaVidaLessonContent },
        { id: "aula-2-4", titulo: "Transformação de Crenças", component: CrencasLessonContent },
      ]
    },
    {
      id: "modulo-3",
      titulo: "Para onde vou",
      descricao: "Defina seus objetivos e visualize o futuro que você deseja construir",
      aulas: [
        { id: "aula-3-1", titulo: "Autoavaliação + 360º", component: AutoavaliacaoLessonContent },
        { id: "aula-3-2", titulo: "Análise SWOT", component: SwotLessonContent },
      ]
    },
    {
      id: "modulo-4",
      titulo: "Como vou chegar lá",
      descricao: "Planeje suas metas, ações e estratégias para alcançar seus objetivos",
      aulas: [
        { id: "aula-4-1", titulo: "Metas SMART", component: SmartLessonContent },
        { id: "aula-4-2", titulo: "Matriz de Eisenhower", component: EisenhowerLessonContent },
      ]
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
                          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">
                            As aulas deste módulo serão adicionadas em breve
                          </p>
                        </div>
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          {modulo.aulas.map((aula, aulaIndex) => (
                            <AccordionItem key={aula.id} value={aula.id}>
                              <AccordionTrigger className="hover:no-underline py-3">
                                <div className="flex items-center gap-3 text-left">
                                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-medium text-xs">{aulaIndex + 1}</span>
                                  </div>
                                  <span className="font-medium">{aula.titulo}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pt-2">
                                  <aula.component />
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-large">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/home">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              <Link to="/tutorial">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <GraduationCap className="w-4 h-4" />
                  Ver Tutorial Completo
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
