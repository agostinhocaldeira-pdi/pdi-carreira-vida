import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VillainInterruption } from "./VillainInterruption";
import { PasswordGate } from "./PasswordGate";

interface PassoDoisProps {
  onAdvance: () => void;
}

type Stage = 
  | "cena1" 
  | "feedback1" 
  | "cena2" 
  | "feedback2" 
  | "villain" 
  | "recovery" 
  | "cena3" 
  | "feedback3" 
  | "cena4" 
  | "feedback4" 
  | "encerramento" 
  | "porta" 
  | "senhaInput";

const scaleOptions = ["1", "2", "3", "4", "5"];

export const PassoDois = ({ onAdvance }: PassoDoisProps) => {
  const [stage, setStage] = useState<Stage>("cena1");
  const [showVillain, setShowVillain] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string[]>([]);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  const feedbacks: Record<string, string[]> = {
    feedback1: [
      "Isso não define quem você é.",
      "Define para onde seu esforço está indo.",
    ],
    feedback2: [
      "Clareza que não desce para a rotina",
      "vira frustração elegante.",
    ],
    recovery: [
      "isso foi uma tentativa de interrupção",
      "quando a clareza aparece, esse modo de viver reage",
      "não é preguiça",
      "é condicionamento",
      "já passou, podemos continuar",
    ],
    feedback3: [
      "Urgência não é critério.",
      "Aqui o Piloto Automático gosta de mandar.",
    ],
    feedback4: [
      "Não é falta de vontade.",
      "É falta de arquitetura.",
    ],
    encerramento: [
      "Esse padrão explica o cansaço.",
      "Agora faz sentido olhar para objetivos.",
    ],
    porta: [
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

  const handleAnswer = (answer: string) => {
    switch (stage) {
      case "cena1":
        startFeedback("feedback1", "cena2");
        break;
      case "cena2":
        setShowVillain(true);
        setTimeout(() => {
          setShowVillain(false);
          startFeedback("recovery", "cena3");
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
      case "recovery":
        setStage("cena3");
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

  if (showVillain) {
    return (
      <VillainInterruption
        text="fecha isso&#10;vai viver"
        isVisible={true}
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
        };
      case "cena3":
        return {
          question: "Com que frequência a urgência decide seu dia?",
          options: ["Sempre", "Quase sempre", "Às vezes", "Raramente", "Nunca"],
        };
      case "cena4":
        return {
          question: "Como você lida com projetos que demoram meses?",
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
              className="w-full max-w-sm space-y-8"
            >
              <p className="text-white/90 text-xl text-center leading-relaxed whitespace-pre-line">
                {questionData.question}
              </p>

              <div className="space-y-3">
                {questionData.isScale ? (
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
                  className="text-white/70 text-lg text-center leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}

              {showContinue && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleContinue}
                  className="w-full mt-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
                >
                  Continuar
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
