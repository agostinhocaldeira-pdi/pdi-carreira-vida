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
const REACTIVATION_MODAL_KEY = "pdi_reactivation_modal_shown_jan27";

export const FirstStepsModal = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Usuário não autenticado: verificar localStorage
        const hasSeenFirstStepsLocal = localStorage.getItem(FIRST_STEPS_KEY);
        if (!hasSeenFirstStepsLocal) {
          const timer = setTimeout(() => {
            setOpen(true);
          }, 500);
          return () => clearTimeout(timer);
        }
        return;
      }

      setUserId(user.id);
      
      // Verificar se já viu o modal de reativação (jan27)
      const hasSeenReactivation = localStorage.getItem(REACTIVATION_MODAL_KEY);
      
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
        supabase.from('user_valores').select('valores').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_life_areas').select('id, current_score').eq('user_id', user.id),
        supabase.from('user_vvd').select('vvd_text').eq('user_id', user.id).maybeSingle()
      ]);
      
      // Verificar se há dados significativos
      const hasObjetivos = objetivos && objetivos.length > 0;
      const hasMetas = metas && metas.length > 0;
      const hasValores = valores?.valores && valores.valores.some((v: string) => v.trim() !== "");
      const hasCompleteAreas = areasVida && areasVida.length > 0 && 
        areasVida.some((area: any) => area.current_score !== null);
      const hasVvd = vvd?.vvd_text && vvd.vvd_text.trim() !== "";
      
      const hasUsedSystem = hasObjetivos || hasMetas || hasValores || hasCompleteAreas || hasVvd;
      
      if (hasUsedSystem) {
        // Usuário já tem dados no sistema, não mostrar modal
        localStorage.setItem(FIRST_STEPS_KEY, "true");
        return;
      }

      // Usuário não tem dados - verificar se está inativo há 20+ dias
      const userCreatedAt = new Date(user.created_at);
      const now = new Date();
      const daysSinceCreation = Math.floor((now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
      
      // Se usuário foi criado há 20+ dias e não tem dados, mostrar modal de reativação (apenas uma vez)
      if (daysSinceCreation >= 20 && !hasSeenReactivation) {
        console.log(`User inactive for ${daysSinceCreation} days with no data, showing reactivation modal`);
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
      
      // Verificar no Supabase se já marcou o modal inicial como visto
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
      
      // Verificar localStorage
      const hasSeenFirstStepsLocal = localStorage.getItem(FIRST_STEPS_KEY);
      if (hasSeenFirstStepsLocal) {
        return;
      }
      
      // Nenhum critério de "já viu" atendido: mostrar modal
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    };

    checkFirstAccess();
  }, []);

  const handleClose = async () => {
    localStorage.setItem(FIRST_STEPS_KEY, "true");
    localStorage.setItem(REACTIVATION_MODAL_KEY, "true");
    
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
