import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";

const BASE_PESSOAL_WELCOME_KEY = "pdi_base_pessoal_welcome_shown";

interface BasePessoalWelcomeModalProps {
  userId?: string | null;
  hasCompletedBase?: boolean;
}

export const BasePessoalWelcomeModal = ({ userId, hasCompletedBase = false }: BasePessoalWelcomeModalProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Don't show modal if user already completed base pessoal (100%)
    if (hasCompletedBase) {
      return;
    }
    
    // Check if user has seen this modal before
    const storageKey = userId 
      ? `${BASE_PESSOAL_WELCOME_KEY}_${userId}` 
      : BASE_PESSOAL_WELCOME_KEY;
    
    const hasSeenModal = localStorage.getItem(storageKey);
    
    if (!hasSeenModal) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userId, hasCompletedBase]);

  const handleClose = () => {
    const storageKey = userId 
      ? `${BASE_PESSOAL_WELCOME_KEY}_${userId}` 
      : BASE_PESSOAL_WELCOME_KEY;
    
    localStorage.setItem(storageKey, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent 
        className="sm:max-w-[480px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-[#1A1A1A] border border-[#D4AF37]/40 shadow-2xl"
        hideCloseButton
      >
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C9A431] flex items-center justify-center shadow-lg">
              <Compass className="w-8 h-8 text-[#1A1A1A]" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Base Pessoal
            </h2>

            <div className="pt-2">
              <ol className="text-white/70 text-sm sm:text-base leading-relaxed space-y-2 text-left max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <span><strong className="text-white">Valores</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <span><strong className="text-white">Roda da Vida</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <span><strong className="text-white">VVD</strong> — Visão de Vida Desejada</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8">
            <Button 
              onClick={handleClose}
              className="w-full py-6 bg-gradient-to-r from-[#D4AF37] to-[#C9A431] hover:from-[#C9A431] hover:to-[#B8942D] text-[#1A1A1A] font-semibold text-base rounded-xl shadow-lg transition-all duration-300 gap-2"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
