import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AIFeatureType = 'insight' | 'vvd' | 'smart' | 'autoavaliacao';

interface AIUsageState {
  isLoading: boolean;
  hasAvailablePurchase: boolean;
  pendingPurchaseSessionId: string | null;
}

export const useAIUsage = (featureType: AIFeatureType) => {
  const [state, setState] = useState<AIUsageState>({
    isLoading: false,
    hasAvailablePurchase: false,
    pendingPurchaseSessionId: null,
  });
  const hasCheckedUrlParams = useRef(false);

  // Check if user has an available (paid but unused) purchase
  const checkAvailablePurchase = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return false;

      const { data, error } = await supabase
        .from('user_ai_purchases')
        .select('id')
        .eq('user_id', session.session.user.id)
        .eq('feature_type', featureType)
        .eq('status', 'paid')
        .limit(1);

      if (error) {
        console.error('Error checking AI purchase:', error);
        return false;
      }

      const hasAvailable = (data?.length ?? 0) > 0;
      setState(prev => ({ ...prev, hasAvailablePurchase: hasAvailable }));
      return hasAvailable;
    } catch (error) {
      console.error('Error checking AI purchase:', error);
      return false;
    }
  }, [featureType]);

  // Check and verify any pending purchases that were not verified (e.g., after page refresh)
  const checkAndVerifyPendingPurchases = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      // Get pending purchases with session IDs
      const { data: pendingPurchases, error } = await supabase
        .from('user_ai_purchases')
        .select('id, stripe_session_id')
        .eq('user_id', session.session.user.id)
        .eq('feature_type', featureType)
        .eq('status', 'pending')
        .not('stripe_session_id', 'is', null);

      if (error || !pendingPurchases?.length) return;

      console.log(`[useAIUsage] Found ${pendingPurchases.length} pending purchases to verify`);

      // Try to verify each pending purchase
      for (const purchase of pendingPurchases) {
        if (purchase.stripe_session_id) {
          const { data: verifyResult } = await supabase.functions.invoke('verify-ai-purchase', {
            body: { sessionId: purchase.stripe_session_id, featureType },
          });

          if (verifyResult?.verified) {
            console.log(`[useAIUsage] Successfully verified pending purchase ${purchase.id}`);
            setState(prev => ({ ...prev, hasAvailablePurchase: true }));
            toast.success('Compra confirmada! Você pode usar a IA agora.');
            return; // Stop after first successful verification
          }
        }
      }
    } catch (error) {
      console.error('Error checking pending purchases:', error);
    }
  }, [featureType]);

  // Create a purchase checkout session
  const createPurchase = useCallback(async (returnPath: string): Promise<string | null> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const normalizedReturnPath = returnPath?.startsWith('/') ? returnPath : `/${returnPath}`;

      const { data, error } = await supabase.functions.invoke('create-ai-purchase', {
        body: { featureType, returnPath: normalizedReturnPath },
      });

      if (error) {
        toast.error('Erro ao criar sessão de pagamento');
        console.error('Error creating AI purchase:', error);
        return null;
      }

      if (data?.url) {
        // Store session ID in localStorage for recovery after redirect
        localStorage.setItem(`ai_purchase_session_${featureType}`, data.sessionId);
        setState(prev => ({ ...prev, pendingPurchaseSessionId: data.sessionId }));
        return data.url;
      }

      return null;
    } catch (error) {
      toast.error('Erro ao criar sessão de pagamento');
      console.error('Error creating AI purchase:', error);
      return null;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [featureType]);

  // Verify a purchase after returning from Stripe
  const verifyPurchase = useCallback(async (sessionId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log(`[useAIUsage] Verifying purchase with sessionId: ${sessionId}`);
      
      const { data, error } = await supabase.functions.invoke('verify-ai-purchase', {
        body: { sessionId, featureType },
      });

      if (error) {
        console.error('Error verifying AI purchase:', error);
        toast.error('Erro ao verificar compra. Tente atualizar a página.');
        return false;
      }

      if (data?.verified) {
        // Clear stored session
        localStorage.removeItem(`ai_purchase_session_${featureType}`);
        setState(prev => ({ 
          ...prev, 
          hasAvailablePurchase: true,
          pendingPurchaseSessionId: null,
        }));
        toast.success('Compra confirmada! Você pode usar a IA agora.');
        return true;
      } else {
        console.log('[useAIUsage] Purchase not verified:', data?.reason);
        return false;
      }
    } catch (error) {
      console.error('Error verifying AI purchase:', error);
      toast.error('Erro ao verificar compra. Tente atualizar a página.');
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [featureType]);

  // Consume a purchase (mark as used)
  const consumePurchase = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('consume-ai-purchase', {
        body: { featureType },
      });

      if (error) {
        console.error('Error consuming AI purchase:', error);
        return false;
      }

      if (data?.consumed) {
        setState(prev => ({ ...prev, hasAvailablePurchase: false }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error consuming AI purchase:', error);
      return false;
    }
  }, [featureType]);

  // Check URL params for purchase verification on mount
  useEffect(() => {
    if (hasCheckedUrlParams.current) return;
    hasCheckedUrlParams.current = true;

    const params = new URLSearchParams(window.location.search);
    const aiPurchase = params.get('ai_purchase');
    const sessionId = params.get('session_id');
    const feature = params.get('feature');

    if (aiPurchase === 'success' && sessionId && feature === featureType) {
      console.log(`[useAIUsage] Processing successful AI purchase for ${featureType}`);
      verifyPurchase(sessionId).then((verified) => {
        // Clean up URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      });
    } else if (aiPurchase === 'cancelled' && feature === featureType) {
      toast.info('Compra cancelada');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Check for stored session ID (recovery after page refresh)
      const storedSessionId = localStorage.getItem(`ai_purchase_session_${featureType}`);
      if (storedSessionId) {
        console.log(`[useAIUsage] Found stored session ID for ${featureType}, attempting recovery`);
        verifyPurchase(storedSessionId);
      } else {
        // Check for any pending purchases that might need verification
        checkAndVerifyPendingPurchases();
      }
    }
  }, [featureType, verifyPurchase, checkAndVerifyPendingPurchases]);

  return {
    ...state,
    checkAvailablePurchase,
    createPurchase,
    verifyPurchase,
    consumePurchase,
  };
};
