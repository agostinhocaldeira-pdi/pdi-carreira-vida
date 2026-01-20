import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Target, Calendar, Flame, Heart, ArrowRight, Sparkles, Clock, Gift } from "lucide-react";
import logoPdi from "@/assets/logo_pdi.png";
import diagnosticoHero from "@/assets/diagnostico-hero.jpg";

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
  primeiroPasso: string;
  ferramenta: string;
  botaoTexto: string;
  microcopy: string;
  icon: React.ElementType;
  landingRoute: string;
}> = {
  CLAREZA: {
    titulo: "Falta de Clareza Estratégica",
    diagnostico: "Você não está estagnado por falta de ideias, mas por excesso delas. Seu cérebro gasta energia tentando decidir 'qual o melhor caminho' e trava.",
    ciencia: "A neurociência chama isso de Fadiga de Decisão. Quando há opções demais sem critério, o córtex pré-frontal 'desliga' para economizar energia.",
    primeiroPasso: "Para destravar, adote o 'Menos é Mais'. Clareza exige eliminação. Comece dizendo 'NÃO' para tudo que não leva ao seu objetivo. Em seguida, use a metodologia SMART para garantir que sua meta seja realizável e caiba na sua rotina real.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Brain,
    landingRoute: "/lp-clareza",
  },
  DISPERSAO: {
    titulo: "Dispersão de Energia",
    diagnostico: "Você entra em ciclos de iniciar com empolgação, mas perder foco antes de concluir. A atenção se dilui e nada é finalizado de verdade.",
    ciencia: "Isso é uma reação química. Seu cérebro viciou em buscar a dopamina da 'novidade' em vez da satisfação lenta do 'concluído'.",
    primeiroPasso: "Para ter foco, você não precisa de mais tempo, precisa de mais 'NÃOs'. Aplique a Regra da Única Coisa: Pergunte-se 'Qual é a única coisa que, se feita hoje, me aproxima do meu objetivo e torna o resto mais fácil ou desnecessário?'. Ignore o resto até terminar essa tarefa.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Target,
    landingRoute: "/lp-dispersao",
  },
  ROTINA: {
    titulo: "Planejamento vs. Realidade",
    diagnostico: "Existe um abismo entre o que você planeja e o que cabe no seu dia. Você cria listas para uma 'versão ideal' de si mesmo, e não para a real.",
    ciencia: "Isso é conhecido como a Falácia do Planejamento. O cérebro humano é biologicamente programado para ser otimista demais com o tempo futuro.",
    primeiroPasso: "Pare de agendar 100% do seu tempo. Imprevistos são a única certeza. A técnica de ouro é deixar 20% do dia livre como 'Margem de Segurança'. Um planejamento rígido quebra; um flexível funciona.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Calendar,
    landingRoute: "/lp-rotina",
  },
  CONSTANCIA: {
    titulo: "Oscilação de Constância",
    diagnostico: "Você vive ciclos de motivação seguidos de abandono. Você depende da emoção para agir, e quando ela esfria, você para.",
    ciencia: "O erro é tentar usar motivação (emoção passageira) para sustentar um hábito. O cérebro precisa de Recompensa Visual para manter o comportamento.",
    primeiroPasso: "Troque intensidade por frequência. É melhor fazer 15 minutos todos os dias (e marcar um 'OK' no calendário) do que tentar 5 horas uma vez por semana e falhar. Não quebre a corrente. O progresso visual gera a dopamina que falta.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Flame,
    landingRoute: "/lp-constancia",
  },
  INTEGRACAO: {
    titulo: "Desalinhamento de Áreas",
    diagnostico: "Você sente que o sucesso profissional custa a paz pessoal. Esse conflito gera autossabotagem para 'proteger' a área negligenciada.",
    ciencia: "Isso se chama Custo de Troca de Contexto. A tentativa de ser duas pessoas diferentes (o 'profissional' e o 'pessoal') drena sua reserva cognitiva.",
    primeiroPasso: "Pare de tentar 'equilibrar' pratos. O segredo é a Integração. Gerencie sua Energia, não apenas seu tempo. Entenda que o descanso em casa é o combustível para a performance no trabalho. Uma agenda única para uma vida única.",
    ferramenta: "O Sistema Integrado PDI une suas metas de vida e carreira num único painel, para você crescer sem negligenciar quem ama.",
    botaoTexto: "Unificar minha Vida e Carreira",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Heart,
    landingRoute: "/lp-integracao",
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
    if (resultTrava) {
      navigate(resultados[resultTrava].landingRoute);
    } else {
      navigate("/");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 flex flex-col">
      {/* Header */}
      <header className="py-3 sm:py-4 px-4 sm:px-6 flex justify-center">
        <img src={logoPdi} alt="PDI" className="h-8 sm:h-10" />
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">

          {/* Quiz Questions - Start directly with Question 1 */}
          {!showResult && !isLoading && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: currentQuestion === 0 ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* Special header for Question 1 */}
              {currentQuestion === 0 && (
                <div className="text-center mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
                    O que parece estar travando sua evolução neste momento?
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Responda 5 perguntas rápidas para entender qual padrão de comportamento pode estar drenando sua energia hoje.
                  </p>
                </div>
              )}

              {/* Progress - smaller on mobile for first question */}
              <div className={`${currentQuestion === 0 ? 'mb-3 sm:mb-6' : 'mb-6 sm:mb-8'}`}>
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                  <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2" />
              </div>

              {/* Question Card - more compact on mobile */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                  {questions[currentQuestion].headline}
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.trava)}
                      className="w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-xs sm:text-sm md:text-base text-foreground/80 group-hover:text-foreground leading-snug">
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

                  {/* Primeiro Passo */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      O Primeiro Passo
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {resultados[resultTrava].primeiroPasso}
                    </p>
                  </div>

                  {/* A Ferramenta PDI */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      A Ferramenta PDI
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {resultados[resultTrava].ferramenta}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button
                      onClick={handleCTA}
                      size="lg"
                      className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold text-sm sm:text-base py-4 sm:py-6 min-h-[72px] sm:min-h-[56px] rounded-xl shadow-lg whitespace-normal leading-snug"
                    >
                      <span className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-center">
                        <span>👉 {resultados[resultTrava].botaoTexto}</span>
                        <span className="flex items-center gap-1">(Grátis) <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></span>
                      </span>
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      {resultados[resultTrava].microcopy}
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
