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
      className={`w-full py-3 px-4 rounded-lg text-[15px] font-normal transition-all active:scale-[0.98] border ${
        variant === "primary"
          ? 'border-[#25D366] text-[#25D366] bg-transparent hover:bg-[#25D366]/10'
          : 'border-[#3b4a54] text-white/70 bg-transparent hover:bg-white/5'
      }`}
    >
      {text}
    </motion.button>
  );
};
