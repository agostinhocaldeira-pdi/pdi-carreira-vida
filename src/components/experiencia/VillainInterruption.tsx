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
          animate={{ 
            opacity: [1, 0.97, 1, 0.98, 1],
            x: [0, -1, 1, -0.5, 0],
            y: [0, 0.5, -0.5, 0.3, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.15,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundBlendMode: 'overlay',
          }}
        >
          {/* Scanlines overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            }}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.7, 1, 0.8, 1, 0.7],
              scale: [1, 1.02, 0.98, 1.01, 1],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="text-gray-600 text-center text-xl leading-relaxed font-bold whitespace-pre-line"
          >
            {text}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
