import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { PLAN_MODEL } from "@/config/planModel";

interface SubscriptionGateProps {
  children: ReactNode;
  featureName?: string;
}

/**
 * Wraps content that requires an active (paid) subscription.
 * Shows a dialog redirecting to profile/plans when user is on trial or expired.
 * Does NOT change visual appearance — no locks, no grayscale.
 */
export const SubscriptionGate = ({ children, featureName }: SubscriptionGateProps) => {
  const { status } = useSubscriptionContext();
  const navigate = useNavigate();

  // VIP2026: always grant access. Paid model: require active subscription.
  const hasAccess = PLAN_MODEL === 'vip2026' || status === 'active' || status === 'loading';

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            Conteúdo exclusivo para assinantes
          </DialogTitle>
          <DialogDescription className="pt-2 text-base space-y-3">
            <p>
              {featureName 
                ? <><strong>{featureName}</strong> é um recurso exclusivo para assinantes.</>
                : <>Este recurso é exclusivo para assinantes.</>
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Assine o Plano Acesso Completo ou Black para desbloquear Relatórios, Progresso, módulos avançados e muito mais.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button onClick={() => navigate("/perfil")} className="gap-2">
            <Crown className="w-4 h-4" />
            Ver Planos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionGate;
