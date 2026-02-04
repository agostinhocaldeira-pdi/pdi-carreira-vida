import { motion } from "framer-motion";

interface ChatMessageProps {
  text: string;
  isSystem?: boolean;
  delay?: number;
  isTemporary?: boolean;
}

const TemporaryMessageIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-4 h-4 inline-block ml-1.5 text-white/60"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {/* Solid half circle (left side) */}
    <path
      d="M12 2 A10 10 0 0 0 12 22"
      strokeLinecap="round"
    />
    {/* Dotted half circle (right side) */}
    <path
      d="M12 2 A10 10 0 0 1 12 22"
      strokeLinecap="round"
      strokeDasharray="3 3"
    />
    {/* Number 1 in the center */}
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="currentColor"
      stroke="none"
      fontSize="12"
      fontWeight="bold"
    >
      1
    </text>
  </svg>
);

export const ChatMessage = ({ text, isSystem = true, delay = 0, isTemporary = false }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`max-w-[85%] ${isSystem ? 'self-start' : 'self-end'}`}
    >
      <div
        className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed [&_strong]:font-semibold flex items-center ${
          isSystem
            ? 'bg-[#202c33] text-white/90 rounded-tl-md'
            : 'bg-[#005c4b] text-white rounded-tr-md'
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: text }} />
        {isTemporary && <TemporaryMessageIcon />}
      </div>
    </motion.div>
  );
};
