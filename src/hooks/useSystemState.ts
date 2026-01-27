/**
 * Hook central para gerenciar o estado do sistema PDI
 * Determina se o usuário está em modo "Iniciação" ou "Operacional"
 * 
 * IMPORTANT: This hook fetches data directly from Supabase to ensure
 * accurate state detection, bypassing the overnight cache which may be stale.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
 * Query key for system state (separate from PDI data cache)
 */
const SYSTEM_STATE_KEY = ['system-state'] as const;

/**
 * Fetch minimal data needed to determine system state
 * This is a lightweight query that runs on every Home load
 */
async function fetchSystemStateData() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    return null;
  }
  
  const userId = session.user.id;
  
  // Fetch only what's needed to determine state (parallel queries)
  const [vvdRes, valoresRes, areasRes, objetivosRes, metasRes] = await Promise.all([
    supabase.from('user_vvd').select('vvd_text, vvd_sentence').eq('user_id', userId).maybeSingle(),
    supabase.from('user_valores').select('valores').eq('user_id', userId).maybeSingle(),
    supabase.from('user_life_areas').select('current_score, desired_score').eq('user_id', userId),
    supabase.from('user_objectives').select('id').eq('user_id', userId).limit(1),
    supabase.from('user_goals').select('id').eq('user_id', userId).limit(1),
  ]);
  
  return {
    // VVD: consider both vvd_text and vvd_sentence as valid
    vvd: vvdRes.data?.vvd_text || vvdRes.data?.vvd_sentence || '',
    valores: valoresRes.data?.valores || [],
    areasVida: areasRes.data || [],
    hasObjective: (objetivosRes.data?.length || 0) > 0,
    hasGoal: (metasRes.data?.length || 0) > 0,
  };
}

/**
 * Calcula o progresso da Base Pessoal (Passo 1)
 * Critérios: VVD preenchido + Valores definidos + Roda da Vida completa
 */
function calculateBaseProgress(
  vvd: string,
  valores: string[],
  areasVida: any[]
): number {
  let count = 0;
  
  // VVD preenchido (vvd_text OR vvd_sentence)
  if (vvd && vvd.trim()) count++;
  
  // Valores definidos (pelo menos um valor não vazio)
  const isValoresComplete = valores.some((v: string) => String(v).trim() !== "");
  if (isValoresComplete) count++;
  
  // Roda da Vida completa (todas as áreas com notas)
  const isAreasComplete =
    areasVida.length > 0 &&
    areasVida.every((area: any) => {
      const notaAtual = area?.current_score ?? area?.notaAtual ?? area?.nota_atual;
      const notaDesejada = area?.desired_score ?? area?.notaDesejada ?? area?.nota_desejada;
      return (
        notaAtual !== null && notaAtual !== undefined &&
        notaDesejada !== null && notaDesejada !== undefined
      );
    });
  if (isAreasComplete) count++;
  
  return Math.round((count / 3) * 100);
}

/**
 * Hook principal para estado do sistema
 * Usado para determinar qual versão da Home renderizar
 * 
 * Uses direct Supabase queries for accuracy (not overnight cache)
 */
export function useSystemState(): SystemState {
  const { data, isLoading } = useQuery({
    queryKey: SYSTEM_STATE_KEY,
    queryFn: fetchSystemStateData,
    staleTime: 1000 * 60 * 2, // 2 minutes - refresh on page focus
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: true, // Re-check when user returns to tab
    refetchOnMount: true, // Always check on component mount
  });
  
  const state = useMemo(() => {
    if (!data) {
      return {
        hasCompletedBase: false,
        step1Done: false,
        step2Done: false,
        step3Done: false,
        baseProgress: 0,
        isLoading,
      };
    }
    
    const { vvd, valores, areasVida, hasObjective, hasGoal } = data;
    
    // Calcular progresso da Base Pessoal
    const baseProgress = calculateBaseProgress(vvd, valores, areasVida);
    
    // Step 1: Base Pessoal completa (100%)
    const step1Done = baseProgress === 100;
    
    // Step 2: Direção & Objetivos (pelo menos um objetivo)
    const step2Done = hasObjective;
    
    // Step 3: Plano de Execução (pelo menos uma meta)
    const step3Done = hasGoal;
    
    return {
      hasCompletedBase: step1Done,
      step1Done,
      step2Done,
      step3Done,
      baseProgress,
      isLoading,
    };
  }, [data, isLoading]);
  
  return state;
}
