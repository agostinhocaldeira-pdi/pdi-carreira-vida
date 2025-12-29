import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, CreditCard, X } from 'lucide-react';
import type { AIFeatureType } from '@/hooks/useAIUsage';

interface AIUsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  isLoading?: boolean;
  featureType: AIFeatureType;
  featureName: string;
}

const featureDescriptions: Record<AIFeatureType, string> = {
  insight: 'gerar um insight personalizado baseado no seu plano de vida',
  vvd: 'criar sua Visão de Vida Desejada com ajuda da IA',
  smart: 'receber feedback da IA sobre sua meta SMART',
  autoavaliacao: 'gerar uma análise completa da sua autoavaliação 360°',
};

export const AIUsageLimitModal: React.FC<AIUsageLimitModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
  isLoading = false,
  featureType,
  featureName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Limite de Uso Atingido
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-2">
            <p>
              Você já utilizou seu uso gratuito de <strong>{featureName}</strong> este período.
            </p>
            <p>
              Para {featureDescriptions[featureType]}, você pode adquirir um uso adicional.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg bg-muted/50 p-4 text-center">
          <div className="text-3xl font-bold text-primary">R$ 10,00</div>
          <div className="text-sm text-muted-foreground mt-1">
            Pagamento único • Uso imediato
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={onPurchase}
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>Processando...</>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Comprar Uso Adicional
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
