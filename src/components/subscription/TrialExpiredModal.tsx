import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Crown, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forceOpen?: boolean; // When true, modal cannot be closed
}

export const TrialExpiredModal = ({ open, onOpenChange, forceOpen = false }: TrialExpiredModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    // If forceOpen is true, prevent closing the modal
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
        // Redirect in same tab to ensure proper return after payment
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
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={forceOpen ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={forceOpen ? (e) => e.preventDefault() : undefined}
        // Hide close button when forceOpen
        {...(forceOpen ? { hideCloseButton: true } : {})}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <DialogTitle className="text-xl">Seu período gratuito acabou</DialogTitle>
          <DialogDescription className="text-center">
            Você aproveitou 30 dias de acesso gratuito. Para continuar usando o PDI, 
            efetue o pagamento abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Alert about first charge */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center mb-4">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              ⏰ <strong>Importante:</strong> A primeira cobrança será realizada 30 dias após o pagamento.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Plano Anual */}
            <Card className="border-2 border-green-500 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium animate-pulse">
                🎉 Promoção!
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Plano Anual</CardTitle>
                </div>
                <div className="text-2xl font-bold">
                  R$ 67<span className="text-sm font-normal text-muted-foreground">/ano</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apenas R$ 5,58/mês • 30 dias grátis inclusos
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>1 insight por mês</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Plano de Vida ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Todas as ferramentas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Construção Guiada</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-green-500 hover:bg-green-600" 
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
              </CardContent>
            </Card>

            {/* Plano Completo */}
            <Card className="border-2 border-muted hover:border-amber-500/50 transition-all cursor-pointer group relative overflow-hidden opacity-75">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                Em breve
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-lg">Completo</CardTitle>
                </div>
                <div className="text-2xl font-bold">
                  R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1.5 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Insights ilimitados</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Plano de Vida ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Todas as ferramentas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Notificações e-mail e WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Construção Guiada</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Gerar relatórios PDF</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center mt-4">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              🚀 Promoção de lançamento: acesso completo por apenas R$ 67/ano (R$ 5,58/mês)!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
