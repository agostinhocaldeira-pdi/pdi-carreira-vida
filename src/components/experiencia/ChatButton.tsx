import { motion } from "framer-motion";

interface ChatButtonProps {
  text: string;
  onClick: () => void;
  delay?: number;
  variant?: "primary" | "secondary";
}

export const ChatButton = ({ text, onClick, delay = 0, variant = "primary" }: ChatButtonProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      onClick={onClick}
      className={`w-full py-3.5 px-6 rounded-xl text-base font-medium transition-all active:scale-[0.98] ${
        variant === "primary"
          ? 'bg-[#25D366] text-white hover:bg-[#20bd5a]'
          : 'bg-[#202c33] text-white/80 hover:bg-[#2a3942]'
      }`}
    >
      {text}
    </motion.button>
  );
};
