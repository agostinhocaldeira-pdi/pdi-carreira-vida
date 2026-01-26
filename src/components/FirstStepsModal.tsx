import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2, Clock, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FIRST_STEPS_KEY = "pdi_first_steps_shown";

export const FirstStepsModal = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstAccess = async () => {
      // Primeiro: verificar localStorage (rápido)
      const hasSeenFirstStepsLocal = localStorage.getItem(FIRST_STEPS_KEY);
      if (hasSeenFirstStepsLocal) {
        return; // Já viu o modal, não mostrar novamente
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Verificar no Supabase se já marcou como visto
        const { data: onboarding } = await supabase
          .from('user_onboarding')
          .select('current_phase')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (onboarding?.current_phase === 'first_steps_completed') {
          // Sincronizar com localStorage e não mostrar
          localStorage.setItem(FIRST_STEPS_KEY, "true");
          return;
        }
        
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
        
        if (hasUsedSystem) {
          localStorage.setItem(FIRST_STEPS_KEY, "true");
          return;
        }
        
        // Nenhum critério de "já viu" atendido: mostrar modal
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        // Usuário não autenticado: usar apenas localStorage (já verificado acima)
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    };

    checkFirstAccess();
  }, []);

  const handleClose = async () => {
    localStorage.setItem(FIRST_STEPS_KEY, "true");
    
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
    // Dispatch custom event to open task modal with pre-filled data
    window.dispatchEvent(new CustomEvent('openTaskModalWithData', {
      detail: {
        title: 'Minha Base Pessoal',
        description: '(defina data e horário para você fazer os exercícios da Base Pessoal. Esse é o passo que construirá sua jornada)'
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent 
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0 bg-[#1A1A1A] border border-[#D4AF37]/40 shadow-2xl"
        hideCloseButton
      >
        {/* Header with Icon */}
        <div className="pt-10 pb-6 px-8 text-center">
          <div className="w-18 h-18 mx-auto mb-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center p-4">
            <Settings2 className="w-10 h-10 text-[#D4AF37]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            O próximo passo define toda a sua jornada.
          </h2>
          
          <p className="text-white/70 text-sm leading-relaxed">
            Para o sistema funcionar com precisão, ele precisa primeiro entender sua base pessoal.
          </p>
        </div>

        {/* Status Box */}
        <div className="px-8 pb-5">
          <div className="p-4 rounded-lg bg-[#252525] border border-white/10 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm leading-relaxed">
              <span className="font-medium">Status do Sistema:</span> O Modo Operacional será ativado automaticamente após a definição da sua Base Pessoal.
            </p>
          </div>
        </div>

        {/* Footer - Time Expectation */}
        <div className="px-8 pb-3">
          <div className="flex items-center justify-center gap-2 text-[#D4AF37]/80 text-sm">
            <Clock className="w-4 h-4" />
            <span>Tempo estimado: cerca de 30 minutos de foco tranquilo</span>
          </div>
        </div>
        
        {/* Explanation text */}
        <div className="px-8 pb-5">
          <p className="text-white/50 text-xs leading-relaxed text-center">
            Esse mapeamento conecta identidade, valores e prioridades — e garante que suas metas, agenda e execução avancem na direção certa, sem desperdício de energia.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 space-y-3">
          <Button 
            onClick={handleStartNow} 
            className="w-full h-12 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] font-semibold text-base shadow-lg"
          >
            Iniciar Base Pessoal agora
          </Button>
          
          <Button 
            variant="ghost"
            onClick={handleLater} 
            className="w-full h-10 text-white/40 hover:text-white/60 hover:bg-white/5 font-normal text-sm"
          >
            Fazer isso depois
          </Button>
          
          {/* Microcopy */}
          <p className="text-center text-white/30 text-xs pt-1">
            Você poderá iniciar a qualquer momento pela Home.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
