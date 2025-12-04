import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSubscription, SubscriptionStatus } from '@/hooks/useSubscription';
import { TrialExpiredModal } from '@/components/subscription/TrialExpiredModal';

interface SubscriptionContextType {
  status: SubscriptionStatus;
  plan: 'gratuito' | 'basico' | 'completo' | null;
  daysRemaining: number | null;
  canEdit: boolean;
  showUpgradeModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const subscription = useSubscription();
  const [showModal, setShowModal] = useState(false);
  const [hasShownExpiredModal, setHasShownExpiredModal] = useState(false);

  // Show modal automatically when trial expires (once per session)
  useEffect(() => {
    if (subscription.status === 'expired' && !hasShownExpiredModal) {
      setShowModal(true);
      setHasShownExpiredModal(true);
    }
  }, [subscription.status, hasShownExpiredModal]);

  const showUpgradeModal = () => {
    setShowModal(true);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        status: subscription.status,
        plan: subscription.plan,
        daysRemaining: subscription.daysRemaining,
        canEdit: subscription.canEdit,
        showUpgradeModal,
      }}
    >
      {children}
      <TrialExpiredModal open={showModal} onOpenChange={setShowModal} />
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};
