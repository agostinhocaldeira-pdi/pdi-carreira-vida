/**
 * usePDIStorage - Unified storage hook for PDI data
 * 
 * Automatically uses Supabase for authenticated users,
 * falls back to localStorage for unauthenticated users.
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

export function usePDIStorage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUserId(user?.id || null);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ============================================
  // VVD
  // ============================================
  const getVvd = useCallback(async (): Promise<string> => {
    if (isAuthenticated) {
      const data = await supabaseStorageService.getVvd();
      return data?.vvd_text || '';
    }
    return storageService.getVvd();
  }, [isAuthenticated]);

  const saveVvd = useCallback(async (vvd: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveVvd({ vvd_text: vvd });
    } else {
      storageService.saveVvd(vvd);
    }
  }, [isAuthenticated]);

  // ============================================
  // VALORES
  // ============================================
  const getValores = useCallback(async (): Promise<string[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getValores();
    }
    return storageService.getMeusValores();
  }, [isAuthenticated]);

  const saveValores = useCallback(async (valores: string[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveValores(valores);
    } else {
      storageService.saveMeusValores(valores);
    }
  }, [isAuthenticated]);

  // ============================================
  // ÁREAS DA VIDA
  // ============================================
  const getAreasVida = useCallback(async (): Promise<AreaVida[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getAreasVida();
    }
    return storageService.getAreasVida();
  }, [isAuthenticated]);

  const saveAreasVida = useCallback(async (areas: AreaVida[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveAreasVida(areas);
    } else {
      storageService.saveAreasVida(areas);
    }
  }, [isAuthenticated]);

  // ============================================
  // OBJETIVOS
  // ============================================
  const getObjetivos = useCallback(async (): Promise<Objetivo[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getObjetivos();
    }
    return storageService.getObjetivos();
  }, [isAuthenticated]);

  const saveObjetivos = useCallback(async (objetivos: Objetivo[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveObjetivos(objetivos);
    } else {
      storageService.saveObjetivos(objetivos);
    }
  }, [isAuthenticated]);

  // ============================================
  // METAS
  // ============================================
  const getMetas = useCallback(async (): Promise<Meta[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getMetas();
    }
    return storageService.getMetas();
  }, [isAuthenticated]);

  const saveMetas = useCallback(async (metas: Meta[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveMetas(metas);
    } else {
      storageService.saveMetas(metas);
    }
  }, [isAuthenticated]);

  // ============================================
  // DIÁRIO
  // ============================================
  const getDiario = useCallback(async (): Promise<DiarioEntry[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getDiario();
    }
    return storageService.getDiario();
  }, [isAuthenticated]);

  const getDiarioByDate = useCallback(async (date: string): Promise<DiarioEntry | null> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getDiarioByDate(date);
    }
    return storageService.getDiarioByDate(date) || null;
  }, [isAuthenticated]);

  const saveDiarioEntry = useCallback(async (entry: DiarioEntry): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveDiarioEntry(entry);
    } else {
      storageService.saveDiarioEntry(entry);
    }
  }, [isAuthenticated]);

  // ============================================
  // HABILIDADES (Strengths/Weaknesses)
  // ============================================
  const getHabilidades = useCallback(async (): Promise<Habilidade[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getHabilidades();
    }
    return storageService.getHabilidades();
  }, [isAuthenticated]);

  const saveHabilidades = useCallback(async (habilidades: Habilidade[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveHabilidades(habilidades);
    } else {
      storageService.saveHabilidades(habilidades);
    }
  }, [isAuthenticated]);

  // ============================================
  // SWOT
  // ============================================
  const getSwotAnalysis = useCallback(async (): Promise<SwotAnalysis | null> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getSwotAnalysis();
    }
    return storageService.getSwotAnalysis();
  }, [isAuthenticated]);

  const saveSwotAnalysis = useCallback(async (swot: SwotAnalysis): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveSwotAnalysis(swot);
    } else {
      storageService.saveSwotAnalysis(swot);
    }
  }, [isAuthenticated]);

  // ============================================
  // CRENÇAS
  // ============================================
  const getCrencas = useCallback(async (): Promise<CrencaTrabalho[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getCrencas();
    }
    return storageService.getCrencas();
  }, [isAuthenticated]);

  const saveCrencas = useCallback(async (crencas: CrencaTrabalho[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveCrencas(crencas);
    } else {
      storageService.saveCrencas(crencas);
    }
  }, [isAuthenticated]);

  // ============================================
  // EISENHOWER
  // ============================================
  const getEisenhowerTasks = useCallback(async (): Promise<EisenhowerTasks> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getEisenhowerTasks();
    }
    return storageService.getEisenhowerTasks();
  }, [isAuthenticated]);

  const saveEisenhowerTasks = useCallback(async (tasks: EisenhowerTasks): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveEisenhowerTasks(tasks);
    } else {
      storageService.saveEisenhowerTasks(tasks);
    }
  }, [isAuthenticated]);

  // ============================================
  // INSIGHTS
  // ============================================
  const getUserInsight = useCallback(async (): Promise<{ insight: string; date: string } | null> => {
    if (isAuthenticated) {
      const data = await supabaseStorageService.getUserInsight();
      if (data) {
        return { insight: data.insight_text, date: data.generated_at };
      }
      return null;
    }
    const insight = storageService.getUserInsight();
    const date = storageService.getLastInsightDate();
    return insight ? { insight, date } : null;
  }, [isAuthenticated]);

  const saveUserInsight = useCallback(async (insight: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveUserInsight(insight);
    } else {
      storageService.saveUserInsight(insight);
      storageService.saveLastInsightDate(new Date().toISOString());
    }
  }, [isAuthenticated]);

  // ============================================
  // SKILLS (Competências)
  // ============================================
  const getSkills = useCallback(async (): Promise<string[]> => {
    if (isAuthenticated) {
      return await supabaseStorageService.getSkills();
    }
    // For localStorage, skills are stored differently - extract from habilidades
    const habs = storageService.getHabilidades();
    return habs.filter(h => h.tipo === 'forte').map(h => h.texto);
  }, [isAuthenticated]);

  const saveSkills = useCallback(async (skills: string[]): Promise<void> => {
    if (isAuthenticated) {
      await supabaseStorageService.saveSkills(skills);
    }
    // localStorage doesn't have separate skills storage
  }, [isAuthenticated]);

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
