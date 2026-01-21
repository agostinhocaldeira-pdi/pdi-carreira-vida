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

// Trial period configuration
const TRIAL_DAYS_NEW_USERS = 30;
const TRIAL_DAYS_LEGACY_USERS = 365; // 1 year for users before cutoff
const LEGACY_CUTOFF_DATE = new Date('2026-01-20T00:00:00Z');

// Stripe product ID for Plano Básico
const PLANO_BASICO_PRODUCT_ID = "prod_TXWvEwloGWytPs";

// Helper to calculate days remaining in trial
const calculateTrialDaysRemaining = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  
  // Determine trial period based on signup date
  const trialDays = created < LEGACY_CUTOFF_DATE 
    ? TRIAL_DAYS_LEGACY_USERS 
    : TRIAL_DAYS_NEW_USERS;
  
  const diffTime = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, trialDays - diffDays);
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

        console.log('[useSubscription] check-subscription response:', { data, error });

        if (error) {
          console.warn('[useSubscription] Error from check-subscription, falling back to trial check:', error);
          // Don't return here - fall through to trial check
        } else if (data?.subscribed) {
          // User has active Stripe subscription
          const plan = data.product_id === PLANO_BASICO_PRODUCT_ID ? 'basico' : 'completo';
          console.log('[useSubscription] User has active subscription:', { plan });
          setState({
            status: 'active',
            plan,
            daysRemaining: null,
            canEdit: true,
            subscriptionEnd: data.subscription_end,
          });
          return;
        } else {
          console.log('[useSubscription] No active subscription, checking trial period');
        }
      }
    } catch (error) {
      console.error('[useSubscription] Error checking Stripe subscription:', error);
      // Don't return here - fall through to trial check
    }

    // No active Stripe subscription - check trial period based on user creation date
    const userCreatedAt = user.created_at;
    console.log('[useSubscription] Checking trial period:', { userCreatedAt });
    
    if (userCreatedAt) {
      const daysRemaining = calculateTrialDaysRemaining(userCreatedAt);
      console.log('[useSubscription] Trial days remaining:', { daysRemaining, userCreatedAt });
      
      if (daysRemaining > 0) {
        // User is still in trial period
        console.log('[useSubscription] User is in trial period');
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
    console.log('[useSubscription] Trial expired - showing payment modal');
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
