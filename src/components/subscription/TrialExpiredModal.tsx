import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forceOpen?: boolean;
}

export const TrialExpiredModal = ({ open, onOpenChange, forceOpen = false }: TrialExpiredModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (forceOpen && !newOpen) {
      return;
    }
    onOpenChange(newOpen);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error("Você precisa estar logado para assinar");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Não foi possível criar a sessão de pagamento");
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || "Erro ao processar checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={forceOpen ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={forceOpen ? (e) => e.preventDefault() : undefined}
        {...(forceOpen ? { hideCloseButton: true } : {})}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl">Seu período gratuito acabou</DialogTitle>
          <DialogDescription className="text-center">
            Você aproveitou 30 dias de acesso gratuito. Para continuar usando o PDI, 
            efetue o pagamento abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Alert about first charge */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              ⏰ <strong>Importante:</strong> A primeira cobrança será realizada 30 dias após o pagamento.
            </p>
          </div>

          {/* Price display */}
          <div className="text-center py-2">
            <div className="text-3xl font-bold">
              R$ 67<span className="text-base font-normal text-muted-foreground">/ano</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Apenas R$ 5,58/mês
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Acesso completo a todas as ferramentas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Diário e Plano de Vida ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span>1 insight personalizado por mês</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Assinar Agora"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
