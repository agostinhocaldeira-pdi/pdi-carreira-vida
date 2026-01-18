import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Target, Calendar, Flame, Heart, ArrowRight, Sparkles } from "lucide-react";
import logoPdi from "@/assets/logo_pdi.png";

type Trava = "CLAREZA" | "DISPERSAO" | "ROTINA" | "CONSTANCIA" | "INTEGRACAO";

interface Question {
  headline: string;
  options: {
    text: string;
    trava: Trava;
  }[];
}

const questions: Question[] = [
  {
    headline: "Quando você pensa no seu futuro hoje, qual a sensação predominante?",
    options: [
      { text: "Tenho muitas ideias e sonhos, mas tudo parece uma nuvem confusa.", trava: "CLAREZA" },
      { text: "Eu começo muitas coisas, mas me perco no meio do caminho e perco o foco.", trava: "DISPERSAO" },
      { text: "Eu até sei o que quero, mas minha rotina diária me engole e não sobra tempo.", trava: "ROTINA" },
      { text: "Eu planejo, começo empolgado, mas depois de 2 semanas eu paro.", trava: "CONSTANCIA" },
      { text: "Sinto que tenho que escolher: ou cresço na carreira ou tenho vida pessoal.", trava: "INTEGRACAO" },
    ],
  },
  {
    headline: "Como você costuma definir seus objetivos?",
    options: [
      { text: "Vagas. Eu quero \"melhorar de vida\", mas não tenho números ou prazos.", trava: "CLAREZA" },
      { text: "Exageradas. Eu defino 10 metas ao mesmo tempo e acabo não fazendo nenhuma.", trava: "DISPERSAO" },
      { text: "Desconectadas. Minha meta está no papel, mas não cabe na minha agenda real.", trava: "ROTINA" },
      { text: "Frustrantes. Eu evito definir metas porque tenho medo de falhar de novo.", trava: "CONSTANCIA" },
      { text: "Conflitantes. Se foco no trabalho a família reclama, e vice-versa.", trava: "INTEGRACAO" },
    ],
  },
  {
    headline: "Qual é o seu maior inimigo na segunda-feira de manhã?",
    options: [
      { text: "A dúvida: \"Por onde eu começo?\" (Paralisia por análise).", trava: "CLAREZA" },
      { text: "A distração: Começo uma tarefa, chega um e-mail e perco o dia.", trava: "DISPERSAO" },
      { text: "A urgência: Passo o dia \"apagando incêndios\" e não faço o importante.", trava: "ROTINA" },
      { text: "A inércia: Aquela sensação pesada de desânimo antes de começar.", trava: "CONSTANCIA" },
      { text: "A culpa: Saio de casa sentindo que estou devendo atenção a alguém.", trava: "INTEGRACAO" },
    ],
  },
  {
    headline: "O que acontece quando você tenta usar uma agenda ou planner?",
    options: [
      { text: "Não consigo preencher porque não sei o que é prioridade.", trava: "CLAREZA" },
      { text: "Preencho tudo, mas a lista fica gigante e eu não cumpro.", trava: "DISPERSAO" },
      { text: "Funciona por 2 dias, depois a correria atropela tudo.", trava: "ROTINA" },
      { text: "Sinto que vira uma prisão e me rebelo contra ela (abandono).", trava: "CONSTANCIA" },
      { text: "Minha vida pessoal sempre \"atrapalha\" o planejamento profissional.", trava: "INTEGRACAO" },
    ],
  },
  {
    headline: "Se você pudesse ganhar um \"superpoder\" hoje, qual escolheria?",
    options: [
      { text: "Um mapa exato dizendo ONDE eu quero estar em 1 ano.", trava: "CLAREZA" },
      { text: "Um filtro que escondesse tudo o que não é essencial agora.", trava: "DISPERSAO" },
      { text: "Um relógio que fizesse tudo caber nas 24 horas do meu dia.", trava: "ROTINA" },
      { text: "Uma bateria inesgotável para não desanimar no meio do projeto.", trava: "CONSTANCIA" },
      { text: "Um botão de \"equilíbrio\" para ter sucesso e paz ao mesmo tempo.", trava: "INTEGRACAO" },
    ],
  },
];

