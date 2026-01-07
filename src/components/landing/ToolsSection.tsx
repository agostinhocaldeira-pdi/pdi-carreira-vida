import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CircleDot, 
  Grid2X2, 
  Compass, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  LayoutGrid, 
  Brain,
  Wrench,
  BookOpen
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  shortDescription: string;
  fullDescription: string;
  howItWorks: string[];
  benefits: string[];
}

const tools: Tool[] = [
  {
    id: "roda-da-vida",
    name: "Roda da Vida",
    icon: CircleDot,
    shortDescription: "Avalie o equilíbrio entre as diferentes áreas da sua vida",
    fullDescription: "A Roda da Vida é uma ferramenta visual poderosa que permite avaliar seu nível de satisfação em diferentes áreas importantes da vida, como saúde, carreira, finanças, relacionamentos, lazer e espiritualidade.",
    howItWorks: [
      "Você avalia de 0 a 10 sua satisfação atual em cada área da vida",
      "O sistema gera um gráfico visual mostrando o equilíbrio (ou desequilíbrio) entre as áreas",
      "Identifique quais áreas precisam de mais atenção e priorize suas ações"
    ],
    benefits: [
      "Visão clara do seu estado atual de vida",
      "Identificação de áreas negligenciadas",
      "Base para definir objetivos de desenvolvimento",
      "Acompanhamento da evolução ao longo do tempo"
    ]
  },
  {
    id: "analise-swot",
    name: "Análise SWOT",
    icon: Grid2X2,
    shortDescription: "Identifique suas forças, fraquezas, oportunidades e ameaças",
    fullDescription: "A Análise SWOT Pessoal adapta uma ferramenta clássica de estratégia empresarial para o autoconhecimento, ajudando você a mapear fatores internos (forças e fraquezas) e externos (oportunidades e ameaças) que impactam sua vida.",
    howItWorks: [
      "Liste suas Forças: talentos, habilidades e recursos que você possui",
      "Identifique suas Fraquezas: limitações e áreas de melhoria",
      "Mapeie Oportunidades: fatores externos que podem impulsionar seu crescimento",
      "Reconheça Ameaças: obstáculos e riscos externos a considerar"
    ],
    benefits: [
      "Autoconhecimento profundo e estruturado",
      "Clareza sobre vantagens competitivas pessoais",
      "Identificação de riscos para antecipar soluções",
      "Base estratégica para tomada de decisões"
    ]
  },
  {
    id: "metodo-vvd",
    name: "Método VVD",
    icon: Compass,
    shortDescription: "Defina sua Visão de Vida Desejada",
    fullDescription: "O Método VVD (Visão de Vida Desejada) é uma ferramenta de projeção futura que ajuda você a imaginar e descrever com clareza como deseja que sua vida seja em diferentes aspectos, criando um norte claro para suas decisões.",
    howItWorks: [
      "Responda perguntas guiadas sobre como você imagina sua vida ideal",
      "A IA processa suas respostas e sintetiza sua Visão de Vida Desejada",
      "Receba um texto personalizado que captura a essência do seu futuro desejado"
    ],
    benefits: [
      "Clareza sobre o que realmente importa para você",
      "Direcionamento para definição de objetivos",
      "Motivação ao visualizar seu futuro ideal",
      "Alinhamento entre ações diárias e visão de longo prazo"
    ]
  },
  {
    id: "smart",
    name: "Metas SMART",
    icon: CheckCircle2,
    shortDescription: "Crie metas específicas, mensuráveis, alcançáveis, relevantes e temporais",
    fullDescription: "O método SMART transforma desejos vagos em metas concretas e realizáveis. Cada meta é refinada para ser Específica, Mensurável, Alcançável, Relevante e com Prazo definido.",
    howItWorks: [
      "Descreva o que você deseja alcançar",
      "A IA analisa e sugere como tornar sua meta mais SMART",
      "Refine e aprove a meta estruturada",
      "A meta é automaticamente conectada ao seu plano de ação"
    ],
    benefits: [
      "Metas claras e sem ambiguidade",
      "Critérios objetivos para medir progresso",
      "Maior probabilidade de realização",
      "Integração direta com seu PDI"
    ]
  },
  {
    id: "valores",
    name: "Descoberta de Valores",
    icon: Heart,
    shortDescription: "Descubra e priorize seus valores essenciais",
    fullDescription: "Os valores são a bússola interna que guia suas decisões. Esta ferramenta ajuda você a identificar, refletir e priorizar os valores que mais importam na sua vida, criando uma base sólida para escolhas alinhadas.",
    howItWorks: [
      "Explore uma lista abrangente de valores humanos",
      "Selecione aqueles que mais ressoam com você",
      "Priorize e ordene seus valores mais importantes",
      "Reflita sobre como eles se manifestam na sua vida"
    ],
    benefits: [
      "Clareza sobre o que é inegociável para você",
      "Decisões mais alinhadas com quem você é",
      "Redução de conflitos internos",
      "Base para definir objetivos significativos"
    ]
  },
  {
    id: "autoavaliacao-360",
    name: "Autoavaliação 360º",
    icon: Sparkles,
    shortDescription: "Análise profunda através de dilemas e feedback externo",
    fullDescription: "A Autoavaliação 360º combina sua autopercepção com feedback de pessoas próximas, oferecendo uma visão completa sobre suas competências, comportamentos e áreas de desenvolvimento.",
    howItWorks: [
      "Responda a dilemas situacionais que revelam padrões de comportamento",
      "Opcionalmente, solicite feedback de pessoas de confiança",
      "A IA analisa as respostas e gera insights personalizados",
      "Receba um relatório com pontos fortes e áreas de desenvolvimento"
    ],
    benefits: [
      "Visão mais completa sobre si mesmo",
      "Descoberta de pontos cegos",
      "Feedback estruturado de múltiplas perspectivas",
      "Direcionamento preciso para desenvolvimento"
    ]
  },
  {
    id: "eisenhower",
    name: "Matriz de Eisenhower",
    icon: LayoutGrid,
    shortDescription: "Organize tarefas por urgência e importância",
    fullDescription: "A Matriz de Eisenhower é uma ferramenta de produtividade que classifica suas tarefas em quatro quadrantes baseados em urgência e importância, ajudando você a focar no que realmente importa.",
    howItWorks: [
      "Liste suas tarefas e compromissos",
      "Classifique cada item como urgente/não urgente e importante/não importante",
      "O sistema organiza visualmente nos quatro quadrantes",
      "Priorize: faça o importante, agende, delegue ou elimine"
    ],
    benefits: [
      "Foco no que realmente importa",
      "Redução de estresse por sobrecarga",
      "Clareza sobre o que delegar ou eliminar",
      "Melhor gestão do tempo e energia"
    ]
  },
  {
    id: "crencas",
    name: "Transformação de Crenças",
    icon: Brain,
    shortDescription: "Identifique e transforme crenças limitantes",
    fullDescription: "Crenças limitantes são pensamentos internalizados que nos impedem de alcançar nosso potencial. Esta ferramenta ajuda você a identificar essas crenças, questionar sua validade e substituí-las por crenças fortalecedoras.",
    howItWorks: [
      "Identifique crenças que limitam seu crescimento",
      "Responda perguntas que desafiam a validade dessas crenças",
      "Construa novas crenças baseadas em evidências e possibilidades",
      "Crie afirmações para reforçar a nova mentalidade"
    ],
    benefits: [
      "Libertação de padrões mentais limitantes",
      "Maior autoconfiança e autoestima",
      "Abertura para novas possibilidades",
      "Mindset de crescimento e desenvolvimento"
    ]
  }
];

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <section className="py-16 sm:py-24 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Wrench className="w-4 h-4 mr-2 inline" />
            Ferramentas Exclusivas
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Conheça as Ferramentas
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas validadas de autoconhecimento e produtividade que fazem parte do sistema PDI
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant="outline"
                className="h-auto py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center gap-2 sm:gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group min-w-0"
                onClick={() => setSelectedTool(tool)}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <span className="text-[11px] sm:text-sm font-medium text-center leading-tight break-words hyphens-auto w-full">
                  {tool.name}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Tool Detail Modal */}
        <Dialog open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                {selectedTool && (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <selectedTool.icon className="w-5 h-5 text-primary" />
                    </div>
                    {selectedTool.name}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedTool && (
                <div className="space-y-6">
                  {/* Short Description */}
                  <p className="text-base text-muted-foreground italic border-l-4 border-primary/30 pl-4">
                    {selectedTool.shortDescription}
                  </p>

                  {/* Full Description */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      O que é
                    </h4>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {selectedTool.fullDescription}
                    </p>
                  </div>

                  {/* How it works */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Como funciona
                    </h4>
                    <ul className="space-y-2">
                      {selectedTool.howItWorks.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground text-sm sm:text-base">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Como contribui para o aluno
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {selectedTool.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ToolsSection;
