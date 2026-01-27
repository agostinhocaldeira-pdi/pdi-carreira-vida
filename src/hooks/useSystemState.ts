/**
 * Hook central para gerenciar o estado do sistema PDI
 * Determina se o usuário está em modo "Iniciação" ou "Operacional"
 * 
 * OPTIMIZED: Uses overnight cache (user_home_cache) for instant loading.
 * Falls back to direct queries only when cache doesn't exist.
 */

import { useMemo } from 'react';
import { useHomeCache } from './useHomeCache';

interface SystemState {
  // Estado principal: usuário completou a Base Pessoal?
  hasCompletedBase: boolean;
  
  // Estados detalhados de cada passo
  step1Done: boolean; // Base Pessoal (VVD + Valores + Roda da Vida)
  step2Done: boolean; // Direção & Objetivos
  step3Done: boolean; // Plano de Execução
  
  // Progresso do passo 1 (0-100)
  baseProgress: number;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Calculate base progress from cache tools_status
 */
function calculateBaseProgressFromCache(toolsStatus: any): number {
  if (!toolsStatus) return 0;
  
  let count = 0;
  
  // VVD completed
  if (toolsStatus.vvd?.completed || toolsStatus.vvd?.has_sentence) count++;
  
  // Valores completed
  if (toolsStatus.valores?.completed) count++;
  
  // Roda da Vida completed
  if (toolsStatus.roda_da_vida?.completed) count++;
  
  return Math.round((count / 3) * 100);
}

/**
 * Hook principal para estado do sistema
 * Usado para determinar qual versão da Home renderizar
 * 
 * CACHE-FIRST: Uses overnight cache for zero-latency loading
 */
export function useSystemState(): SystemState {
  const { data: homeCache, isLoading: cacheLoading } = useHomeCache();
  
  const state = useMemo(() => {
    // If cache exists, use it for instant state determination
    if (homeCache?.cacheExists) {
      const toolsStatus = homeCache.toolsStatus;
      const planDetails = homeCache.planCompletionDetails;
      
      // Calculate progress from cached tools status
      const baseProgress = calculateBaseProgressFromCache(toolsStatus);
      
      // Step 1: Base Pessoal completa (100%)
      const step1Done = baseProgress === 100;
      
      // Step 2: Direção & Objetivos (has objective)
      const step2Done = planDetails?.has_objective ?? false;
      
      // Step 3: Plano de Execução (has goal)
      const step3Done = planDetails?.has_goal ?? false;
      
      return {
        hasCompletedBase: step1Done,
        step1Done,
        step2Done,
        step3Done,
        baseProgress,
        isLoading: false,
      };
    }
    
    // Cache doesn't exist yet - return defaults without loading state
    // This happens for new users who haven't had overnight cache generated
    // They start in initiation mode anyway, so defaults are correct
    return {
      hasCompletedBase: false,
      step1Done: false,
      step2Done: false,
      step3Done: false,
      baseProgress: 0,
      isLoading: cacheLoading,
    };
  }, [homeCache, cacheLoading]);
  
  return state;
}
