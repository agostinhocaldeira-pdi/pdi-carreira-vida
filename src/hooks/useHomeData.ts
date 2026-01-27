/**
 * Centralized hook for Home page data
 * OPTIMIZED: Uses pre-computed overnight cache from user_home_cache
 * Falls back to React Query + localStorage when cache unavailable
 */

import { useMemo } from 'react';
import { usePDIData } from './usePDIQueries';
import { useHomeCache } from './useHomeCache';

interface ProgressData {
  objectives: { percentage: number; completed: number; total: number };
  goals: { percentage: number; completed: number; total: number };
  actions: { percentage: number; completed: number; total: number };
}

interface HomeData {
  // PDI data (from overnight cache or React Query fallback)
  objetivos: any[];
  metas: any[];
  vvd: string;
  valores: string[];
  areasVida: any[];
  
  // Computed progress (pre-computed in overnight cache)
  progress: ProgressData;
  
  // Insight data
  insight: string;
  lastInsightDate: string | null;
  
  // Gamification (pre-computed overnight)
  gamification: {
    level: number;
    levelName: string;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
  };
  
  // Loading state
  isLoading: boolean;
  
  // Cache status
  usingCache: boolean;
}

/**
 * Calculate progress percentages from objetivos and metas (fallback)
 */
function calculateProgress(objetivos: any[], metas: any[]): ProgressData {
  const totalObjetivos = objetivos.length;
  const completedObjetivos = objetivos.filter((obj: any) => {
    const status = obj.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
    return status === "concluido" || status === "concluído";
  }).length;
  const objetivosPercentage = totalObjetivos > 0 
    ? Math.round((completedObjetivos / totalObjetivos) * 100) 
    : 0;

  const totalMetas = metas.length;
  const completedMetas = metas.filter((meta: any) => {
    const status = meta.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
    return status === "concluido" || status === "concluído" || meta.concluida === true;
  }).length;
  const metasPercentage = totalMetas > 0 
    ? Math.round((completedMetas / totalMetas) * 100) 
    : 0;

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
 * PRIORITY:
 * 1. Use overnight cache (pre-computed at 3am) for instant load
 * 2. Fall back to React Query + localStorage if cache unavailable
 */
export function useHomeData(): HomeData {
  // Try overnight cache first (most performant)
  const { data: homeCache, isLoading: cacheLoading } = useHomeCache();
  
  // Fallback to direct queries
  const { data: pdiData, isLoading: pdiLoading } = usePDIData();

  // Determine if we're using cache
  const usingCache = homeCache?.cacheExists ?? false;

  // Read insight data once (memoized)
  const insightData = useMemo(() => ({
    insight: homeCache?.insight?.insight_text || localStorage.getItem("userInsight") || "",
    lastInsightDate: homeCache?.insight?.generated_at || localStorage.getItem("lastInsightDate"),
  }), [homeCache?.insight]);

  // Extract data from cache or fallback
  const objetivos = useMemo(() => {
    if (usingCache && homeCache?.objectives?.length) {
      return homeCache.objectives;
    }
    return pdiData?.objetivos || [];
  }, [usingCache, homeCache?.objectives, pdiData?.objetivos]);

  const metas = useMemo(() => {
    if (usingCache && homeCache?.objectives?.length) {
      // Extract metas from cache hierarchy
      const extractedMetas: any[] = [];
      homeCache.objectives.forEach((obj: any) => {
        if (obj.goals) {
          obj.goals.forEach((goal: any) => {
            extractedMetas.push({
              id: goal.id,
              objetivo_id: obj.id,
              texto: goal.texto,
              status: goal.status,
              data_alvo: goal.data_alvo,
              acoes: goal.actions || [],
            });
          });
        }
      });
      return extractedMetas;
    }
    return pdiData?.metas || [];
  }, [usingCache, homeCache?.objectives, pdiData?.metas]);

  const vvd = useMemo(() => {
    if (usingCache) {
      return homeCache?.planoVidaSummary?.para_onde?.vvd_sentence || "";
    }
    return pdiData?.vvd || "";
  }, [usingCache, homeCache?.planoVidaSummary, pdiData?.vvd]);

  const valores = useMemo(() => {
    if (usingCache) {
      return homeCache?.planoVidaSummary?.quem_sou?.top_valores || [];
    }
    return pdiData?.valores || [];
  }, [usingCache, homeCache?.planoVidaSummary, pdiData?.valores]);

  const areasVida = pdiData?.areasVida || [];

  // Use pre-computed progress from cache or calculate
  const progress = useMemo(() => {
    if (usingCache && homeCache?.progress) {
      return {
        objectives: {
          percentage: homeCache.progress.total_objectives > 0 
            ? Math.round((homeCache.progress.completed_objectives / homeCache.progress.total_objectives) * 100) 
            : 0,
          completed: homeCache.progress.completed_objectives,
          total: homeCache.progress.total_objectives,
        },
        goals: {
          percentage: homeCache.progress.total_goals > 0 
            ? Math.round((homeCache.progress.completed_goals / homeCache.progress.total_goals) * 100) 
            : 0,
          completed: homeCache.progress.completed_goals,
          total: homeCache.progress.total_goals,
        },
        actions: {
          percentage: homeCache.progress.total_actions > 0 
            ? Math.round((homeCache.progress.completed_actions / homeCache.progress.total_actions) * 100) 
            : 0,
          completed: homeCache.progress.completed_actions,
          total: homeCache.progress.total_actions,
        },
      };
    }
    return calculateProgress(objetivos, metas);
  }, [usingCache, homeCache?.progress, objetivos, metas]);

  // Gamification from cache
  const gamification = useMemo(() => {
    if (usingCache && homeCache?.gamification) {
      return {
        level: homeCache.gamification.level,
        levelName: homeCache.gamification.level_name,
        totalPoints: homeCache.gamification.total_points,
        currentStreak: homeCache.gamification.current_streak,
        longestStreak: homeCache.gamification.longest_streak,
      };
    }
    // Fallback to localStorage
    const storedStreak = localStorage.getItem('user_streak');
    const streak = storedStreak ? JSON.parse(storedStreak) : {};
    return {
      level: streak.level || 1,
      levelName: streak.level < 5 ? 'Iniciante' : streak.level < 10 ? 'Intermediário' : 'Experiente',
      totalPoints: streak.total_points || 0,
      currentStreak: streak.current_streak || 0,
      longestStreak: streak.longest_streak || 0,
    };
  }, [usingCache, homeCache?.gamification]);

  return {
    objetivos,
    metas,
    vvd,
    valores,
    areasVida,
    progress,
    insight: insightData.insight,
    lastInsightDate: insightData.lastInsightDate,
    gamification,
    isLoading: cacheLoading || pdiLoading,
    usingCache,
  };
}
