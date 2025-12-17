/**
 * StorageService - Centralized data storage abstraction layer
 * 
 * This service centralizes all data storage operations.
 * Currently uses localStorage, but is structured for easy migration to Supabase.
 * 
 * To migrate to Supabase:
 * 1. Import supabase client
 * 2. Replace localStorage calls with supabase queries
 * 3. Add user_id filtering based on auth.uid()
 */

import type {
  DiarioEntry,
  Objetivo,
  Meta,
  AreaVida,
  Valor,
  Habilidade,
  UserInsight,
  SwotAnalysis,
  Autoavaliacao360,
  CrencaTrabalho,
  EisenhowerTasks,
  SatisfactionSurvey,
  Administrator,
} from '@/types/pdi';

// Storage keys - centralized for easy reference
export const STORAGE_KEYS = {
  // PDI Core
  DIARIO: 'diario',
  OBJETIVOS: 'objetivos',
  METAS: 'metas',
  VVD: 'vvd',
  VALORES: 'valores',
  MEUS_VALORES: 'meus_valores',
  AREAS_VIDA: 'areasVida',
  HABILIDADES: 'habilidades',
  
  // Insights
  USER_INSIGHT: 'userInsight',
  LAST_INSIGHT_DATE: 'lastInsightDate',
  
  // Tools
  ANALISE_SWOT: 'analise_swot',
  AUTOAVALIACAO_ANSWERS: 'autoavaliacao360_answers',
  AUTOAVALIACAO_RESPONSES: 'autoavaliacao360_current_responses',
  AUTOAVALIACAO_ANALYSIS: 'autoavaliacao360_ai_analysis',
  AUTOAVALIACAO_HISTORY: 'autoavaliacao360_history',
  AUTOAVALIACAO_LAST_USED: 'autoavaliacao360_last_used',
  CRENCAS: 'crencas_trabalho',
  EISENHOWER_TASKS: 'eisenhowerTasks',
  
  // System
  ADMINISTRATORS: 'administrators',
  SATISFACTION_SURVEYS: 'satisfaction_surveys',
  COMPLETED_SECTIONS: 'completed_sections',
  
  // User
  USER: 'user',
  USER_EMAIL: 'userEmail',
  LANGUAGE: 'language',
  
  // Company (will be deprecated when fully migrated to Supabase)
  COMPANIES: 'companies',
} as const;

/**
 * Generic storage operations
 * These will be replaced with Supabase queries in the future
 */
class StorageService {
  // ============================================
  // GENERIC HELPERS
  // ============================================
  
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getString(key: string, defaultValue: string = ''): string {
    return localStorage.getItem(key) || defaultValue;
  }

  private setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // ============================================
  // DIÁRIO
  // Future: SELECT * FROM diario WHERE user_id = auth.uid()
  // ============================================
  
  getDiario(): DiarioEntry[] {
    return this.getItem<DiarioEntry[]>(STORAGE_KEYS.DIARIO, []);
  }

  saveDiario(entries: DiarioEntry[]): void {
    this.setItem(STORAGE_KEYS.DIARIO, entries);
  }

  getDiarioByDate(date: string): DiarioEntry | undefined {
    const entries = this.getDiario();
    return entries.find(e => e.data === date);
  }

