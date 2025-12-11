/**
 * SupabaseStorageService - Supabase-based storage implementation
 * 
 * This service handles all data persistence using Supabase.
 * Falls back to localStorage for non-authenticated operations.
 */

import { supabase } from '@/integrations/supabase/client';
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

class SupabaseStorageService {
  // ============================================
  // HELPER - Get current user ID
  // ============================================
  
  private async getUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }

  // ============================================
  // VVD (Visão de Vida Desejada)
  // ============================================
  
  async getVvd(): Promise<{ vvd_text: string; vvd_paragraph: string; vvd_sentence: string } | null> {
    const userId = await this.getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('user_vvd')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching VVD:', error);
      return null;
    }
    return data;
  }

  async saveVvd(vvd: { vvd_text?: string; vvd_paragraph?: string; vvd_sentence?: string }): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('user_vvd')
      .upsert({
        user_id: userId,
        ...vvd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) console.error('Error saving VVD:', error);
  }

  // ============================================
  // VALORES
  // ============================================
  
  async getValores(): Promise<string[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_valores')
      .select('valores')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching valores:', error);
      return [];
    }
    return data?.valores || [];
  }

  async saveValores(valores: string[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('user_valores')
      .upsert({
        user_id: userId,
        valores,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) console.error('Error saving valores:', error);
  }

  // ============================================
  // ÁREAS DA VIDA
  // ============================================
  
  async getAreasVida(): Promise<AreaVida[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_life_areas')
      .select('*')
      .eq('user_id', userId)
      .order('position');

    if (error) {
      console.error('Error fetching areas vida:', error);
      return [];
    }

    return (data || []).map((area, index) => ({
      id: index + 1,
      area: area.area_name,
      nota_atual: area.current_score,
      nota_desejada: area.desired_score,
    }));
  }

  async saveAreasVida(areas: AreaVida[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    // Delete existing and insert new
    await supabase.from('user_life_areas').delete().eq('user_id', userId);

    const { error } = await supabase
      .from('user_life_areas')
      .insert(areas.map((area, index) => ({
        user_id: userId,
        area_name: area.area,
        current_score: area.nota_atual,
        desired_score: area.nota_desejada,
        position: index,
      })));

    if (error) console.error('Error saving areas vida:', error);
  }

  // ============================================
  // OBJETIVOS
  // ============================================
  
  async getObjetivos(): Promise<Objetivo[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_objectives')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');

    if (error) {
      console.error('Error fetching objetivos:', error);
      return [];
    }

    return (data || []).map((obj) => ({
      id: obj.id, // Preserve the actual UUID from database
      texto: obj.texto,
      data_alvo: obj.data_alvo,
      conexao_vvd: obj.conexao_vvd,
      status: obj.status?.replace(' ', '-') as any || 'a-fazer',
    }));
  }

  async saveObjetivos(objetivos: Objetivo[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    // For now, we'll do a simple replace strategy
    // In production, you'd want proper upsert logic
    await supabase.from('user_objectives').delete().eq('user_id', userId);

    if (objetivos.length === 0) return;

    const { error } = await supabase
      .from('user_objectives')
      .insert(objetivos.map(obj => ({
        user_id: userId,
        texto: obj.texto,
        data_alvo: obj.data_alvo || null,
        conexao_vvd: obj.conexao_vvd || null,
        status: obj.status?.replace('-', ' ') || 'a fazer',
      })));

    if (error) console.error('Error saving objetivos:', error);
  }

  // ============================================
  // METAS (Goals)
  // ============================================
  
  async getMetas(): Promise<Meta[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data: goals, error: goalsError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');

    if (goalsError) {
      console.error('Error fetching metas:', goalsError);
      return [];
    }

    // Get actions and steps for each goal
    const metas: Meta[] = [];
    for (const goal of goals || []) {
      const { data: actions } = await supabase
        .from('user_actions')
        .select('*')
        .eq('goal_id', goal.id);

      const acoes = (actions || []).map((action, idx) => ({
        id: idx + 1,
        acao: action.texto,
        periodicidade: action.periodicidade || '',
        status: action.status?.replace(' ', '-') as any || 'a-fazer',
      }));

      // Get steps for each action
      const passos: any[] = [];
      for (const action of actions || []) {
        const { data: steps } = await supabase
          .from('user_steps')
          .select('*')
          .eq('action_id', action.id);

        passos.push(...(steps || []).map((step, idx) => ({
          id: idx + 1,
          passo: step.texto,
        })));
      }

      metas.push({
        id: goal.id, // Preserve the actual UUID from database
        objetivo_id: goal.objective_id || '',
        objetivoId: goal.objective_id || '', // camelCase alias for compatibility
        texto: goal.texto,
        data_alvo: goal.data_alvo || '',
        dataAlvo: goal.data_alvo || '', // camelCase alias for compatibility
        concluida: goal.status === 'concluido',
        from_smart: goal.from_smart || false,
        acoes,
        passos,
      });
    }

    return metas;
  }

  async saveMetas(metas: Meta[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    // Clear existing
    await supabase.from('user_goals').delete().eq('user_id', userId);

    for (const meta of metas) {
      // Handle both camelCase and snake_case property names for compatibility
      const objetivoId = meta.objetivo_id || (meta as any).objetivoId || null;
      const dataAlvo = meta.data_alvo || (meta as any).dataAlvo || null;
      
      const { data: goal, error: goalError } = await supabase
        .from('user_goals')
        .insert({
          user_id: userId,
          objective_id: objetivoId,
          texto: meta.texto,
          data_alvo: dataAlvo,
          status: meta.concluida ? 'concluido' : 'a fazer',
          from_smart: meta.from_smart || false,
        })
        .select()
        .single();

      if (goalError || !goal) continue;

      // Save actions
      for (const acao of meta.acoes || []) {
        const { data: action } = await supabase
          .from('user_actions')
          .insert({
            user_id: userId,
            goal_id: goal.id,
            texto: acao.acao,
            periodicidade: acao.periodicidade,
            status: acao.status?.replace('-', ' ') || 'a fazer',
          })
          .select()
          .single();

        // Save steps linked to this action
        if (action && meta.passos) {
          for (const passo of meta.passos) {
            await supabase
              .from('user_steps')
              .insert({
                user_id: userId,
                action_id: action.id,
                texto: passo.passo,
              });
          }
        }
      }
    }
  }

  // ============================================
  // DIÁRIO
  // ============================================
  
  async getDiario(): Promise<DiarioEntry[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (error) {
      console.error('Error fetching diary:', error);
      return [];
    }

    return (data || []).map(entry => ({
      id: entry.id,
      data: entry.entry_date,
      humor: entry.mood || '',
      reflexao: entry.reflections || '',
      conquistas: entry.conquests || '',
      habitos: entry.habits || [],
      gratidao: entry.gratitude || '',
    }));
  }

  async saveDiarioEntry(entry: DiarioEntry): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('diary_entries')
      .upsert({
        user_id: userId,
        entry_date: entry.data,
        mood: entry.humor,
        reflections: entry.reflexao,
        conquests: entry.conquistas,
        habits: entry.habitos,
        gratitude: entry.gratidao,
        daily_progress: '',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,entry_date' });

    if (error) console.error('Error saving diary entry:', error);
  }

  async getDiarioByDate(date: string): Promise<DiarioEntry | null> {
    const userId = await this.getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      data: data.entry_date,
      humor: data.mood || '',
      reflexao: data.reflections || '',
      conquistas: data.conquests || '',
      habitos: data.habits || [],
      gratidao: data.gratitude || '',
    };
  }

  // ============================================
  // HABILIDADES (Skills/Strengths/Weaknesses)
  // ============================================
  
  async getHabilidades(): Promise<Habilidade[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_strengths_weaknesses')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching habilidades:', error);
      return [];
    }

    return (data || []).map((item, idx) => ({
      id: idx + 1,
      tipo: item.type === 'strength' ? 'forte' : 'fraco',
      texto: item.texto,
    }));
  }

  async saveHabilidades(habilidades: Habilidade[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    await supabase.from('user_strengths_weaknesses').delete().eq('user_id', userId);

    if (habilidades.length === 0) return;

    const { error } = await supabase
      .from('user_strengths_weaknesses')
      .insert(habilidades.map(h => ({
        user_id: userId,
        type: h.tipo === 'forte' ? 'strength' : 'weakness',
        texto: h.texto,
      })));

    if (error) console.error('Error saving habilidades:', error);
  }

  // ============================================
  // SWOT
  // ============================================
  
  async getSwotAnalysis(): Promise<SwotAnalysis | null> {
    const userId = await this.getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('user_swot')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      forcas: data.strengths || [],
      fraquezas: data.weaknesses || [],
      oportunidades: data.opportunities || [],
      ameacas: data.threats || [],
    };
  }

  async saveSwotAnalysis(swot: SwotAnalysis): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('user_swot')
      .upsert({
        user_id: userId,
        strengths: swot.forcas,
        weaknesses: swot.fraquezas,
        opportunities: swot.oportunidades,
        threats: swot.ameacas,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) console.error('Error saving SWOT:', error);
  }

  // ============================================
  // CRENÇAS (Beliefs)
  // ============================================
  
  async getCrencas(): Promise<CrencaTrabalho[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_beliefs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at');

    if (error) {
      console.error('Error fetching crencas:', error);
      return [];
    }

    return (data || []).map((belief, idx) => ({
      id: idx + 1,
      crenca_limitante: belief.limiting_belief,
      nova_crenca: belief.new_belief || '',
      reflexoes: (belief.transformation_answers as Record<string, string>) || {},
    }));
  }

  async saveCrencas(crencas: CrencaTrabalho[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    await supabase.from('user_beliefs').delete().eq('user_id', userId);

    if (crencas.length === 0) return;

    const { error } = await supabase
      .from('user_beliefs')
      .insert(crencas.map(c => ({
        user_id: userId,
        limiting_belief: c.crenca_limitante,
        new_belief: c.nova_crenca,
        transformation_answers: c.reflexoes,
      })));

    if (error) console.error('Error saving crencas:', error);
  }

  // ============================================
  // EISENHOWER
  // ============================================
  
  async getEisenhowerTasks(): Promise<EisenhowerTasks> {
    const userId = await this.getUserId();
    const defaultTasks: EisenhowerTasks = {
      urgente_importante: [],
      nao_urgente_importante: [],
      urgente_nao_importante: [],
      nao_urgente_nao_importante: [],
    };

    if (!userId) return defaultTasks;

    const { data, error } = await supabase
      .from('user_eisenhower_tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching eisenhower tasks:', error);
      return defaultTasks;
    }

    const tasks: EisenhowerTasks = { ...defaultTasks };
    const quadrantMap: Record<string, keyof EisenhowerTasks> = {
      'urgent-important': 'urgente_importante',
      'not-urgent-important': 'nao_urgente_importante',
      'urgent-not-important': 'urgente_nao_importante',
      'not-urgent-not-important': 'nao_urgente_nao_importante',
    };
    
    for (const task of data || []) {
      const key = quadrantMap[task.quadrant];
      if (key && Array.isArray(tasks[key])) {
        (tasks[key] as string[]).push(task.task_text);
      }
    }

    return tasks;
  }

  async saveEisenhowerTasks(tasks: EisenhowerTasks): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    await supabase.from('user_eisenhower_tasks').delete().eq('user_id', userId);

    const allTasks: { user_id: string; task_text: string; quadrant: string }[] = [];
    
    const quadrantMapReverse: Record<string, string> = {
      urgente_importante: 'urgent-important',
      nao_urgente_importante: 'not-urgent-important',
      urgente_nao_importante: 'urgent-not-important',
      nao_urgente_nao_importante: 'not-urgent-not-important',
    };

    for (const [key, taskList] of Object.entries(tasks)) {
      const quadrant = quadrantMapReverse[key];
      if (quadrant && Array.isArray(taskList)) {
        for (const task of taskList) {
          allTasks.push({ user_id: userId, task_text: task, quadrant });
        }
      }
    }

    if (allTasks.length > 0) {
      const { error } = await supabase
        .from('user_eisenhower_tasks')
        .insert(allTasks);

      if (error) console.error('Error saving eisenhower tasks:', error);
    }
  }

  // ============================================
  // INSIGHTS
  // ============================================
  
  async getUserInsight(): Promise<{ insight_text: string; generated_at: string } | null> {
    const userId = await this.getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      insight_text: data.insight_text || '',
      generated_at: data.generated_at || '',
    };
  }

  async saveUserInsight(insight: string): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('user_insights')
      .upsert({
        user_id: userId,
        insight_text: insight,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) console.error('Error saving insight:', error);
  }

  // ============================================
  // AUTOAVALIAÇÃO 360
  // ============================================
  
  async getAutoavaliacao(): Promise<{
    self_answers: Record<string, string>;
    feedback_360: string;
    ai_analysis: string;
    last_completed_at: string;
  } | null> {
    const userId = await this.getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('user_self_assessment')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      self_answers: (data.self_answers as Record<string, string>) || {},
      feedback_360: data.feedback_360 || '',
      ai_analysis: data.ai_analysis || '',
      last_completed_at: data.last_completed_at || '',
    };
  }

  async saveAutoavaliacao(data: {
    self_answers?: Record<string, string>;
    feedback_360?: string;
    ai_analysis?: string;
  }): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('user_self_assessment')
      .upsert({
        user_id: userId,
        ...data,
        last_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) console.error('Error saving autoavaliacao:', error);
  }

  // ============================================
  // SKILLS (Competências)
  // ============================================
  
  async getSkills(): Promise<string[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_skills')
      .select('skill_name')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return (data || []).map(s => s.skill_name);
  }

  async saveSkills(skills: string[]): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    await supabase.from('user_skills').delete().eq('user_id', userId);

    if (skills.length === 0) return;

    const { error } = await supabase
      .from('user_skills')
      .insert(skills.map(skill => ({
        user_id: userId,
        skill_name: skill,
      })));

    if (error) console.error('Error saving skills:', error);
  }
}

export const supabaseStorageService = new SupabaseStorageService();
