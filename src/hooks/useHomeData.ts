/**
 * Centralized hook for Home page data
 * Reads localStorage ONCE and provides all data needed by Home components
 * Eliminates redundant localStorage reads across components
 */

import { useMemo } from 'react';
import { usePDIData } from './usePDIQueries';

interface ProgressData {
  objectives: { percentage: number; completed: number; total: number };
  goals: { percentage: number; completed: number; total: number };
  actions: { percentage: number; completed: number; total: number };
}

interface HomeData {
  // PDI data from React Query (with localStorage fallback)
  objetivos: any[];
  metas: any[];
  vvd: string;
  valores: string[];
  areasVida: any[];
  
  // Computed progress
  progress: ProgressData;
  
  // Insight data (read once)
  insight: string;
  lastInsightDate: string | null;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Calculate progress percentages from objetivos and metas
 */
function calculateProgress(objetivos: any[], metas: any[]): ProgressData {
  // Objectives progress
  const totalObjetivos = objetivos.length;
  const completedObjetivos = objetivos.filter((obj: any) => {
    const status = obj.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
    return status === "concluido" || status === "concluído";
  }).length;
  const objetivosPercentage = totalObjetivos > 0 
    ? Math.round((completedObjetivos / totalObjetivos) * 100) 
    : 0;

  // Goals progress
  const totalMetas = metas.length;
  const completedMetas = metas.filter((meta: any) => {
    const status = meta.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
    return status === "concluido" || status === "concluído" || meta.concluida === true;
  }).length;
  const metasPercentage = totalMetas > 0 
    ? Math.round((completedMetas / totalMetas) * 100) 
    : 0;

  // Actions progress
  let totalActions = 0;
  let completedActions = 0;
  metas.forEach((meta: any) => {
    if (meta.acoes && Array.isArray(meta.acoes)) {
      totalActions += meta.acoes.length;
      completedActions += meta.acoes.filter((acao: any) => {
        const status = acao.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        return status === "concluido" || status === "concluído";
      }).length;
    }
  });
  const actionsPercentage = totalActions > 0 
    ? Math.round((completedActions / totalActions) * 100) 
    : 0;

  return {
    objectives: { percentage: objetivosPercentage, completed: completedObjetivos, total: totalObjetivos },
    goals: { percentage: metasPercentage, completed: completedMetas, total: totalMetas },
    actions: { percentage: actionsPercentage, completed: completedActions, total: totalActions },
  };
}

/**
 * Main hook for Home page data
 * - Uses React Query for PDI data (with placeholderData from localStorage)
 * - Computes progress from cached data
 * - Eliminates redundant localStorage reads
 */
export function useHomeData(): HomeData {
  const { data: pdiData, isLoading } = usePDIData();

  // Read insight data once (memoized)
  const insightData = useMemo(() => ({
    insight: localStorage.getItem("userInsight") || "",
    lastInsightDate: localStorage.getItem("lastInsightDate"),
  }), []);

  // Derive data from React Query cache
  const objetivos = pdiData?.objetivos || [];
  const metas = pdiData?.metas || [];
  const vvd = pdiData?.vvd || "";
  const valores = pdiData?.valores || [];
  const areasVida = pdiData?.areasVida || [];

  // Compute progress (memoized based on data)
  const progress = useMemo(
    () => calculateProgress(objetivos, metas),
    [objetivos, metas]
  );

  return {
    objetivos,
    metas,
    vvd,
    valores,
    areasVida,
    progress,
    insight: insightData.insight,
    lastInsightDate: insightData.lastInsightDate,
    isLoading,
  };
}
