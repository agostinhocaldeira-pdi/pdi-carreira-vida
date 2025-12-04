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
import { Check, Sparkles, Crown, Clock } from 'lucide-react';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrialExpiredModal = ({ open, onOpenChange }: TrialExpiredModalProps) => {
  const handleSelectPlan = (plan: 'basico' | 'completo') => {
    // TODO: Implement Stripe checkout
    console.log(`Selected plan: ${plan}`);
    // For now, just close the modal
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <DialogTitle className="text-xl">Seu período gratuito acabou</DialogTitle>
          <DialogDescription className="text-center">
            Você aproveitou 30 dias de acesso gratuito. Para continuar editando seu PDI, 
            escolha um dos planos abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Você ainda pode visualizar seu progresso e navegar pela aplicação, 
            mas para editar é necessário assinar um plano.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Plano Básico */}
            <Card className="border-2 border-muted hover:border-primary/50 transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Básico</CardTitle>
                </div>
                <div className="text-2xl font-bold">
                  R$ 29<span className="text-sm font-normal text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>1 insight por mês</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Plano de Vida ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Todas as ferramentas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Construção Guiada</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => handleSelectPlan('basico')}
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>

            {/* Plano Completo */}
            <Card className="border-2 border-primary hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                Recomendado
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Completo</CardTitle>
                </div>
                <div className="text-2xl font-bold">
                  R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Insights ilimitados</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Plano de Vida ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Todas as ferramentas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Notificações e-mail e WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Construção Guiada</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Gerar relatórios PDF</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleSelectPlan('completo')}
                  disabled
                >
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Os planos pagos estarão disponíveis em breve!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
