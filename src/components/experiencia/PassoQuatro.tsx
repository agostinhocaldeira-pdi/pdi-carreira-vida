import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical } from "lucide-react";

interface PassoQuatroProps {
  onAdvance: () => void;
}

const objectives = [
  "Ganhar mais dinheiro",
  "Emagrecer",
  "Mudar de emprego",
  "Ter mais tempo livre",
  "Ser mais produtivo",
];

const actions = [
  { id: 1, text: "Responder e-mails urgentes", isDistraction: true },
  { id: 2, text: "Planejar próxima semana", isDistraction: false },
  { id: 3, text: "Resolver pendência do banco", isDistraction: true },
  { id: 4, text: "Ler sobre investimentos", isDistraction: false },
  { id: 5, text: "Organizar arquivos do computador", isDistraction: true },
  { id: 6, text: "Definir próximo passo claro", isDistraction: false },
];

const villainMessages = [
  "Você está com fome",
  "tem mensagem no whatsapp",
  "vem ver esse reels",
  "café?",
];

export const PassoQuatro = ({ onAdvance }: PassoQuatroProps) => {
  const [stage, setStage] = useState<"objective" | "actions" | "revelation" | "ancora">("objective");
  const [selectedObjective, setSelectedObjective] = useState("");
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [activeVillain, setActiveVillain] = useState<string | null>(null);
  const [villainQueue, setVillainQueue] = useState<string[]>([...villainMessages]);

  // Show villain bubble that blocks interaction
  const showNextVillain = () => {
    if (villainQueue.length > 0) {
      const [next, ...rest] = villainQueue;
      setActiveVillain(next);
      setVillainQueue(rest);
      
      // Auto-dismiss after 1.2 seconds
      setTimeout(() => {
        setActiveVillain(null);
      }, 1200);
    }
  };

  const handleSelectObjective = (obj: string) => {
    setSelectedObjective(obj);
    setStage("actions");
  };

  const handleToggleAction = (id: number) => {
    if (activeVillain) return; // Block interaction while villain is showing
    
    setSelectedActions((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((a) => a !== id)
        : [...prev, id];

      // Trigger villain after each selection (if queue not empty)
      if (newSelection.length > prev.length && villainQueue.length > 0) {
        setTimeout(() => {
          showNextVillain();
        }, 800);
      }

      return newSelection;
    });
  };

  const handleContinueFromActions = () => {
    setStage("revelation");
  };

  const revelationTexts = [
    "Meta demais cria ilusão.",
    "Ação sem intenção cria cansaço.",
  ];

  const ancoraTexts = [
    "Você não precisa de mais força.",
    "Precisa de um sistema que sustente suas decisões.",
  ];

  const transitionText = "Agora falta só um nível.\nO mais ignorado de todos.";

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AnimatePresence mode="wait">
        {stage === "objective" && (
          <motion.div
            key="objective"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 sm:p-6"
          >
            <p className="text-white/70 text-sm sm:text-base text-center mb-4">
              Vamos fazer um exercício prático para você entender melhor
            </p>
            
            <h2 className="text-white/50 text-xs sm:text-sm uppercase tracking-wider mb-4 text-center">
              Escolha um objetivo
            </h2>

            <div className="space-y-2 sm:space-y-3">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() => handleSelectObjective(obj)}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 text-left text-sm sm:text-base transition-all active:scale-[0.98]"
                >
                  {obj}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "actions" && (
          <motion.div
            key="actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 sm:p-6"
          >
            <div className="mb-3 sm:mb-4">
              <p className="text-white/50 text-xs sm:text-sm mb-1">Objetivo selecionado:</p>
              <p className="text-white text-base sm:text-lg">{selectedObjective}</p>
            </div>

            <p className="text-white/70 text-center text-sm sm:text-base mb-3">
              Nem tudo que ocupa te leva pra frente.
            </p>

            <p className="text-white/50 text-xs sm:text-sm mb-3 text-center">
              Selecione as ações que você faria para atingir o objetivo "{selectedObjective}"
            </p>

            <div className="space-y-1.5 sm:space-y-2 flex-1">
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  onClick={() => handleToggleAction(action.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl border transition-all flex items-center gap-2 sm:gap-3 ${
                    selectedActions.includes(action.id)
                      ? 'bg-white/15 border-white/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="text-white/80 text-left flex-1 text-sm sm:text-base">{action.text}</span>
                  {selectedActions.includes(action.id) && (
                    <span className="text-white/40 text-sm shrink-0">✓</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Floating villain bubble overlay */}
            <AnimatePresence>
              {activeVillain && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: -20 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="bg-white rounded-2xl px-6 py-4 shadow-2xl max-w-[80%]"
                  >
                    <p className="text-gray-800 text-lg font-medium text-center">
                      {activeVillain}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedActions.length >= 2 && !activeVillain && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleContinueFromActions}
                className="mt-6 w-full py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
              >
                Continuar
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "revelation" && (
          <motion.div
            key="revelation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
          >
            {revelationTexts.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 1.5 }}
                className="text-white/80 text-xl text-center leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              onClick={() => setStage("ancora")}
              className="mt-8 py-3.5 px-8 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
            >
              Continuar
            </motion.button>
          </motion.div>
        )}

        {stage === "ancora" && (
          <motion.div
            key="ancora"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
          >
            {ancoraTexts.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 1.5 }}
                className="text-white/80 text-xl text-center leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5 }}
              className="text-white/50 text-lg text-center leading-relaxed whitespace-pre-line pt-4"
            >
              {transitionText}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              onClick={onAdvance}
              className="mt-8 py-4 px-10 bg-white text-black font-semibold rounded-xl text-base transition-all active:scale-[0.98]"
            >
              Próximo nível
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
