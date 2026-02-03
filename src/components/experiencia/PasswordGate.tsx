import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle } from "lucide-react";

interface PasswordGateProps {
  password: string;
  onSuccess: () => void;
  buttonText: string;
}

export const PasswordGate = ({ password, onSuccess, buttonText }: PasswordGateProps) => {
  const [stage, setStage] = useState<"input" | "loading" | "success">("input");
  const [inputValue, setInputValue] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Verificando credenciais...",
    "Validando acesso...",
    "Conectando ao sistema...",
    "Preparando conteúdo...",
  ];

  const handleSubmit = () => {
    if (inputValue === password) {
      setStage("loading");
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setLoadingStep(step);
        if (step >= loadingSteps.length) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("success");
            setTimeout(onSuccess, 1500);
          }, 800);
        }
      }, 700);
    }
  };

  if (stage === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#0b141a] z-50 flex flex-col items-center justify-center p-8"
      >
        <Loader2 className="w-12 h-12 text-[#25D366] animate-spin mb-6" />
        <p className="text-white/70 text-center">
          {loadingSteps[Math.min(loadingStep, loadingSteps.length - 1)]}
        </p>
      </motion.div>
    );
  }

  if (stage === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#0b141a] z-50 flex flex-col items-center justify-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <CheckCircle className="w-16 h-16 text-[#25D366] mb-6" />
        </motion.div>
        <p className="text-white text-xl font-medium">Parabéns — Acesso concedido</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto space-y-4 p-6"
    >
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-[#25D366]" />
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Cole a senha aqui"
          className="w-full px-4 py-3.5 bg-[#202c33] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#25D366]/50 text-center text-lg tracking-widest"
        />

        <button
          onClick={handleSubmit}
          disabled={inputValue !== password}
          className={`w-full py-3.5 rounded-xl text-base font-medium transition-all ${
            inputValue === password
              ? 'bg-[#25D366] text-white hover:bg-[#20bd5a]'
              : 'bg-[#202c33] text-white/40 cursor-not-allowed'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
};
