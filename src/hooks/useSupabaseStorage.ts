/**
 * useSupabaseStorage - React hook for Supabase storage operations
 * 
 * Provides async data fetching and saving with Supabase,
 * with built-in loading states and error handling.
 */

import { useState, useCallback } from 'react';
import { supabaseStorageService } from '@/services/storage/SupabaseStorageService';
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

export function useSupabaseStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic wrapper for async operations
  const withLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // VVD
  // ============================================
  const getVvd = useCallback(() => 
    withLoading(() => supabaseStorageService.getVvd()), [withLoading]);
  
  const saveVvd = useCallback((vvd: { vvd_text?: string; vvd_paragraph?: string; vvd_sentence?: string }) => 
    withLoading(() => supabaseStorageService.saveVvd(vvd)), [withLoading]);

  // ============================================
  // VALORES
  // ============================================
  const getValores = useCallback(() => 
    withLoading(() => supabaseStorageService.getValores()), [withLoading]);
  
  const saveValores = useCallback((valores: string[]) => 
    withLoading(() => supabaseStorageService.saveValores(valores)), [withLoading]);

  // ============================================
  // ÁREAS DA VIDA
  // ============================================
  const getAreasVida = useCallback(() => 
    withLoading(() => supabaseStorageService.getAreasVida()), [withLoading]);
  
  const saveAreasVida = useCallback((areas: AreaVida[]) => 
    withLoading(() => supabaseStorageService.saveAreasVida(areas)), [withLoading]);

  // ============================================
  // OBJETIVOS
  // ============================================
  const getObjetivos = useCallback(() => 
    withLoading(() => supabaseStorageService.getObjetivos()), [withLoading]);
  
  const saveObjetivos = useCallback((objetivos: Objetivo[]) => 
    withLoading(() => supabaseStorageService.saveObjetivos(objetivos)), [withLoading]);

  // ============================================
  // METAS
  // ============================================
  const getMetas = useCallback(() => 
    withLoading(() => supabaseStorageService.getMetas()), [withLoading]);
  
  const saveMetas = useCallback((metas: Meta[]) => 
    withLoading(() => supabaseStorageService.saveMetas(metas)), [withLoading]);

  // ============================================
  // DIÁRIO
  // ============================================
  const getDiario = useCallback(() => 
    withLoading(() => supabaseStorageService.getDiario()), [withLoading]);
  
  const getDiarioByDate = useCallback((date: string) => 
    withLoading(() => supabaseStorageService.getDiarioByDate(date)), [withLoading]);
  
  const saveDiarioEntry = useCallback((entry: DiarioEntry) => 
    withLoading(() => supabaseStorageService.saveDiarioEntry(entry)), [withLoading]);

  // ============================================
  // HABILIDADES
  // ============================================
  const getHabilidades = useCallback(() => 
    withLoading(() => supabaseStorageService.getHabilidades()), [withLoading]);
  
  const saveHabilidades = useCallback((habilidades: Habilidade[]) => 
    withLoading(() => supabaseStorageService.saveHabilidades(habilidades)), [withLoading]);

  // ============================================
  // SWOT
  // ============================================
  const getSwotAnalysis = useCallback(() => 
    withLoading(() => supabaseStorageService.getSwotAnalysis()), [withLoading]);
  
  const saveSwotAnalysis = useCallback((swot: SwotAnalysis) => 
    withLoading(() => supabaseStorageService.saveSwotAnalysis(swot)), [withLoading]);

  // ============================================
  // CRENÇAS
  // ============================================
  const getCrencas = useCallback(() => 
    withLoading(() => supabaseStorageService.getCrencas()), [withLoading]);
  
  const saveCrencas = useCallback((crencas: CrencaTrabalho[]) => 
    withLoading(() => supabaseStorageService.saveCrencas(crencas)), [withLoading]);

  // ============================================
  // EISENHOWER
  // ============================================
  const getEisenhowerTasks = useCallback(() => 
    withLoading(() => supabaseStorageService.getEisenhowerTasks()), [withLoading]);
  
  const saveEisenhowerTasks = useCallback((tasks: EisenhowerTasks) => 
    withLoading(() => supabaseStorageService.saveEisenhowerTasks(tasks)), [withLoading]);

  // ============================================
  // INSIGHTS
  // ============================================
  const getUserInsight = useCallback(() => 
    withLoading(() => supabaseStorageService.getUserInsight()), [withLoading]);
  
  const saveUserInsight = useCallback((insight: string) => 
    withLoading(() => supabaseStorageService.saveUserInsight(insight)), [withLoading]);

  // ============================================
  // AUTOAVALIAÇÃO
  // ============================================
  const getAutoavaliacao = useCallback(() => 
    withLoading(() => supabaseStorageService.getAutoavaliacao()), [withLoading]);
  
  const saveAutoavaliacao = useCallback((data: { 
    self_answers?: Record<string, string>; 
    feedback_360?: string; 
    ai_analysis?: string 
  }) => 
    withLoading(() => supabaseStorageService.saveAutoavaliacao(data)), [withLoading]);

  // ============================================
  // SKILLS
  // ============================================
  const getSkills = useCallback(() => 
    withLoading(() => supabaseStorageService.getSkills()), [withLoading]);
  
  const saveSkills = useCallback((skills: string[]) => 
    withLoading(() => supabaseStorageService.saveSkills(skills)), [withLoading]);

  return {
    loading,
    error,
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
    // Autoavaliação
    getAutoavaliacao,
    saveAutoavaliacao,
    // Skills
    getSkills,
    saveSkills,
  };
}
