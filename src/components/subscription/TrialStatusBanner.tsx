import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, Crown } from 'lucide-react';
import { PLAN_MODEL } from '@/config/planModel';

export const TrialStatusBanner = () => {
  const { status, daysRemaining, showUpgradeModal } = useSubscriptionContext();

  // VIP2026: never show trial/expired banners
  if (PLAN_MODEL === 'vip2026') return null;

  if (status === 'loading' || status === 'active') {
    return null;
  }

  if (status === 'expired') {
    return (
      <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-amber-800 dark:text-amber-200">
            Seu período gratuito de 30 dias expirou. A edição está bloqueada.
          </span>
          <Button 
            size="sm" 
            onClick={showUpgradeModal}
            className="w-fit"
          >
            <Crown className="h-4 w-4 mr-1" />
            Ver planos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'trial' && daysRemaining !== null && daysRemaining <= 7) {
    return (
      <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-blue-800 dark:text-blue-200">
            {daysRemaining === 0 
              ? 'Último dia do seu período gratuito!'
              : `Restam ${daysRemaining} dias do seu período gratuito.`}
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={showUpgradeModal}
            className="w-fit"
          >
            Ver planos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
