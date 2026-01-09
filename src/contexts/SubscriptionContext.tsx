import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSubscription, SubscriptionStatus } from '@/hooks/useSubscription';
import { TrialExpiredModal } from '@/components/subscription/TrialExpiredModal';

interface SubscriptionContextType {
  status: SubscriptionStatus;
  plan: 'gratuito' | 'basico' | 'completo' | null;
  daysRemaining: number | null;
  canEdit: boolean;
  subscriptionEnd: string | null;
  showUpgradeModal: () => void;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const subscription = useSubscription();
  const [showModal, setShowModal] = useState(false);
  const [forceModal, setForceModal] = useState(false);

  // Show modal when trial expires - force it open and prevent closing
  useEffect(() => {
    if (subscription.status === 'expired') {
      setShowModal(true);
      setForceModal(true);
    } else {
      setForceModal(false);
    }
  }, [subscription.status]);

  const showUpgradeModal = () => {
    setShowModal(true);
  };

  const handleModalChange = (open: boolean) => {
    // Only allow closing if not in expired state
    if (!forceModal) {
      setShowModal(open);
    }
  };

  const refreshSubscription = () => {
    subscription.refreshSubscription?.();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        status: subscription.status,
        plan: subscription.plan,
        daysRemaining: subscription.daysRemaining,
        canEdit: subscription.canEdit,
        subscriptionEnd: subscription.subscriptionEnd ?? null,
        showUpgradeModal,
        refreshSubscription,
      }}
    >
      {children}
      <TrialExpiredModal 
        open={showModal} 
        onOpenChange={handleModalChange} 
        forceOpen={forceModal}
      />
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
