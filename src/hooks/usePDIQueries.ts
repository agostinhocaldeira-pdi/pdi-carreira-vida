/**
 * React Query hooks for PDI data with overnight cache-first pattern
 * 
 * ARCHITECTURE:
 * 1. PRIMARY: Use pre-computed overnight cache from user_home_cache (3am processing)
 * 2. FALLBACK: Direct Supabase queries if cache doesn't exist
 * 3. INSTANT: localStorage provides immediate placeholder data
 * 
 * This eliminates real-time query latency by using overnight-processed data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseStorageService } from '@/services/storage/SupabaseStorageService';
import { supabase } from '@/integrations/supabase/client';
import type { Objetivo, Meta } from '@/types/pdi';

// Query keys for cache management
export const PDI_QUERY_KEYS = {
  all: ['pdi'] as const,
  pdiData: () => [...PDI_QUERY_KEYS.all, 'data'] as const,
  objetivos: () => [...PDI_QUERY_KEYS.all, 'objetivos'] as const,
  metas: () => [...PDI_QUERY_KEYS.all, 'metas'] as const,
  homeCache: () => ['home-cache'] as const,
};

// Flag to skip overnight cache after a mutation (deletion, save, etc.)
let skipOvernightCache = false;

/**
 * Force the next usePDIData fetch to bypass overnight cache
 * and go directly to Supabase for fresh data.
 */
export function forceDirectFetch() {
  skipOvernightCache = true;
}

// Helper to check auth status
async function checkAuthStatus() {
  const { data: { session } } = await supabase.auth.getSession();
  return { isAuthenticated: !!session?.user, userId: session?.user?.id };
}

/**
 * Extract PDI data from overnight cache hierarchy
 */
function extractPDIFromCache(cacheData: any) {
  const objetivos: any[] = [];
  const metas: any[] = [];
  
  // Extract from objectives_data hierarchy (pre-computed overnight)
  const objectivesData = cacheData.objectives_data || [];
  
  objectivesData.forEach((obj: any) => {
    objetivos.push({
      id: obj.id,
      texto: obj.texto,
      status: obj.status,
      data_alvo: obj.data_alvo,
      conexao_vvd: obj.conexao_vvd,
      is_principal: obj.is_principal,
    });
    
    // Extract goals from hierarchy
    if (obj.goals) {
      obj.goals.forEach((goal: any) => {
        const acoes = (goal.actions || []).map((action: any) => ({
          id: action.id,
          acao: action.texto,
          periodicidade: action.periodicidade,
          status: action.status,
        }));
        
        const passos = (goal.actions || []).flatMap((action: any) => 
          (action.steps || []).map((step: any) => ({
            id: step.id,
            passo: step.texto,
            concluido: step.concluido,
          }))
        );
        
        metas.push({
          id: goal.id,
          objetivo_id: obj.id,
          objetivoId: obj.id,
          texto: goal.texto,
          data_alvo: goal.data_alvo,
          dataAlvo: goal.data_alvo,
          status: goal.status,
          concluida: goal.status === 'concluido',
          acoes,
          passos,
        });
      });
    }
  });
  
  // Extract VVD and values from plano_vida_summary
  const planoVida = cacheData.plano_vida_summary || {};
  // FIXED: Use vvd_text as primary (always filled), vvd_sentence as fallback
  const vvd = planoVida.para_onde?.vvd_text || planoVida.para_onde?.vvd_sentence || '';
  const valores = planoVida.quem_sou?.top_valores || [];
  
  return { objetivos, metas, vvd, valores, areasVida: [] };
}

/**
 * Hook to get all PDI data (objetivos, metas, vvd, valores, areasVida)
 * OPTIMIZED: Uses overnight cache as primary source
 */
