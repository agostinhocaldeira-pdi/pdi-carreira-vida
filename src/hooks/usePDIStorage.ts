/**
 * usePDIStorage - Unified storage hook for PDI data
 * 
 * Uses Supabase for all storage operations, checking authentication
 * on each call to prevent race conditions.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseStorageService } from '@/services/storage/SupabaseStorageService';
import { storageService } from '@/services/storage/StorageService';
import type {
  DiarioEntry,
  Objetivo,
  Meta,
  AreaVida,
  Habilidade,
  SwotAnalysis,
  CrencaTrabalho,
  EisenhowerTasks,
} from '@/types/pdi';

// Helper to check auth status on each call (prevents race conditions)
async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; userId: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  return { isAuthenticated: !!user, userId: user?.id || null };
}

export function usePDIStorage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUserId(user?.id || null);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      setUserId(session?.user?.id || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ============================================
  // VVD
  // ============================================
  const getVvd = useCallback(async (): Promise<string> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      const data = await supabaseStorageService.getVvd();
      return data?.vvd_text || '';
    }
    return storageService.getVvd();
  }, []);

  const saveVvd = useCallback(async (vvd: string): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveVvd({ vvd_text: vvd });
    } else {
      storageService.saveVvd(vvd);
    }
  }, []);

  // ============================================
  // VALORES
  // ============================================
  const getValores = useCallback(async (): Promise<string[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getValores();
    }
    return storageService.getMeusValores();
  }, []);

  const saveValores = useCallback(async (valores: string[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveValores(valores);
    } else {
      storageService.saveMeusValores(valores);
    }
  }, []);

  // ============================================
  // ÁREAS DA VIDA
  // ============================================
  const getAreasVida = useCallback(async (): Promise<AreaVida[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getAreasVida();
    }
    return storageService.getAreasVida();
  }, []);

  const saveAreasVida = useCallback(async (areas: AreaVida[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveAreasVida(areas);
    } else {
      storageService.saveAreasVida(areas);
    }
  }, []);

  // ============================================
  // OBJETIVOS
  // ============================================
  const getObjetivos = useCallback(async (): Promise<Objetivo[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getObjetivos();
    }
    return storageService.getObjetivos();
  }, []);

  const saveObjetivos = useCallback(async (objetivos: Objetivo[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveObjetivos(objetivos);
    } else {
      storageService.saveObjetivos(objetivos);
    }
  }, []);

  // ============================================
  // METAS
  // ============================================
  const getMetas = useCallback(async (): Promise<Meta[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getMetas();
    }
    return storageService.getMetas();
  }, []);

  const saveMetas = useCallback(async (metas: Meta[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveMetas(metas);
    } else {
      storageService.saveMetas(metas);
    }
  }, []);

  // ============================================
  // DIÁRIO
  // ============================================
  const getDiario = useCallback(async (): Promise<DiarioEntry[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getDiario();
    }
    return storageService.getDiario();
  }, []);

  const getDiarioByDate = useCallback(async (date: string): Promise<DiarioEntry | null> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getDiarioByDate(date);
    }
    return storageService.getDiarioByDate(date) || null;
  }, []);

  const saveDiarioEntry = useCallback(async (entry: DiarioEntry): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveDiarioEntry(entry);
    } else {
      storageService.saveDiarioEntry(entry);
    }
  }, []);

  // ============================================
  // HABILIDADES (Strengths/Weaknesses)
  // ============================================
  const getHabilidades = useCallback(async (): Promise<Habilidade[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getHabilidades();
    }
    return storageService.getHabilidades();
  }, []);

  const saveHabilidades = useCallback(async (habilidades: Habilidade[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveHabilidades(habilidades);
    } else {
      storageService.saveHabilidades(habilidades);
    }
  }, []);

  // ============================================
  // SWOT
  // ============================================
  const getSwotAnalysis = useCallback(async (): Promise<SwotAnalysis | null> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getSwotAnalysis();
    }
    return storageService.getSwotAnalysis();
  }, []);

  const saveSwotAnalysis = useCallback(async (swot: SwotAnalysis): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveSwotAnalysis(swot);
    } else {
      storageService.saveSwotAnalysis(swot);
    }
  }, []);

  // ============================================
  // CRENÇAS
  // ============================================
  const getCrencas = useCallback(async (): Promise<CrencaTrabalho[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getCrencas();
    }
    return storageService.getCrencas();
  }, []);

  const saveCrencas = useCallback(async (crencas: CrencaTrabalho[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveCrencas(crencas);
    } else {
      storageService.saveCrencas(crencas);
    }
  }, []);

  // ============================================
  // EISENHOWER
  // ============================================
  const getEisenhowerTasks = useCallback(async (): Promise<EisenhowerTasks> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getEisenhowerTasks();
    }
    return storageService.getEisenhowerTasks();
  }, []);

  const saveEisenhowerTasks = useCallback(async (tasks: EisenhowerTasks): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveEisenhowerTasks(tasks);
    } else {
      storageService.saveEisenhowerTasks(tasks);
    }
  }, []);

  // ============================================
  // INSIGHTS
  // ============================================
  const getUserInsight = useCallback(async (): Promise<{ insight: string; date: string } | null> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      const data = await supabaseStorageService.getUserInsight();
      if (data) {
        return { insight: data.insight_text, date: data.generated_at };
      }
      return null;
    }
    const insight = storageService.getUserInsight();
    const date = storageService.getLastInsightDate();
    return insight ? { insight, date } : null;
  }, []);

  const saveUserInsight = useCallback(async (insight: string): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveUserInsight(insight);
    } else {
      storageService.saveUserInsight(insight);
      storageService.saveLastInsightDate(new Date().toISOString());
    }
  }, []);

  // ============================================
  // SKILLS (Competências)
  // ============================================
  const getSkills = useCallback(async (): Promise<string[]> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      return await supabaseStorageService.getSkills();
    }
    // For localStorage, skills are stored differently - extract from habilidades
    const habs = storageService.getHabilidades();
    return habs.filter(h => h.tipo === 'forte').map(h => h.texto);
  }, []);

  const saveSkills = useCallback(async (skills: string[]): Promise<void> => {
    const { isAuthenticated: isAuth } = await checkAuthStatus();
    if (isAuth) {
      await supabaseStorageService.saveSkills(skills);
    }
    // localStorage doesn't have separate skills storage
  }, []);

  return {
    isAuthenticated,
    userId,
    loading,
    // VVD
    getVvd,
    saveVvd,
    // Valores
    getValores,
    saveValores,
    // Áreas da Vida
    getAreasVida,
    saveAreasVida,
    // Objetivos
    getObjetivos,
    saveObjetivos,
    // Metas
    getMetas,
    saveMetas,
    // Diário
    getDiario,
    getDiarioByDate,
    saveDiarioEntry,
    // Habilidades
    getHabilidades,
    saveHabilidades,
    // SWOT
    getSwotAnalysis,
    saveSwotAnalysis,
    // Crenças
    getCrencas,
    saveCrencas,
    // Eisenhower
    getEisenhowerTasks,
    saveEisenhowerTasks,
    // Insights
    getUserInsight,
    saveUserInsight,
    // Skills
    getSkills,
    saveSkills,
  };
}
