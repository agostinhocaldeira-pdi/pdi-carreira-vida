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

    // Plano Gratuito: acesso completo, apenas com limitações de IA
    // No futuro, quando o plano Básico for cobrado, vamos limitar o Gratuito
    setState({
      status: 'active',
      plan: 'gratuito',
      daysRemaining: null,
      canEdit: true,
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
