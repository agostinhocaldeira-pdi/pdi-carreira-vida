import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { VillainInterruption } from "./VillainInterruption";
import { PasswordGate } from "./PasswordGate";
import { ChatButton } from "./ChatButton";

interface PassoDoisProps {
  onAdvance: () => void;
  onPrepareNextStep?: () => void;
}

type Stage = 
  | "cena1" 
  | "feedback1" 
  | "cena2" 
  | "feedback2" 
  | "villain" 
  | "reflexaoVilao"
  | "cena3" 
  | "feedback3" 
  | "cena4" 
  | "feedback4" 
  | "encerramento" 
  | "porta" 
  | "senhaInput";

const scaleOptions = ["1", "2", "3", "4", "5"];

const reflexaoVilaoScreens = [
  "Ele insiste em tentar interromper",
  'Repare uma coisa: todos os dias na sua vida algo tenta te interromper quando a clareza aparece. É assim que o <strong>"modo de viver"</strong> age.',
  'Você não faz o que precisa, não é por preguiça<br/><br/>é o condicionamento desse <strong>"modo de viver"</strong>.',
  "Bom... vamos tentar continuar sem novas interferências.",
];

export const PassoDois = ({ onAdvance, onPrepareNextStep }: PassoDoisProps) => {
  const [stage, setStage] = useState<Stage>("cena1");
  const [showVillain, setShowVillain] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string[]>([]);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [reflexaoScreen, setReflexaoScreen] = useState(0);

  const feedbacks: Record<string, string[]> = {
    feedback1: [
      "Isso não define quem você é.",
      "Define para onde seu esforço está indo.",
    ],
    feedback2: [
      "Clareza que não desce para a rotina",
      "vira frustração elegante.",
    ],
    feedback3: [
      "Urgência não é critério.",
      'Aqui o <strong>"modo de viver"</strong> gosta de mandar em você. Ele só quer que você faça cada vez mais, sem pensar.',
    ],
    feedback4: [
      'O <strong>"modo de viver"</strong> quer tudo para agora.',
      "Quando você está fazendo algo que o resultado vai demorar pra chegar, ele tenta te impedir.",
    ],
    encerramento: [
      'Esse <strong>"modo de viver"</strong> cansa.',
      "Mas existe um jeito de superar isso.",
      "Agora, faz sentido falarmos de objetivos.",
    ],
    porta: [
      "Isso é sinal que você quer mudanças...",
      "Vou te ajudar.",
      "Mas para isso, preciso te levar para nosso tiktok secreto.",
      "Você vai precisar de uma nova senha:",
      "TK4h25",
    ],
  };

  useEffect(() => {
    if (currentFeedback.length > 0 && feedbackIndex < currentFeedback.length) {
      const timer = setTimeout(() => {
        setFeedbackIndex((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentFeedback.length > 0 && feedbackIndex >= currentFeedback.length) {
      const timer = setTimeout(() => {
        setShowContinue(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [feedbackIndex, currentFeedback.length]);

  const startFeedback = (feedbackKey: string, nextStage: Stage) => {
    setCurrentFeedback(feedbacks[feedbackKey]);
    setFeedbackIndex(0);
    setShowContinue(false);
    setStage(feedbackKey as Stage);
  };

  // Auto-advance for reflexaoVilao screens
  useEffect(() => {
    if (stage !== "reflexaoVilao") return;
    
    // Don't auto-advance on the last screen (index 3)
    if (reflexaoScreen >= 3) return;
    
    const timer = setTimeout(() => {
      setReflexaoScreen((prev) => prev + 1);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [stage, reflexaoScreen]);

  const handleAnswer = (answer: string) => {
    switch (stage) {
      case "cena1":
        startFeedback("feedback1", "cena2");
        break;
      case "cena2":
        setShowVillain(true);
        setTimeout(() => {
          setShowVillain(false);
          setReflexaoScreen(0);
          setStage("reflexaoVilao");
        }, 2500);
        break;
      case "cena3":
        startFeedback("feedback3", "cena4");
        break;
      case "cena4":
        startFeedback("feedback4", "encerramento");
        break;
    }
  };

  const handleContinue = () => {
    setCurrentFeedback([]);
    setFeedbackIndex(0);
    setShowContinue(false);

    switch (stage) {
      case "feedback1":
        setStage("cena2");
        break;
      case "feedback3":
        setStage("cena4");
        break;
      case "feedback4":
        startFeedback("encerramento", "porta");
        break;
      case "encerramento":
        startFeedback("porta", "senhaInput");
        break;
      case "porta":
        setStage("senhaInput");
        break;
    }
  };

  const handleReflexaoContinue = () => {
    setReflexaoScreen(0);
    setStage("cena3");
  };

  if (showVillain) {
    return (
      <VillainInterruption
        text="fecha isso&#10;vai viver"
        isVisible={true}
      />
    );
  }

  if (stage === "reflexaoVilao") {
    return (
      <ReflexaoVilaoScreen
        screens={reflexaoVilaoScreens}
        currentScreen={reflexaoScreen}
        onContinue={handleReflexaoContinue}
      />
    );
  }

  if (stage === "senhaInput") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <PasswordGate
          password="TK4h25"
          onSuccess={onAdvance}
          buttonText="TikTok secreto"
          onBeforeSuccess={onPrepareNextStep}
          beforeSuccessDelay={500}
        />
      </div>
    );
  }

  const renderQuestion = () => {
    switch (stage) {
      case "cena1":
        return {
          question: "A semana acabou.\nQual sensação fica no corpo?",
          options: ["Leve", "Pesado", "Vazio", "Confuso", "Normal"],
        };
      case "cena2":
        return {
          question: "O quão claro está seu futuro hoje?",
          options: scaleOptions,
          isScale: true,
          scaleLabels: [
            "Não sei para onde estou indo",
            "Imagino que vou chegar em algum lugar melhor",
            "Vai continuar do mesmo jeito",
            "Vou conquistar meu objetivo",
            "Vou viver uma vida do jeito que eu realmente desejo viver",
          ],
        };
      case "cena3":
        return {
          question: "Com que frequência a urgência decide seu dia?",
          options: ["Sempre", "Quase sempre", "Às vezes", "Raramente", "Nunca"],
        };
      case "cena4":
        return {
          question: "Como você lida com atividades ou projetos que demoram meses?",
          options: ["Abandono", "Me frustro", "Esqueço", "Persisto com dor", "Construo com calma"],
        };
      default:
        return null;
    }
  };

  const questionData = renderQuestion();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {questionData ? (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm space-y-6"
            >
              {/* Title with lock - only on first question */}
              {stage === "cena1" && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-white" />
                  <p className="text-white text-sm text-center">
                    Responda essas perguntas para descobrir como o <strong>"modo de viver"</strong> age na sua vida
                  </p>
                </div>
              )}

              {/* Question card with border */}
              <div className={stage === "cena1" ? "border border-white/20 rounded-2xl p-6 space-y-6" : "space-y-8"}>
                <p className="text-white/90 text-xl text-center leading-relaxed whitespace-pre-line">
                  {questionData.question}
                </p>

                <div className="space-y-3">
                {questionData.isScale ? (
                  <div className="space-y-4">
                    <div className="flex justify-between gap-2">
                      {questionData.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-lg font-medium transition-all active:scale-95"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {questionData.scaleLabels && (
                      <div className="space-y-1.5 pt-2">
                        {questionData.scaleLabels.map((label, index) => (
                          <p key={index} className="text-white/40 text-xs text-center">
                            <span className="text-white/60 font-medium">{index + 1}.</span> {label}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  ) : (
                    questionData.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 text-base transition-all active:scale-[0.98]"
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={stage + "-feedback"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-sm space-y-4"
            >
              {currentFeedback.slice(0, feedbackIndex).map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/70 text-lg text-center leading-relaxed [&_strong]:text-white [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}

              {showContinue && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center mt-8"
                >
                  {stage === "encerramento" && (
                    <p className="text-white/70 text-sm mb-3">Podemos seguir?</p>
                  )}
                  <motion.button
                    onClick={handleContinue}
                    className="w-full py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
                  >
                    {stage === "encerramento" ? "SIM" : "Continuar"}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reflexão Vilão - Full screen slideshow
const ReflexaoVilaoScreen = ({ 
  screens, 
  currentScreen, 
  onContinue 
}: { 
  screens: string[]; 
  currentScreen: number; 
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <p 
            className="text-white/80 text-xl leading-relaxed [&_strong]:text-white [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: screens[currentScreen] }}
          />
          
          {currentScreen === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <motion.button
                onClick={onContinue}
                className="w-full py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
              >
                Continuar
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentScreen ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
