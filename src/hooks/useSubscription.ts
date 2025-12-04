import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionStatus = 'loading' | 'active' | 'trial' | 'expired';

interface SubscriptionState {
  status: SubscriptionStatus;
  plan: 'gratuito' | 'basico' | 'completo' | null;
  daysRemaining: number | null;
  canEdit: boolean;
}

const TRIAL_DAYS = 30;

export const useSubscription = () => {
  const [state, setState] = useState<SubscriptionState>({
    status: 'loading',
    plan: null,
    daysRemaining: null,
    canEdit: true,
  });

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState({
          status: 'active',
          plan: null,
          daysRemaining: null,
          canEdit: true,
        });
        return;
      }

      // Check if user has admin role (unlimited access)
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some(r => r.role === 'admin');
      const isEmpresa = roles?.some(r => r.role === 'empresa');
      const isGestor = roles?.some(r => r.role === 'gestor');

      // Admins, empresas, and gestores have unlimited access
      if (isAdmin || isEmpresa || isGestor) {
        setState({
          status: 'active',
          plan: 'completo',
          daysRemaining: null,
          canEdit: true,
        });
        return;
      }

      // Check if user is a company employee (exempt from subscription)
      const { data: employeeData } = await supabase
        .from('company_employees')
        .select('is_subscription_exempt')
        .eq('user_id', user.id)
        .single();

      if (employeeData?.is_subscription_exempt) {
        setState({
          status: 'active',
          plan: 'completo',
          daysRemaining: null,
          canEdit: true,
        });
        return;
      }

      // For regular users, check trial period
      // TODO: When subscription system is implemented, check user_subscriptions table first
      
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const diffTime = now.getTime() - createdAt.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, TRIAL_DAYS - diffDays);

      if (diffDays >= TRIAL_DAYS) {
        setState({
          status: 'expired',
          plan: 'gratuito',
          daysRemaining: 0,
          canEdit: false,
        });
      } else {
        setState({
          status: 'trial',
          plan: 'gratuito',
          daysRemaining,
          canEdit: true,
        });
      }
    };

    checkSubscription();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
};
