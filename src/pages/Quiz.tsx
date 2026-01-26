import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Target, Calendar, Flame, Heart, ArrowRight, Sparkles } from "lucide-react";
import logoPdi from "@/assets/logo_pdi.png";

// New quiz structure - will receive more questions
type Trava = "EXAUSTAO" | "INERCIA" | "DISPERSAO" | "LENTIDAO";

interface Question {
  headline: string;
  options: {
    label: string;
    text: string;
    trava: Trava;
  }[];
}

const questions: Question[] = [
  {
    headline: "Ao final de uma semana típica de trabalho, qual é a sensação predominante?",
    options: [
      { 
        label: "Exaustão Improdutiva", 
        text: "Trabalhei muitas horas, apaguei incêndios, mas sinto que não construí nada de valor real.", 
        trava: "EXAUSTAO" 
      },
      { 
        label: "Frustração por Inércia", 
        text: "Tinha planos claros na segunda-feira, mas cheguei na sexta sem ter começado o principal.", 
        trava: "INERCIA" 
      },
      { 
        label: "Ansiedade de Dispersão", 
        text: "Comecei três projetos diferentes, me empolguei, mas não terminei nenhum.", 
        trava: "DISPERSAO" 
      },
      { 
        label: "Progresso Lento", 
        text: "Sinto que estou avançando, mas numa velocidade muito menor do que minha capacidade permitiria.", 
        trava: "LENTIDAO" 
      },
    ],
  },
  // Placeholder for Q2-Q5 - will be added when user provides content
];

// Placeholder for results - will be updated when user provides result content
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
  EXAUSTAO: {
    titulo: "Exaustão Improdutiva",
    diagnostico: "Você trabalha muito, mas sente que não constrói nada de valor real. O esforço se perde em urgências.",
    ciencia: "Placeholder - aguardando conteúdo.",
    primeiroPasso: "Placeholder - aguardando conteúdo.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Flame,
    landingRoute: "/lp-clareza",
  },
  INERCIA: {
    titulo: "Frustração por Inércia",
    diagnostico: "Você tem planos claros, mas não consegue começar o que realmente importa.",
    ciencia: "Placeholder - aguardando conteúdo.",
    primeiroPasso: "Placeholder - aguardando conteúdo.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Calendar,
    landingRoute: "/lp-rotina",
  },
  DISPERSAO: {
    titulo: "Ansiedade de Dispersão",
    diagnostico: "Você começa muitos projetos com empolgação, mas não termina nenhum.",
    ciencia: "Placeholder - aguardando conteúdo.",
    primeiroPasso: "Placeholder - aguardando conteúdo.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Target,
    landingRoute: "/lp-dispersao",
  },
  LENTIDAO: {
    titulo: "Progresso Lento",
    diagnostico: "Você está avançando, mas numa velocidade muito menor do que sua capacidade permitiria.",
    ciencia: "Placeholder - aguardando conteúdo.",
    primeiroPasso: "Placeholder - aguardando conteúdo.",
    ferramenta: "Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Brain,
    landingRoute: "/lp-constancia",
  },
};

// Ordem de desempate
const ordemDesempate: Trava[] = ["EXAUSTAO", "INERCIA", "DISPERSAO", "LENTIDAO"];

const Diagnostico = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Trava, number>>({
    EXAUSTAO: 0,
    INERCIA: 0,
    DISPERSAO: 0,
    LENTIDAO: 0,
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
    // Teste A/B: 50% vai para landing page do tema, 50% vai para signup
    const isVariantB = Math.random() < 0.5;
    
    if (resultTrava) {
      if (isVariantB) {
        navigate("/signup");
      } else {
        navigate(resultados[resultTrava].landingRoute);
      }
    } else {
      navigate("/signup");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <header className="py-3 sm:py-4 px-4 sm:px-6 flex justify-center relative z-10">
        <img src={logoPdi} alt="PDI" className="h-8 sm:h-10" />
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8 relative z-10">
        <AnimatePresence mode="wait">

          {/* Quiz Questions - Start directly with Question 1 */}
          {!showResult && !isLoading && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: currentQuestion === 0 ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl"
            >
              {/* Special header for Question 1 */}
              {currentQuestion === 0 && (
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#d4a853] mb-3 sm:mb-4 leading-tight">
                    Esforço sem direção vira cansaço.
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90 mb-2 leading-relaxed">
                    Por que seu esforço não está te levando aonde você quer chegar?
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    Responda 5 perguntas rápidas e veja onde seu esforço está se perdendo.
                  </p>
                </div>
              )}

              {/* Progress */}
              <div className={`${currentQuestion === 0 ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8'}`}>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                  <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2 bg-gray-700" />
              </div>

              {/* Question Card */}
              <div className="bg-[#252525] rounded-xl sm:rounded-2xl border border-[#d4a853]/20 p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  {questions[currentQuestion].headline}
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.trava)}
                      className="w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-600 hover:border-[#d4a853] hover:bg-[#d4a853]/10 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 group-hover:bg-[#d4a853] group-hover:text-[#1a1a1a] text-gray-300 flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="flex-1">
                          <span className="block text-sm sm:text-base font-semibold text-[#d4a853] mb-1">
                            {option.label}:
                          </span>
                          <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white leading-snug">
                            {option.text}
                          </span>
                        </div>
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
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#d4a853] border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#d4a853] animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Processando Análise...
              </h3>
              <p className="text-gray-400">
                Identificando onde seu esforço está se perdendo
              </p>
            </motion.div>
          )}

          {showResult && resultTrava && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl"
            >
              <div className="bg-[#252525] rounded-2xl border border-[#d4a853]/20 overflow-hidden">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-[#d4a853] to-[#b8912f] p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    {(() => {
                      const IconComponent = resultados[resultTrava].icon;
                      return <IconComponent className="w-8 h-8 text-[#1a1a1a]" />;
                    })()}
                  </div>
                  <p className="text-[#1a1a1a]/80 text-sm mb-1">
                    Onde seu esforço está se perdendo:
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
                    {resultados[resultTrava].titulo}
                  </h2>
                </div>

                {/* Result Content */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Diagnóstico */}
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></span>
                      Diagnóstico
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].diagnostico}
                    </p>
                  </div>

                  {/* A Ciência */}
                  <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-700">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#d4a853]" />
                      A Ciência
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].ciencia}
                    </p>
                  </div>

                  {/* Primeiro Passo */}
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      O Primeiro Passo
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].primeiroPasso}
                    </p>
                  </div>

                  {/* Conheça o PDI */}
                  <div className="bg-[#d4a853]/10 rounded-xl p-4 border border-[#d4a853]/20">
                    <h3 className="font-semibold text-[#d4a853] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></span>
                      Conheça o Sistema de Organização, Gestão e Planejamento de Vida - PDI.
                    </h3>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button
                      onClick={handleCTA}
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#d4a853] to-[#b8912f] hover:from-[#e5b964] hover:to-[#c9a240] text-[#1a1a1a] font-bold text-sm sm:text-base py-4 sm:py-6 min-h-[72px] sm:min-h-[56px] rounded-xl shadow-lg shadow-[#d4a853]/30 whitespace-normal leading-snug"
                    >
                      <span className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-center">
                        <span>👉 {resultados[resultTrava].botaoTexto}</span>
                        <span className="flex items-center gap-1">(Grátis) <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></span>
                      </span>
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-3">
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
