import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles,
  Clock,
  Calendar
} from "lucide-react";
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
        
        // Verificar no Supabase se o usuário já viu o modal (usando user_onboarding)
        const { data: onboarding } = await supabase
          .from('user_onboarding')
          .select('current_phase')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // Se o usuário tem registro de onboarding, já viu o modal
        if (onboarding) {
          localStorage.setItem(FIRST_STEPS_KEY, "true");
          return;
        }
        
        // Se não tem registro, mostrar o modal
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

  const handleSchedule = async () => {
    await handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <DialogTitle className="text-lg sm:text-xl">Parabéns pela sua decisão! 🎉</DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Parabéns pela sua decisão de construir seu futuro com o PDI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold text-foreground text-base mb-2">
              Comece pelo Plano de Vida:
            </h4>
            <p className="text-sm text-foreground font-medium mb-2">
              Faça o passo 1 "Quem sou eu"
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Nesta atividade, você vai realizar exercícios de autoconhecimento. 
              Com esse exercício você terá uma clareza maior sobre o que você realmente deseja para sua vida.
            </p>
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Essa etapa é muito importante. Faça com calma. Duração aproximada: 30 minutos.</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Você pode fazer agora ou cadastrar uma tarefa na sua agenda, para realizar no dia e hora que ficar melhor para você.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 sticky bottom-0 bg-background pb-1">
          <Button 
            variant="outline" 
            onClick={handleSchedule} 
            className="gap-2 text-sm sm:text-base flex-1"
          >
            <Calendar className="w-4 h-4" />
            Vou agendar
          </Button>
          <Button 
            onClick={handleStartNow} 
            className="gap-2 text-sm sm:text-base flex-1"
          >
            Fazer agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
