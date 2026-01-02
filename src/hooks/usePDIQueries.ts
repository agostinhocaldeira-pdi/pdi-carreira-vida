/**
 * React Query hooks for PDI data with caching and localStorage-first pattern
 * 
 * Pattern: Load instantly from localStorage, then sync with Supabase in background
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseStorageService } from '@/services/storage/SupabaseStorageService';
import { storageService } from '@/services/storage/StorageService';
import { supabase } from '@/integrations/supabase/client';
import type { Objetivo, Meta } from '@/types/pdi';

// Query keys for cache management
export const PDI_QUERY_KEYS = {
  all: ['pdi'] as const,
  pdiData: () => [...PDI_QUERY_KEYS.all, 'data'] as const,
  objetivos: () => [...PDI_QUERY_KEYS.all, 'objetivos'] as const,
  metas: () => [...PDI_QUERY_KEYS.all, 'metas'] as const,
};

// Helper to check auth status
async function checkAuthStatus() {
  const { data: { session } } = await supabase.auth.getSession();
  return { isAuthenticated: !!session?.user, userId: session?.user?.id };
}

/**
 * Hook to get all PDI data (objetivos, metas, vvd, valores, areasVida)
 * Uses localStorage-first pattern for instant loading
 */
export function usePDIData() {
  return useQuery({
    queryKey: PDI_QUERY_KEYS.pdiData(),
    queryFn: async () => {
      const { isAuthenticated } = await checkAuthStatus();
      
      if (isAuthenticated) {
        // Get from Supabase (batch query)
        const data = await supabaseStorageService.getPDIData();
        
        // Update localStorage as backup
        localStorage.setItem('objetivos', JSON.stringify(data.objetivos));
        localStorage.setItem('metas', JSON.stringify(data.metas));
        if (data.vvd) localStorage.setItem('vvd', data.vvd);
        if (data.valores.length > 0) localStorage.setItem('valores', JSON.stringify(data.valores));
        if (data.areasVida.length > 0) localStorage.setItem('areasVida', JSON.stringify(data.areasVida));
        
        return data;
      }
      
      // Fallback to localStorage
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
    // OPTIMIZATION: Increase staleTime to prevent refetch on mount
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    // Don't refetch on window focus - data changes rarely
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
    invalidate: () => queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() }),
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
    invalidate: () => queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() }),
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
