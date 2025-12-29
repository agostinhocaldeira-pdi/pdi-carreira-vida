import { useState, useCallback, useEffect } from 'react';
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

  // Create a purchase checkout session
  const createPurchase = useCallback(async (returnPath: string): Promise<string | null> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.functions.invoke('create-ai-purchase', {
        body: { featureType, returnPath },
      });

      if (error) {
        toast.error('Erro ao criar sessão de pagamento');
        console.error('Error creating AI purchase:', error);
        return null;
      }

      if (data?.url) {
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
      const { data, error } = await supabase.functions.invoke('verify-ai-purchase', {
        body: { sessionId, featureType },
      });

      if (error) {
        console.error('Error verifying AI purchase:', error);
        return false;
      }

      if (data?.verified) {
        setState(prev => ({ 
          ...prev, 
          hasAvailablePurchase: true,
          pendingPurchaseSessionId: null,
        }));
        toast.success('Compra confirmada! Você pode usar a IA agora.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying AI purchase:', error);
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
    const params = new URLSearchParams(window.location.search);
    const aiPurchase = params.get('ai_purchase');
    const sessionId = params.get('session_id');
    const feature = params.get('feature');

    if (aiPurchase === 'success' && sessionId && feature === featureType) {
      verifyPurchase(sessionId).then((verified) => {
        // Clean up URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      });
    } else if (aiPurchase === 'cancelled') {
      toast.info('Compra cancelada');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [featureType, verifyPurchase]);

  return {
    ...state,
    checkAvailablePurchase,
    createPurchase,
    verifyPurchase,
    consumePurchase,
  };
};
