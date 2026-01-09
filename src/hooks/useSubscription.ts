import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionStatus = 'loading' | 'active' | 'trial' | 'expired';

interface SubscriptionState {
  status: SubscriptionStatus;
  plan: 'gratuito' | 'basico' | 'completo' | null;
  daysRemaining: number | null;
  canEdit: boolean;
  subscriptionEnd: string | null;
}

const TRIAL_DAYS = 30;

// Stripe product ID for Plano Básico
const PLANO_BASICO_PRODUCT_ID = "prod_TXWvEwloGWytPs";

// Helper to calculate days remaining in trial
const calculateTrialDaysRemaining = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - diffDays);
};

export const useSubscription = () => {
  const [state, setState] = useState<SubscriptionState>({
    status: 'loading',
    plan: null,
    daysRemaining: null,
    canEdit: true,
    subscriptionEnd: null,
  });

  const checkSubscription = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setState({
        status: 'active',
        plan: null,
        daysRemaining: null,
        canEdit: true,
        subscriptionEnd: null,
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
        subscriptionEnd: null,
      });
      return;
    }

    // Check if user is a company employee (exempt from subscription)
    // IMPORTANT: do NOT use .single() here, because "no rows" or "multiple rows" can trigger 406 and spam the console.
    const { data: employeeRows, error: employeeError } = await supabase
      .from('company_employees')
      .select('is_subscription_exempt')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1);

    if (employeeError) {
      console.warn('[useSubscription] company_employees check failed:', employeeError);
    }

    if (employeeRows?.[0]?.is_subscription_exempt) {
      setState({
        status: 'active',
        plan: 'completo',
        daysRemaining: null,
        canEdit: true,
        subscriptionEnd: null,
      });
      return;
    }

    // Check Stripe subscription status
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.access_token) {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });

        if (!error && data?.subscribed) {
          // User has active Stripe subscription
          const plan = data.product_id === PLANO_BASICO_PRODUCT_ID ? 'basico' : 'completo';
          setState({
            status: 'active',
            plan,
            daysRemaining: null,
            canEdit: true,
            subscriptionEnd: data.subscription_end,
          });
          return;
        }
      }
    } catch (error) {
      console.error('Error checking Stripe subscription:', error);
    }

    // No active Stripe subscription - check trial period based on user creation date
    const userCreatedAt = user.created_at;
    if (userCreatedAt) {
      const daysRemaining = calculateTrialDaysRemaining(userCreatedAt);
      
      if (daysRemaining > 0) {
        // User is still in trial period
        setState({
          status: 'trial',
          plan: 'gratuito',
          daysRemaining,
          canEdit: true,
          subscriptionEnd: null,
        });
        return;
      }
    }

    // Trial expired and no subscription - user must pay
    setState({
      status: 'expired',
      plan: null,
      daysRemaining: 0,
      canEdit: false,
      subscriptionEnd: null,
    });
  }, []);

  useEffect(() => {
    checkSubscription();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    // Refresh subscription status every minute
    const interval = setInterval(checkSubscription, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [checkSubscription]);

  return { ...state, refreshSubscription: checkSubscription };
};
