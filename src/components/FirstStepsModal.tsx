import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Compass, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FIRST_STEPS_KEY = "pdi_first_steps_shown";

export const FirstStepsModal = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstAccess = async () => {
      // Verificar se há usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Verificar se o usuário já tem algum uso real do sistema
        const [
          { data: objetivos },
          { data: metas },
          { data: valores },
          { data: areasVida },
          { data: vvd }
        ] = await Promise.all([
          supabase.from('user_objectives').select('id').eq('user_id', user.id).limit(1),
          supabase.from('user_goals').select('id').eq('user_id', user.id).limit(1),
          supabase.from('user_valores').select('id').eq('user_id', user.id).limit(1),
          supabase.from('user_life_areas').select('id').eq('user_id', user.id).limit(1),
          supabase.from('user_vvd').select('id').eq('user_id', user.id).limit(1)
        ]);
        
        const hasUsedSystem = 
          (objetivos && objetivos.length > 0) ||
          (metas && metas.length > 0) ||
          (valores && valores.length > 0) ||
          (areasVida && areasVida.length > 0) ||
          (vvd && vvd.length > 0);
        
        // Se o usuário já usou o sistema, não mostrar o modal
        if (hasUsedSystem) {
          localStorage.setItem(FIRST_STEPS_KEY, "true");
          return;
        }
        
        // Se não tem uso real, mostrar o modal
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        // Para usuários não autenticados, usar localStorage
        const hasSeenFirstSteps = localStorage.getItem(FIRST_STEPS_KEY);
        if (!hasSeenFirstSteps) {
          const timer = setTimeout(() => {
            setOpen(true);
          }, 500);
          return () => clearTimeout(timer);
        }
      }
    };

    checkFirstAccess();
  }, []);

  const handleClose = async () => {
    // Salvar no localStorage
    localStorage.setItem(FIRST_STEPS_KEY, "true");
    
    // Se usuário autenticado, salvar no Supabase
    if (userId) {
      try {
        await supabase
          .from('user_onboarding')
          .upsert({
            user_id: userId,
            current_phase: 'first_steps_completed',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    }
    
    setOpen(false);
  };

  const handleStartNow = async () => {
    await handleClose();
    navigate('/plano-vida/quem-sou');
  };

  const handleLater = async () => {
    await handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0 bg-[#1A1A1A] border border-[#D4AF37]/40 shadow-2xl">
        {/* Header with Icon */}
        <div className="pt-8 pb-4 px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
            <Compass className="w-8 h-8 text-[#D4AF37]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            O controle agora está com você.
          </h2>
          
          <p className="text-white/70 text-sm leading-relaxed">
            Você deu o passo que separa os ocupados dos realizadores.
            <br />
            Bem-vindo ao seu novo sistema de navegação.
          </p>
        </div>

        {/* Body - Highlight Box */}
        <div className="px-6 pb-4">
          <div className="p-5 rounded-xl bg-[#252525] border border-white/10">
            <p className="text-white/90 text-sm leading-relaxed">
              <span className="font-semibold text-[#D4AF37]">O sistema iniciou em MODO INICIAÇÃO.</span>
              <br /><br />
              Sua Agenda e Ferramentas de Execução estão temporariamente bloqueadas. 
              Para destravá-las, precisamos primeiro calibrar sua bússola pessoal (Passo 1).
            </p>
          </div>
        </div>

        {/* Footer - Time Expectation */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <Clock className="w-4 h-4" />
            <span>Investimento necessário: 30 minutos de foco total.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-8 space-y-3">
          <Button 
            onClick={handleStartNow} 
            className="w-full h-12 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] font-semibold text-base"
          >
            Iniciar Mapeamento Agora
          </Button>
          
          <Button 
            variant="ghost"
            onClick={handleLater} 
            className="w-full h-10 text-white/50 hover:text-white/70 hover:bg-white/5 font-normal text-sm"
          >
            Vou fazer depois
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