export function usePDIData() {
  return useQuery({
    queryKey: PDI_QUERY_KEYS.pdiData(),
    queryFn: async () => {
      const { isAuthenticated, userId } = await checkAuthStatus();
      
      if (isAuthenticated && userId) {
        // PRIORITY 1: Try overnight cache first (fastest, pre-computed at 3am)
        // BUT skip it if a mutation just happened (deletion, save, etc.)
        if (!skipOvernightCache) {
          try {
            const { data: cacheData } = await supabase
              .from('user_home_cache')
              .select('objectives_data, plano_vida_summary')
              .eq('user_id', userId)
              .maybeSingle();
            
            if (cacheData?.objectives_data) {
              console.log('[usePDIData] Using overnight cache');
              const extracted = extractPDIFromCache(cacheData);
              
              // Update localStorage for offline access
              localStorage.setItem('objetivos', JSON.stringify(extracted.objetivos));
              localStorage.setItem('metas', JSON.stringify(extracted.metas));
              if (extracted.vvd) localStorage.setItem('vvd', extracted.vvd);
              if (extracted.valores.length > 0) localStorage.setItem('valores', JSON.stringify(extracted.valores));
              
              return extracted;
            }
          } catch (err) {
            console.warn('[usePDIData] Cache read failed, falling back to direct query');
          }
        } else {
          console.log('[usePDIData] Skipping overnight cache (forced direct fetch)');
          skipOvernightCache = false; // Reset flag after use
        }
        
        // PRIORITY 2: Direct Supabase query (for new users without cache)
        try {
          const data = await supabaseStorageService.getPDIData();

          // Update localStorage as backup
          localStorage.setItem('objetivos', JSON.stringify(data.objetivos));
          localStorage.setItem('metas', JSON.stringify(data.metas));
          if (data.vvd) localStorage.setItem('vvd', data.vvd);
          if (data.valores.length > 0) localStorage.setItem('valores', JSON.stringify(data.valores));
          if (data.areasVida.length > 0) localStorage.setItem('areasVida', JSON.stringify(data.areasVida));

          return data;
        } catch (error) {
          console.error('Erro ao sincronizar PDI (usando backup local):', error);
        }
      }

      // PRIORITY 3: Fallback to localStorage (offline or unauthenticated)
      return {
        objetivos: JSON.parse(localStorage.getItem('objetivos') || '[]'),
        metas: JSON.parse(localStorage.getItem('metas') || '[]'),
        vvd: localStorage.getItem('vvd') || '',
        valores: JSON.parse(localStorage.getItem('valores') || '[]'),
        areasVida: JSON.parse(localStorage.getItem('areasVida') || '[]'),
      };
    },
    // Return localStorage data immediately as placeholder (INSTANT RENDER)
    placeholderData: () => ({
      objetivos: JSON.parse(localStorage.getItem('objetivos') || '[]'),
      metas: JSON.parse(localStorage.getItem('metas') || '[]'),
      vvd: localStorage.getItem('vvd') || '',
      valores: JSON.parse(localStorage.getItem('valores') || '[]'),
      areasVida: JSON.parse(localStorage.getItem('areasVida') || '[]'),
    }),
    // OPTIMIZATION: Long staleTime since data is pre-computed overnight
    staleTime: 1000 * 60 * 15, // 15 minutes (data is stable)
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/**
 * Hook specifically for objetivos with optimistic updates
 */
export function useObjetivos() {
  const queryClient = useQueryClient();
  const { data: pdiData, isLoading } = usePDIData();
  
  const objetivos = pdiData?.objetivos || JSON.parse(localStorage.getItem('objetivos') || '[]');
  
  return {
    objetivos,
    isLoading,
    invalidate: () => { forceDirectFetch(); queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() }); },
  };
}

/**
 * Hook specifically for metas with optimistic updates
 */
export function useMetas() {
  const queryClient = useQueryClient();
  const { data: pdiData, isLoading } = usePDIData();
  
  const metas = pdiData?.metas || JSON.parse(localStorage.getItem('metas') || '[]');
  
  return {
    metas,
    isLoading,
    invalidate: () => { forceDirectFetch(); queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() }); },
  };
}

/**
 * Mutation for saving objetivos with cache invalidation
 */
export function useSaveObjetivo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (objetivos: Objetivo[]) => {
      const { isAuthenticated } = await checkAuthStatus();
      
      // Always update localStorage first (optimistic)
      localStorage.setItem('objetivos', JSON.stringify(objetivos));
      
      if (isAuthenticated) {
        await supabaseStorageService.saveObjetivos(objetivos);
      }
    },
    onSuccess: () => {
      forceDirectFetch();
      queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
    },
  });
}

/**
 * Mutation for saving metas with cache invalidation
 */
export function useSaveMeta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (metas: Meta[]) => {
      const { isAuthenticated } = await checkAuthStatus();
      
      // Always update localStorage first (optimistic)
      localStorage.setItem('metas', JSON.stringify(metas));
      
      if (isAuthenticated) {
        await supabaseStorageService.saveMetas(metas);
      }
    },
    onSuccess: () => {
      forceDirectFetch();
      queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
    },
  });
}

/**
 * Mutation for deleting a meta with cache invalidation
 */
export function useDeleteMeta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (metaId: string | number) => {
      const { isAuthenticated } = await checkAuthStatus();
      
      // Update localStorage first (optimistic)
      const metas = JSON.parse(localStorage.getItem('metas') || '[]');
      const updatedMetas = metas.filter((m: Meta) => String(m.id) !== String(metaId));
      localStorage.setItem('metas', JSON.stringify(updatedMetas));
      
      if (isAuthenticated) {
        await supabaseStorageService.deleteMeta(metaId);
      }
    },
    onSuccess: () => {
      forceDirectFetch();
      queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
    },
  });
}

/**
 * Hook to prefetch PDI data
 */
export function usePrefetchPDIData() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: PDI_QUERY_KEYS.pdiData(),
      queryFn: async () => {
        const { isAuthenticated } = await checkAuthStatus();
        if (isAuthenticated) {
          return supabaseStorageService.getPDIData();
        }
        return {
          objetivos: JSON.parse(localStorage.getItem('objetivos') || '[]'),
          metas: JSON.parse(localStorage.getItem('metas') || '[]'),
          vvd: localStorage.getItem('vvd') || '',
          valores: JSON.parse(localStorage.getItem('valores') || '[]'),
          areasVida: JSON.parse(localStorage.getItem('areasVida') || '[]'),
        };
      },
    });
  };
}