const resultados: Record<Trava, {
  titulo: string;
  diagnostico: string;
  ciencia: string;
  solucao: string;
  botaoTexto: string;
  icon: React.ElementType;
}> = {
  CLAREZA: {
    titulo: "Falta de Clareza Estratégica",
    diagnostico: "Você não está estagnado por falta de capacidade, mas por excesso de ruído mental. Seu cérebro gasta toda a energia tentando decidir \"qual o melhor caminho\" e não sobra energia para caminhar.",
    ciencia: "A neurociência chama isso de Fadiga de Decisão. Quando há opções demais sem critério, o córtex pré-frontal \"desliga\" para economizar energia biológica.",
    solucao: "Você precisa do Módulo de Metas com IA. Nossa Inteligência Artificial vai entrevistar você e transformar essa nuvem de ideias em um plano claro e executável.",
    botaoTexto: "Organizar minha clareza agora",
    icon: Brain,
  },
  DISPERSAO: {
    titulo: "Dispersão de Energia",
    diagnostico: "Você entra em ciclos de iniciar com empolgação, mas perder foco antes de concluir. Você tenta abraçar o mundo, a atenção se dilui e nada é finalizado de verdade.",
    ciencia: "Isso é uma reação química. Seu cérebro viciou em buscar a dopamina da \"novidade\" em vez da satisfação lenta do \"concluído\".",
    solucao: "Você precisa da Agenda Inteligente de Priorização. O sistema vai esconder o ruído e te mostrar apenas a ÚNICA coisa que você precisa fazer hoje para avançar.",
    botaoTexto: "Definir o que realmente importa hoje",
    icon: Target,
  },
  ROTINA: {
    titulo: "Planejamento vs. Realidade",
    diagnostico: "Existe um abismo entre o que você planeja e o que cabe no seu dia. Você cria listas para uma \"versão ideal\" de si mesmo, não para sua vida real.",
    ciencia: "Isso é conhecido como a Falácia do Planejamento. O cérebro humano é biologicamente programado para ser otimista demais com o tempo futuro.",
    solucao: "Você precisa do Planejador Semanal Realista. O PDI pega seus sonhos grandes e os quebra em tarefas curtas que encaixam nos intervalos do seu dia real.",
    botaoTexto: "Criar um plano que caiba na minha rotina",
    icon: Calendar,
  },
  CONSTANCIA: {
    titulo: "Oscilação de Constância",
    diagnostico: "Você vive ciclos de motivação seguidos de abandono. Você depende da emoção para agir, e quando ela esfria, você para.",
    ciencia: "O termo técnico é Fricção Límbica. O erro é tentar usar motivação (emoção passageira) para sustentar um hábito (que exige estrutura racional).",
    solucao: "Você precisa do Painel de Evolução Visual. O ser humano precisa ver progresso: os gráficos do PDI geram a dopamina necessária para você não desistir.",
    botaoTexto: "Começar a avançar sem depender de motivação",
    icon: Flame,
  },
  INTEGRACAO: {
    titulo: "Desalinhamento de Áreas",
    diagnostico: "Você sente que o sucesso profissional custa a paz pessoal. Esse conflito gera uma autossabotagem inconsciente para \"proteger\" a área negligenciada.",
    ciencia: "Isso se chama Custo de Troca de Contexto. A tentativa de ser duas pessoas diferentes consome sua reserva cognitiva, drenando sua energia mental.",
    solucao: "Você precisa do Sistema Integrado PDI. Pare de usar um app para trabalho e outro para a vida. Centralize tudo num lugar só e cresça sem sacrificar quem você ama.",
    botaoTexto: "Integrar vida e carreira com clareza",
    icon: Heart,
  },
};

// Ordem de desempate: ROTINA > CONSTANCIA > CLAREZA > DISPERSAO > INTEGRACAO
const ordemDesempate: Trava[] = ["ROTINA", "CONSTANCIA", "CLAREZA", "DISPERSAO", "INTEGRACAO"];

const Diagnostico = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Trava, number>>({
    CLAREZA: 0,
    DISPERSAO: 0,
    ROTINA: 0,
    CONSTANCIA: 0,
    INTEGRACAO: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultTrava, setResultTrava] = useState<Trava | null>(null);

  const handleAnswer = (trava: Trava) => {
    const newScores = { ...scores, [trava]: scores[trava] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calcular resultado
      setIsLoading(true);
      setTimeout(() => {
        const winnerTrava = calculateWinner(newScores);
        setResultTrava(winnerTrava);
        setIsLoading(false);
        setShowResult(true);
      }, 2500);
    }
  };

  const calculateWinner = (finalScores: Record<Trava, number>): Trava => {
    const maxScore = Math.max(...Object.values(finalScores));
    const winners = (Object.keys(finalScores) as Trava[]).filter(
      (trava) => finalScores[trava] === maxScore
    );

    if (winners.length === 1) {
      return winners[0];
    }

    // Desempate pela ordem de prioridade
    for (const trava of ordemDesempate) {
      if (winners.includes(trava)) {
        return trava;
      }
    }

    return winners[0];
  };

  const handleCTA = () => {
    navigate("/");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex justify-center">
        <img src={logoPdi} alt="PDI" className="h-10" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {!showResult && !isLoading && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 leading-tight">
                  {questions[currentQuestion].headline}
                </h2>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.trava)}
                      className="w-full text-left p-4 rounded-xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center font-semibold text-sm transition-colors">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm md:text-base text-foreground/80 group-hover:text-foreground">
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Processando Análise...
              </h3>
              <p className="text-muted-foreground">
                Identificando sua principal trava de evolução
              </p>
            </motion.div>
          )}

          {showResult && resultTrava && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    {(() => {
                      const IconComponent = resultados[resultTrava].icon;
                      return <IconComponent className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <p className="text-primary-foreground/80 text-sm mb-1">
                    Sua Trava Principal é:
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {resultados[resultTrava].titulo}
                  </h2>
                </div>

                {/* Result Content */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Diagnóstico */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Diagnóstico
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {resultados[resultTrava].diagnostico}
                    </p>
                  </div>

                  {/* A Ciência */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      A Ciência
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {resultados[resultTrava].ciencia}
                    </p>
                  </div>

                  {/* A Solução */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      A Solução PDI
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {resultados[resultTrava].solucao}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button
                      onClick={handleCTA}
                      size="lg"
                      className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold text-base py-6 rounded-xl shadow-lg"
                    >
                      👉 {resultados[resultTrava].botaoTexto} (Grátis)
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Acesso imediato • Sem cartão de crédito • Cancele quando quiser
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Diagnostico;
