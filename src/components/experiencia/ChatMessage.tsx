import { motion } from "framer-motion";

interface ChatMessageProps {
  text: string;
  isSystem?: boolean;
  delay?: number;
}

export const ChatMessage = ({ text, isSystem = true, delay = 0 }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`max-w-[85%] ${isSystem ? 'self-start' : 'self-end'}`}
    >
      <div
        className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed [&_strong]:font-semibold ${
          isSystem
            ? 'bg-[#202c33] text-white/90 rounded-tl-md'
            : 'bg-[#005c4b] text-white rounded-tr-md'
        }`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </motion.div>
  );
};
