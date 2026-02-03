import { motion, AnimatePresence } from "framer-motion";

interface VillainInterruptionProps {
  text: string;
  isVisible: boolean;
}

export const VillainInterruption = ({ text, isVisible }: VillainInterruptionProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-center text-lg leading-relaxed italic"
          >
            {text}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
