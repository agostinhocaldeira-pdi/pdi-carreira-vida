import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, ChevronDown, Search, Heart, MessageCircle, Home, PlusSquare, User } from "lucide-react";
import logoPdi from "@/assets/logo_pdi.png";

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
  { id: 3, text: "Praticar exercícios físicos diariamente", isDistraction: true },
  { id: 4, text: "Ler sobre investimentos", isDistraction: false },
  { id: 5, text: "Arrumar emprego paralelo ou renda extra", isDistraction: true },
  { id: 6, text: "Definir próximo passo claro", isDistraction: false },
];

const villainMessages = [
  "Você está com fome",
  "tem mensagem no whatsapp",
  "vem ver esse reels",
  "café?",
];

// Generate random position within bounds
const getRandomPosition = () => ({
  x: (Math.random() - 0.5) * 120, // -60 to 60 pixels
  y: (Math.random() - 0.5) * 80,  // -40 to 40 pixels
  rotate: (Math.random() - 0.5) * 8, // -4 to 4 degrees
});

export const PassoQuatro = ({ onAdvance }: PassoQuatroProps) => {
  const [stage, setStage] = useState<"objective" | "actions" | "revelation" | "instagram" | "ancora">("objective");
  const [selectedObjective, setSelectedObjective] = useState("");
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [activeVillain, setActiveVillain] = useState<string | null>(null);
  const [villainQueue, setVillainQueue] = useState<string[]>([...villainMessages]);
  const [showActionsContent, setShowActionsContent] = useState(false);
  
  // Positions for each objective card
  const [cardPositions, setCardPositions] = useState<Array<{ x: number; y: number; rotate: number }>>(
    objectives.map(() => ({ x: 0, y: 0, rotate: 0 }))
  );

  // Shuffle card positions every 900ms
  useEffect(() => {
    if (stage !== "objective") return;
    
    const interval = setInterval(() => {
      setCardPositions(objectives.map(() => getRandomPosition()));
    }, 900);
    
    return () => clearInterval(interval);
  }, [stage]);

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
    setShowActionsContent(false);
    setStage("actions");
    // Show content after intro phrase
    setTimeout(() => {
      setShowActionsContent(true);
    }, 2500);
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

  const revelationTitle = 'O jeito de parar o "modo de viver" é fazer menos';
  
  const revelationSteps = [
    "Ter clareza sobre a vida que quer viver",
    "ter um objetivo por vez",
    "ter poucas metas em execução",
    "Realizar pequenas ações diárias (conectadas com a meta, objetivo e vida).",
  ];

  const revelationFinalText = "Meta demais cria ilusão. Ação sem intenção cria cansaço.";

  const ancoraTexts = [
    "Perceba que você não precisa de mais força, mais tempo, mais ferramentas.",
    'Ter clareza para focar no que realmente importa para você, mas que encaixe na sua vida real, sem deixar o "modo de viver" te derrubar.',
    "você precisa de um sistema que te traga essa clareza nas decisões e sustentem o processo.",
  ];

  const ancoraBoldText = "Você precisa de menos.";

  const transitionText = "Agora falta só um nível.\nO mais ignorado de todos.";

  // Instagram explore grid data - random placeholder colors and one PDI logo
  const instagramPosts = [
    { id: 1, type: "color", color: "bg-gradient-to-br from-pink-500 to-orange-400" },
    { id: 2, type: "color", color: "bg-gradient-to-br from-blue-400 to-purple-500" },
    { id: 3, type: "color", color: "bg-gradient-to-br from-green-400 to-teal-500" },
    { id: 4, type: "pdi", color: "" },
    { id: 5, type: "color", color: "bg-gradient-to-br from-yellow-400 to-red-500" },
    { id: 6, type: "color", color: "bg-gradient-to-br from-indigo-400 to-blue-600" },
    { id: 7, type: "color", color: "bg-gradient-to-br from-rose-400 to-pink-600" },
    { id: 8, type: "color", color: "bg-gradient-to-br from-cyan-400 to-blue-500" },
    { id: 9, type: "color", color: "bg-gradient-to-br from-amber-400 to-orange-600" },
    { id: 10, type: "color", color: "bg-gradient-to-br from-violet-400 to-purple-600" },
    { id: 11, type: "color", color: "bg-gradient-to-br from-lime-400 to-green-600" },
    { id: 12, type: "color", color: "bg-gradient-to-br from-fuchsia-400 to-pink-600" },
  ];

  const handleInstagramPostClick = (post: typeof instagramPosts[0]) => {
    if (post.type === "pdi") {
      setStage("ancora");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AnimatePresence mode="wait">
        {stage === "instagram" && (
          <motion.div
            key="instagram"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-black"
          >
            {/* Instagram Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-white font-semibold text-lg">Explorar</span>
              <Search className="w-5 h-5 text-white" />
            </div>

            {/* Explore Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-0.5">
                {instagramPosts.map((post) => (
                  <motion.button
                    key={post.id}
                    onClick={() => handleInstagramPostClick(post)}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square relative ${post.type === "color" ? post.color : "bg-white/10"} flex items-center justify-center`}
                  >
                    {post.type === "pdi" && (
                      <img 
                        src={logoPdi} 
                        alt="PDI" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {post.type === "color" && (
                      <div className="absolute inset-0 flex items-end p-2">
                        <div className="flex gap-2 text-white/80">
                          <Heart className="w-4 h-4" />
                          <MessageCircle className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Instagram Bottom Nav */}
            <div className="flex items-center justify-around py-3 border-t border-white/10 bg-black">
              <Home className="w-6 h-6 text-white/50" />
              <Search className="w-6 h-6 text-white" />
              <PlusSquare className="w-6 h-6 text-white/50" />
              <Heart className="w-6 h-6 text-white/50" />
              <User className="w-6 h-6 text-white/50" />
            </div>

            {/* Hint text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-white/30 text-xs text-center py-2 italic"
            >
              Toque na imagem que te chama atenção...
            </motion.p>
          </motion.div>
        )}

        {stage === "objective" && (
          <motion.div
            key="objective"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 sm:p-6"
          >
            <p className="text-white text-base sm:text-xl text-center mb-4 font-semibold">
              Vamos fazer um exercício prático para você entender melhor
            </p>
            
            <h2 className="text-white/50 text-xs sm:text-sm uppercase tracking-wider mb-4 text-center">
              Escolha um objetivo
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {objectives.map((obj, index) => (
                <motion.button
                  key={obj}
                  onClick={() => handleSelectObjective(obj)}
                  animate={{
                    x: cardPositions[index].x,
                    y: cardPositions[index].y,
                    rotate: cardPositions[index].rotate,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="aspect-square p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 text-xs sm:text-sm transition-colors cursor-pointer relative z-10 flex items-center justify-center text-center"
                >
                  {obj}
                </motion.button>
              ))}
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-white/30 text-xs text-center mt-6 italic"
            >
              Difícil focar quando tudo se move, não é?
            </motion.p>
          </motion.div>
        )}

        {stage === "actions" && (
          <motion.div
            key="actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-3 sm:p-6 pt-6 sm:pt-12 max-h-[100dvh] overflow-y-auto"
          >
            {/* Intro phrase first */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white/80 text-center text-sm sm:text-lg italic mb-3 sm:mb-6"
            >
              (às vezes é difícil escolher um objetivo, não é mesmo?)
            </motion.p>

            <AnimatePresence>
              {showActionsContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2 sm:space-y-4"
                >
                  <div className="mb-1 sm:mb-4">
                    <p className="text-white/50 text-xs sm:text-sm mb-0.5">Objetivo selecionado:</p>
                    <p className="text-white text-sm sm:text-lg">{selectedObjective}</p>
                  </div>

                  <p className="text-white text-center text-sm sm:text-base font-semibold mb-1">
                    Selecione as 3 ações que você faria para atingir o objetivo "{selectedObjective}"
                  </p>

                  <div className="space-y-1">
                    {actions.map((action) => (
                      <motion.button
                        key={action.id}
                        onClick={() => handleToggleAction(action.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-2 sm:py-3.5 px-3 sm:px-4 rounded-xl border transition-all flex items-center gap-2 sm:gap-3 ${
                          selectedActions.includes(action.id)
                            ? 'bg-white/15 border-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <GripVertical className="w-4 h-4 text-white/30 shrink-0" />
                        <span className="text-white/80 text-left flex-1 text-xs sm:text-base">{action.text}</span>
                        {selectedActions.includes(action.id) && (
                          <span className="text-white/40 text-sm shrink-0">✓</span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {selectedActions.length >= 2 && !activeVillain && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleContinueFromActions}
                      className="mt-4 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
                    >
                      Continuar
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

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
                    <p className="text-foreground text-lg font-medium text-center">
                      {activeVillain}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {stage === "revelation" && (
          <motion.div
            key="revelation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/50 text-sm sm:text-base text-center mb-6"
            >
              na tela anterior, tentaram sabotar de novo.
            </motion.p>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-white text-lg sm:text-xl text-center leading-relaxed font-semibold mb-8"
            >
              {revelationTitle}
            </motion.p>

            {/* Steps with arrows */}
            <div className="flex flex-col items-center space-y-2">
              {revelationSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 1 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-white/80 text-base sm:text-lg text-center leading-relaxed">
                    {step}
                  </p>
                  {index < revelationSteps.length - 1 && (
                    <ChevronDown className="w-5 h-5 text-white/40 my-1" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Final text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7 }}
              className="text-white text-base sm:text-lg text-center leading-relaxed font-semibold mt-8"
            >
              {revelationFinalText}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 8.5 }}
              onClick={() => setStage("instagram")}
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
            className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 space-y-4 sm:space-y-5"
          >
            {/* First text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-lg sm:text-xl text-center leading-relaxed"
            >
              {ancoraTexts[0]}
            </motion.p>

            {/* Bold text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-white text-lg sm:text-xl text-center leading-relaxed font-bold"
            >
              {ancoraBoldText}
            </motion.p>

            {/* Second text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
              className="text-white/80 text-base sm:text-lg text-center leading-relaxed"
            >
              {ancoraTexts[1]}
            </motion.p>

            {/* Third text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.5 }}
              className="text-white/80 text-base sm:text-lg text-center leading-relaxed"
            >
              {ancoraTexts[2]}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6 }}
              className="text-white/50 text-base sm:text-lg text-center leading-relaxed whitespace-pre-line pt-4"
            >
              {transitionText}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7.5 }}
              onClick={onAdvance}
              className="mt-6 py-4 px-10 bg-white text-black font-semibold rounded-xl text-base transition-all active:scale-[0.98]"
            >
              Próximo nível
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
