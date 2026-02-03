import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface PassoTresProps {
  onAdvance: () => void;
}

const tiktokMessages = [
  "Oi.",
  "Eu resolvi te ligar, porque essa parte é importante e eu quero impedir que tentem nos sabotar novamente.",
  "Não é sobre fazer mais coisas.",
  "É sobre o que você está tentando alcançar.",
  "Você escolhe um objetivo, a vida aperta, e você se sente fraco.",
  "Mas o problema não foi você.",
  "Foi o objetivo.",
  "vou te mostrar",
];

export const PassoTres = ({ onAdvance }: PassoTresProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (messageIndex < tiktokMessages.length) {
      const timer = setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messageIndex]);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* TikTok-style interface */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

      {/* Fake video background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
          <Play className="w-10 h-10 text-white/20 ml-1" />
        </div>
      </div>

      {/* TikTok side icons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <span className="text-white/60 text-xs">PDI</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white/40 text-lg">♥</span>
          </div>
          <span className="text-white/40 text-xs">--</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white/40 text-lg">💬</span>
          </div>
          <span className="text-white/40 text-xs">--</span>
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-24">
        <div className="space-y-3 max-w-[85%]">
          <AnimatePresence mode="popLayout">
            {tiktokMessages.slice(0, messageIndex).map((msg, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-white leading-relaxed ${
                  index === messageIndex - 1 ? 'text-lg' : 'text-base opacity-60'
                }`}
              >
                {msg}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onAdvance}
            className="mt-8 w-full py-4 bg-white text-black font-semibold rounded-xl text-base transition-all active:scale-[0.98]"
          >
            Acessar protocolo
          </motion.button>
        )}
      </div>

      {/* Bottom nav bar (fake) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/90 flex items-center justify-around px-8 border-t border-white/10">
        <div className="w-6 h-6 bg-white/20 rounded" />
        <div className="w-6 h-6 bg-white/20 rounded" />
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">+</span>
        </div>
        <div className="w-6 h-6 bg-white/20 rounded" />
        <div className="w-6 h-6 bg-white/20 rounded-full" />
      </div>
    </div>
  );
};
