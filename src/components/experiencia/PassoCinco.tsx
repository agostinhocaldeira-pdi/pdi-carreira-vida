import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type Stage = 
  | "pergunta" 
  | "resposta" 
  | "villain" 
  | "passoPossivel" 
  | "presenca" 
  | "respiracao" 
  | "nomeacao" 
  | "desfecho" 
  | "revelacao" 
  | "final";

// Voice Button component for dictation
const VoiceButton = ({ onTranscript }: { onTranscript: (text: string) => void }) => {
  const { transcript, isListening, isSupported, startListening, stopListening } = useSpeechRecognition();
  const [lastTranscript, setLastTranscript] = useState("");

  useEffect(() => {
    if (transcript && transcript !== lastTranscript) {
      onTranscript(transcript);
      setLastTranscript(transcript);
    }
  }, [transcript, lastTranscript, onTranscript]);

  // Reset lastTranscript when starting a new recording
  const handleStartListening = () => {
    setLastTranscript("");
    startListening();
  };

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      handleStartListening();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className={`absolute right-3 top-3 p-2 rounded-lg transition-all duration-200 ${
              isListening
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "bg-white/10 text-white/50 hover:text-white hover:bg-white/20"
            }`}
            aria-label={isListening ? "Parar gravação" : "Ditar resposta"}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isListening ? "Clique para parar" : "Clique para ditar"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const PassoCinco = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("pergunta");
  const [userInput, setUserInput] = useState("");
  const [breathPhase, setBreathPhase] = useState<"inspire" | "expire" | null>(null);
  const [textIndex, setTextIndex] = useState(0);

  const nomeacaoTexts = [
    'O <strong>"modo de viver"</strong> que te sabota',
    "é o Piloto Automático.",
  ];

  const desfechoTexts = [
    "Você não elimina o Piloto Automático.",
    "Você aprende a não ser governado por ele.",
    "Isso é maturidade.",
    "Isso é alinhamento.",
  ];

  const revelacaoTexts = [
    "E é exatamente isso",
    "que você vai encontrar no sistema",
    "PDI — Plano de Desenvolvimento Individual.",
  ];

  useEffect(() => {
    if (stage === "respiracao") {
      setBreathPhase("inspire");
      const timer1 = setTimeout(() => {
        setBreathPhase("expire");
      }, 4000);
      const timer2 = setTimeout(() => {
        setBreathPhase(null);
        setStage("nomeacao");
      }, 8000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [stage]);

  const handleSubmitStep = () => {
    if (userInput.trim()) {
      setStage("villain");
      setTimeout(() => {
        setStage("passoPossivel");
      }, 2500);
    }
  };

  const advanceText = (currentTexts: string[], nextStage: Stage) => {
    if (textIndex < currentTexts.length - 1) {
      setTextIndex((prev) => prev + 1);
    } else {
      setTextIndex(0);
      setStage(nextStage);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AnimatePresence mode="wait">
        {stage === "pergunta" && (
          <motion.div
            key="pergunta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/50 text-sm sm:text-base text-center leading-relaxed mb-4"
            >
              Se você sabe a vida que realmente quer viver, e tem um objetivo definido, responda:
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-xl text-center leading-relaxed mb-8"
            >
              Qual é o pequeno passo que cabe no seu dia, pequeno o suficiente para fazer sem mexer na sua rotina, mas que te aproxima do que <span className="font-bold text-white">realmente</span> importa?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="w-full max-w-sm"
            >
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite ou dite sua resposta..."
                  className="w-full h-32 p-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-white/30"
                />
                <VoiceButton 
                  onTranscript={(text) => setUserInput(prev => prev ? `${prev} ${text}` : text)} 
                />
              </div>

              <button
                onClick={handleSubmitStep}
                disabled={!userInput.trim()}
                className={`w-full mt-4 py-4 rounded-xl font-medium transition-all ${
                  userInput.trim()
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                Registrar
              </button>
            </motion.div>
          </motion.div>
        )}

        {stage === "villain" && (
          <motion.div
            key="villain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-8 bg-white"
          >
            <p className="text-gray-500 text-lg text-center italic">
              Isso não é pouco demais?
            </p>
          </motion.div>
        )}

        {stage === "passoPossivel" && (
          <motion.div
            key="passoPossivel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 text-xl text-center leading-relaxed"
            >
              Passo possível não impressiona.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-white/80 text-xl text-center leading-relaxed"
            >
              Ele sustenta.
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              onClick={() => setStage("presenca")}
              className="mt-8 py-3.5 px-8 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
            >
              Continuar
            </motion.button>
          </motion.div>
        )}

        {stage === "presenca" && (
          <motion.div
            key="presenca"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/60 text-lg text-center leading-relaxed mb-4"
            >
              Antes de finalizar, tente isso:
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-white/80 text-xl text-center font-medium mb-4"
            >
              Está preparado?
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={() => setStage("respiracao")}
              className="py-4 px-10 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
            >
              SIM
            </motion.button>
          </motion.div>
        )}

        {stage === "respiracao" && (
          <motion.div
            key="respiracao"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-8"
          >
            <motion.div
              animate={{
                scale: breathPhase === "inspire" ? 1.3 : 1,
              }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center"
            >
              <span className="text-white/60 text-lg">
                {breathPhase === "inspire" ? "Inspire..." : "Expire..."}
              </span>
            </motion.div>
          </motion.div>
        )}

        {stage === "nomeacao" && (
          <motion.div
            key="nomeacao"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-4"
          >
            {nomeacaoTexts.slice(0, textIndex + 1).map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl text-center leading-relaxed ${
                  index === 1 ? 'text-white font-medium' : 'text-white/70'
                }`}
              >
                {text}
              </motion.p>
            ))}

            {textIndex < nomeacaoTexts.length - 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <button
                  onClick={() => advanceText(nomeacaoTexts, "desfecho")}
                  className="mt-8 py-3 px-6 text-white/50 hover:text-white/70 transition-colors"
                >
                  →
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => {
                  setTextIndex(0);
                  setStage("desfecho");
                }}
                className="mt-8 py-3.5 px-8 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
              >
                Continuar
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "desfecho" && (
          <motion.div
            key="desfecho"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-4"
          >
            {desfechoTexts.slice(0, textIndex + 1).map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 text-xl text-center leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            {textIndex < desfechoTexts.length - 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <button
                  onClick={() => advanceText(desfechoTexts, "revelacao")}
                  className="mt-8 py-3 px-6 text-white/50 hover:text-white/70 transition-colors"
                >
                  →
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => {
                  setTextIndex(0);
                  setStage("revelacao");
                }}
                className="mt-8 py-3.5 px-8 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
              >
                Continuar
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "revelacao" && (
          <motion.div
            key="revelacao"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 space-y-4"
          >
            {revelacaoTexts.slice(0, textIndex + 1).map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl text-center leading-relaxed ${
                  index === 2 ? 'text-white font-semibold' : 'text-white/70'
                }`}
              >
                {text}
              </motion.p>
            ))}

            {textIndex < revelacaoTexts.length - 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <button
                  onClick={() => advanceText(revelacaoTexts, "final")}
                  className="mt-8 py-3 px-6 text-white/50 hover:text-white/70 transition-colors"
                >
                  →
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => setStage("final")}
                className="mt-8 py-3.5 px-8 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium transition-all"
              >
                Continuar
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-white/50 text-sm uppercase tracking-wider mb-4">
                Jornada concluída
              </p>
              <h1 className="text-white text-3xl font-bold mb-2">PDI</h1>
              <p className="text-white/60 text-lg mb-12">
                Plano de Desenvolvimento Individual
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="py-4 px-12 bg-white text-black font-semibold rounded-xl text-lg transition-all active:scale-[0.98] hover:bg-white/90"
              >
                Acessar o PDI
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