  saveDiarioEntry(entry: DiarioEntry): void {
    const entries = this.getDiario();
    const existingIndex = entries.findIndex(e => e.data === entry.data);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entries[existingIndex], ...entry };
    } else {
      entries.push(entry);
    }
    
    this.saveDiario(entries);
  }

  // ============================================
  // OBJETIVOS
  // Future: SELECT * FROM objetivos WHERE user_id = auth.uid()
  // ============================================
  
  getObjetivos(): Objetivo[] {
    return this.getItem<Objetivo[]>(STORAGE_KEYS.OBJETIVOS, []);
  }

  saveObjetivos(objetivos: Objetivo[]): void {
    this.setItem(STORAGE_KEYS.OBJETIVOS, objetivos);
  }

  // ============================================
  // METAS
  // Future: SELECT * FROM metas WHERE user_id = auth.uid()
  // ============================================
  
  getMetas(): Meta[] {
    return this.getItem<Meta[]>(STORAGE_KEYS.METAS, []);
  }

  saveMetas(metas: Meta[]): void {
    this.setItem(STORAGE_KEYS.METAS, metas);
  }

  deleteMeta(metaId: string | number): void {
    const metas = this.getMetas();
    const filteredMetas = metas.filter(m => String(m.id) !== String(metaId));
    this.saveMetas(filteredMetas);
  }

  // ============================================
  // VVD (Visão de Vida Desejada)
  // Future: SELECT vvd FROM user_vvd WHERE user_id = auth.uid()
  // ============================================
  
  getVvd(): string {
    return this.getString(STORAGE_KEYS.VVD);
  }

  saveVvd(vvd: string): void {
    this.setString(STORAGE_KEYS.VVD, vvd);
  }

  // ============================================
  // VALORES
  // Future: SELECT * FROM user_valores WHERE user_id = auth.uid()
  // ============================================
  
  getValores(): Valor[] {
    return this.getItem<Valor[]>(STORAGE_KEYS.VALORES, []);
  }

  saveValores(valores: Valor[]): void {
    this.setItem(STORAGE_KEYS.VALORES, valores);
  }

  getMeusValores(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.MEUS_VALORES, []);
  }

  saveMeusValores(valores: string[]): void {
    this.setItem(STORAGE_KEYS.MEUS_VALORES, valores);
  }

  // ============================================
  // ÁREAS DA VIDA (Roda da Vida)
  // Future: SELECT * FROM user_areas_vida WHERE user_id = auth.uid()
  // ============================================
  
  getAreasVida(): AreaVida[] {
    return this.getItem<AreaVida[]>(STORAGE_KEYS.AREAS_VIDA, []);
  }

  saveAreasVida(areas: AreaVida[]): void {
    this.setItem(STORAGE_KEYS.AREAS_VIDA, areas);
  }

  // ============================================
  // HABILIDADES
  // Future: SELECT * FROM user_habilidades WHERE user_id = auth.uid()
  // ============================================
  
  getHabilidades(): Habilidade[] {
    return this.getItem<Habilidade[]>(STORAGE_KEYS.HABILIDADES, []);
  }

  saveHabilidades(habilidades: Habilidade[]): void {
    this.setItem(STORAGE_KEYS.HABILIDADES, habilidades);
  }

  // ============================================
  // INSIGHTS
  // Future: SELECT * FROM user_insights WHERE user_id = auth.uid()
  // ============================================
  
  getUserInsight(): string {
    return this.getString(STORAGE_KEYS.USER_INSIGHT);
  }

  saveUserInsight(insight: string): void {
    this.setString(STORAGE_KEYS.USER_INSIGHT, insight);
  }

  getLastInsightDate(): string {
    return this.getString(STORAGE_KEYS.LAST_INSIGHT_DATE);
  }

  saveLastInsightDate(date: string): void {
    this.setString(STORAGE_KEYS.LAST_INSIGHT_DATE, date);
  }

  // ============================================
  // TOOLS - SWOT
  // Future: SELECT * FROM user_swot WHERE user_id = auth.uid()
  // ============================================
  
  getSwotAnalysis(): SwotAnalysis | null {
    return this.getItem<SwotAnalysis | null>(STORAGE_KEYS.ANALISE_SWOT, null);
  }

  saveSwotAnalysis(swot: SwotAnalysis): void {
    this.setItem(STORAGE_KEYS.ANALISE_SWOT, swot);
  }

  // ============================================
  // TOOLS - AUTOAVALIAÇÃO 360
  // Future: Multiple tables for 360 evaluation
  // ============================================
  
  getAutoavaliacaoAnswers(): Record<string, string> {
    return this.getItem<Record<string, string>>(STORAGE_KEYS.AUTOAVALIACAO_ANSWERS, {});
  }

  saveAutoavaliacaoAnswers(answers: Record<string, string>): void {
    this.setItem(STORAGE_KEYS.AUTOAVALIACAO_ANSWERS, answers);
  }

  getAutoavaliacaoResponses(): string {
    return this.getString(STORAGE_KEYS.AUTOAVALIACAO_RESPONSES);
  }

  saveAutoavaliacaoResponses(responses: string): void {
    this.setString(STORAGE_KEYS.AUTOAVALIACAO_RESPONSES, responses);
  }

  getAutoavaliacaoAnalysis(): string {
    return this.getString(STORAGE_KEYS.AUTOAVALIACAO_ANALYSIS);
  }

  saveAutoavaliacaoAnalysis(analysis: string): void {
    this.setString(STORAGE_KEYS.AUTOAVALIACAO_ANALYSIS, analysis);
  }

  getAutoavaliacaoLastUsed(): string {
    return this.getString(STORAGE_KEYS.AUTOAVALIACAO_LAST_USED);
  }

  saveAutoavaliacaoLastUsed(date: string): void {
    this.setString(STORAGE_KEYS.AUTOAVALIACAO_LAST_USED, date);
  }

  // ============================================
  // TOOLS - CRENÇAS
  // Future: SELECT * FROM user_crencas WHERE user_id = auth.uid()
  // ============================================
  
  getCrencas(): CrencaTrabalho[] {
    return this.getItem<CrencaTrabalho[]>(STORAGE_KEYS.CRENCAS, []);
  }

  saveCrencas(crencas: CrencaTrabalho[]): void {
    this.setItem(STORAGE_KEYS.CRENCAS, crencas);
  }

  // ============================================
  // TOOLS - EISENHOWER
  // Future: SELECT * FROM user_eisenhower WHERE user_id = auth.uid()
  // ============================================
  
  getEisenhowerTasks(): EisenhowerTasks {
    return this.getItem<EisenhowerTasks>(STORAGE_KEYS.EISENHOWER_TASKS, {
      urgente_importante: [],
      nao_urgente_importante: [],
      urgente_nao_importante: [],
      nao_urgente_nao_importante: [],
    });
  }

  saveEisenhowerTasks(tasks: EisenhowerTasks): void {
    this.setItem(STORAGE_KEYS.EISENHOWER_TASKS, tasks);
  }

  // ============================================
  // SYSTEM - ADMINISTRATORS
  // Future: SELECT * FROM administrators
  // ============================================
  
  getAdministrators(): Administrator[] {
    return this.getItem<Administrator[]>(STORAGE_KEYS.ADMINISTRATORS, []);
  }

  saveAdministrators(admins: Administrator[]): void {
    this.setItem(STORAGE_KEYS.ADMINISTRATORS, admins);
  }

  // ============================================
  // SYSTEM - SATISFACTION SURVEYS
  // Future: INSERT INTO satisfaction_surveys
  // ============================================
  
  getSatisfactionSurveys(): SatisfactionSurvey[] {
    return this.getItem<SatisfactionSurvey[]>(STORAGE_KEYS.SATISFACTION_SURVEYS, []);
  }

  saveSatisfactionSurvey(survey: SatisfactionSurvey): void {
    const surveys = this.getSatisfactionSurveys();
    surveys.push(survey);
    this.setItem(STORAGE_KEYS.SATISFACTION_SURVEYS, surveys);
  }

  // ============================================
  // USER DATA
  // Future: Use Supabase Auth + profiles table
  // ============================================
  
  getCurrentUser(): Record<string, any> | null {
    return this.getItem<Record<string, any> | null>(STORAGE_KEYS.USER, null);
  }

  saveCurrentUser(user: Record<string, any>): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  getUserEmail(): string {
    return this.getString(STORAGE_KEYS.USER_EMAIL);
  }

  saveUserEmail(email: string): void {
    this.setString(STORAGE_KEYS.USER_EMAIL, email);
  }

  // ============================================
  // PREFERENCES
  // ============================================
  
  getLanguage(): string {
    return this.getString(STORAGE_KEYS.LANGUAGE, 'pt');
  }

  saveLanguage(lang: string): void {
    this.setString(STORAGE_KEYS.LANGUAGE, lang);
  }

  getCompletedSections(): Record<string, boolean> {
    return this.getItem<Record<string, boolean>>(STORAGE_KEYS.COMPLETED_SECTIONS, {});
  }

  saveCompletedSections(sections: Record<string, boolean>): void {
    this.setItem(STORAGE_KEYS.COMPLETED_SECTIONS, sections);
  }
}

// Export singleton instance
export const storageService = new StorageService();
