import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Copy, ClipboardPaste } from "lucide-react";

interface PasswordGateProps {
  password: string;
  onSuccess: () => void;
  buttonText: string;
  onBeforeSuccess?: () => void;
  beforeSuccessDelay?: number;
}

export const PasswordGate = ({ 
  password, 
  onSuccess, 
  buttonText,
  onBeforeSuccess,
  beforeSuccessDelay = 0,
}: PasswordGateProps) => {
  const [stage, setStage] = useState<"input" | "loading">("input");
  const [inputValue, setInputValue] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const loadingSteps = [
    "Verificando credenciais...",
    "Validando acesso...",
    "Conectando ao sistema...",
    "Preparando conteúdo...",
  ];

  const handleCopy = () => {
    // Simulated copy - just visual feedback
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = () => {
    // Simulated paste - fills the password field directly
    setInputValue(password);
  };

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
            if (onBeforeSuccess) {
              onBeforeSuccess();
            }
            setTimeout(onSuccess, beforeSuccessDelay);
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

      <div className="space-y-4">
        {/* Password display field with copy */}
        <div className="space-y-2">
          <p className="text-white/60 text-sm text-center">senha de acesso</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 px-3 py-3 bg-[#202c33] border border-white/10 rounded-xl text-white text-center text-base sm:text-lg tracking-widest font-mono truncate">
              {password}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 p-3 bg-[#202c33] border border-white/10 rounded-xl text-white/70 hover:text-[#25D366] hover:border-[#25D366]/50 transition-all"
              title="Copiar senha"
            >
              <Copy className={`w-5 h-5 ${copied ? 'text-[#25D366]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Password input field with paste */}
        <div className="space-y-2">
          <p className="text-white/60 text-sm text-center">digite a senha</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cole aqui"
              className="flex-1 min-w-0 px-3 py-3 bg-[#202c33] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#25D366]/50 text-center text-base sm:text-lg tracking-widest"
            />
            <button
              onClick={handlePaste}
              className="shrink-0 p-3 bg-[#202c33] border border-white/10 rounded-xl text-white/70 hover:text-[#25D366] hover:border-[#25D366]/50 transition-all"
              title="Colar senha"
            >
              <ClipboardPaste className="w-5 h-5" />
            </button>
          </div>
        </div>

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
