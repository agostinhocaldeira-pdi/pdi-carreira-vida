/**
 * Hook for reading pre-computed home cache data
 * Replaces multiple queries with a single cache read
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for cache data
export interface ObjectiveHierarchy {
  id: string;
  texto: string;
  status: string;
  is_principal: boolean;
  data_alvo: string | null;
  conexao_vvd: string | null;
  goals: Array<{
    id: string;
    texto: string;
    status: string;
    data_alvo: string | null;
    actions: Array<{
      id: string;
      texto: string;
      status: string;
      periodicidade: string | null;
      steps: Array<{
        id: string;
        texto: string;
        concluido: boolean;
      }>;
    }>;
  }>;
}

export interface ProgressStats {
  total_objectives: number;
  completed_objectives: number;
  total_goals: number;
  completed_goals: number;
  total_actions: number;
  completed_actions: number;
  total_steps: number;
  completed_steps: number;
  overall_percentage: number;
}

export interface GamificationData {
  level: number;
  level_name: string;
  total_points: number;
  points_to_next_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  achievements_count: number;
  recent_achievements: Array<{
    id: string;
    code: string;
    name: string;
    unlocked_at: string;
  }>;
}

export interface DiaryData {
  last_entry_date: string | null;
  entries_this_week: number;
  entries_this_month: number;
  mood_trend: string[];
  has_entry_today: boolean;
}

export interface AgendaData {
  today_tasks_count: number;
  today_completed_count: number;
  overdue_tasks_count: number;
  upcoming_deadlines: Array<{
    id: string;
    title: string;
    date: string;
    daysUntil: number;
  }>;
  tasks_by_source: Record<string, number>;
  weekly_completion_rate: number;
}

export interface InsightData {
  has_insight: boolean;
  insight_text: string | null;
  generated_at: string | null;
  has_audio: boolean;
  audio_url: string | null;
}

export interface StoicReflection {
  date: string;
  title: string;
  has_audio: boolean;
  audio_url: string | null;
  user_response: string | null;
}

export interface ToolsStatus {
  roda_da_vida: { completed: boolean; count?: number };
  valores: { completed: boolean; count?: number };
  vvd: { completed: boolean; has_sentence?: boolean; has_paragraph?: boolean };
  swot: { completed: boolean };
  crencas: { completed: boolean; count?: number };
  autoavaliacao: { completed: boolean };
  eisenhower: { completed: boolean; tasks_count?: number };
  smart: { completed: boolean };
}

export interface PlanoVidaSummary {
  quem_sou: {
    completed: boolean;
    life_areas_count: number;
    avg_current_score: number;
    avg_desired_score: number;
    valores_count: number;
    top_valores: string[];
  };
  para_onde: {
    completed: boolean;
    vvd_sentence: string | null;
    has_vvd_paragraph: boolean;
  };
  como_chegar: {
    completed: boolean;
    objectives_count: number;
    principal_objective: string | null;
  };
}

export interface PendingNotifications {
  unread_count: number;
  goal_deadlines_soon: Array<{
    id: string;
    title: string;
    date: string;
    daysUntil: number;
  }>;
  missed_diary_days: number;
}

export interface UserRoles {
  is_admin: boolean;
  is_gestor: boolean;
  is_empresa: boolean;
  roles: string[];
}

export interface HomeCache {
  // Plan status
  isPlanComplete: boolean;
  planCompletionDetails: {
    quem_sou: boolean;
    para_onde: boolean;
    como_chegar: boolean;
    has_objective: boolean;
    has_goal: boolean;
    has_action: boolean;
    has_step: boolean;
  };
  
  // Subscription
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'company_exempt';
  subscriptionPlan: string;
  subscriptionDaysRemaining: number;
  isCompanyEmployee: boolean;
  isCompanyManager: boolean;
  companyId: string | null;
  
  // Objectives hierarchy
  objectives: ObjectiveHierarchy[];
  
  // Progress
  progress: ProgressStats;
  
  // Gamification
  gamification: GamificationData;
  
  // Diary
  diary: DiaryData;
  
  // Agenda
  agenda: AgendaData;
  
  // Insight
  insight: InsightData;
  
  // Stoic reflection
  stoicReflection: StoicReflection | null;
  
  // Daily quote
  dailyQuote: string;
  
  // Tools status
  toolsStatus: ToolsStatus;
  
  // Plano vida summary
  planoVidaSummary: PlanoVidaSummary;
  
  // Notifications
  pendingNotifications: PendingNotifications;
  
  // User roles
  userRoles: UserRoles;
  
  // Integrations
  integrationsStatus: Record<string, { connected: boolean; last_sync?: string }>;
  
  // OKR links
  okrLinks: Array<{
    okr_id: string;
    okr_title: string;
    linked_objective_id: string;
    contribution_percentage: number;
  }>;
  
  // Metadata
  lastUpdatedAt: string;
  cacheExists: boolean;
}

// Default values for when cache doesn't exist
const defaultCache: HomeCache = {
  isPlanComplete: false,
  planCompletionDetails: {
    quem_sou: false,
    para_onde: false,
    como_chegar: false,
    has_objective: false,
    has_goal: false,
    has_action: false,
    has_step: false,
  },
  subscriptionStatus: 'trial',
  subscriptionPlan: 'gratuito',
  subscriptionDaysRemaining: 0,
  isCompanyEmployee: false,
  isCompanyManager: false,
  companyId: null,
  objectives: [],
  progress: {
    total_objectives: 0,
    completed_objectives: 0,
    total_goals: 0,
    completed_goals: 0,
    total_actions: 0,
    completed_actions: 0,
    total_steps: 0,
    completed_steps: 0,
    overall_percentage: 0,
  },
  gamification: {
    level: 1,
    level_name: 'Iniciante',
    total_points: 0,
    points_to_next_level: 500,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    achievements_count: 0,
    recent_achievements: [],
  },
  diary: {
    last_entry_date: null,
    entries_this_week: 0,
    entries_this_month: 0,
    mood_trend: [],
    has_entry_today: false,
  },
  agenda: {
    today_tasks_count: 0,
    today_completed_count: 0,
    overdue_tasks_count: 0,
    upcoming_deadlines: [],
    tasks_by_source: {},
    weekly_completion_rate: 0,
  },
  insight: {
    has_insight: false,
    insight_text: null,
    generated_at: null,
    has_audio: false,
    audio_url: null,
  },
  stoicReflection: null,
  dailyQuote: '',
  toolsStatus: {
    roda_da_vida: { completed: false },
    valores: { completed: false },
    vvd: { completed: false },
    swot: { completed: false },
    crencas: { completed: false },
    autoavaliacao: { completed: false },
    eisenhower: { completed: false },
    smart: { completed: false },
  },
  planoVidaSummary: {
    quem_sou: {
      completed: false,
      life_areas_count: 0,
      avg_current_score: 0,
      avg_desired_score: 0,
      valores_count: 0,
      top_valores: [],
    },
    para_onde: {
      completed: false,
      vvd_sentence: null,
      has_vvd_paragraph: false,
    },
    como_chegar: {
      completed: false,
      objectives_count: 0,
      principal_objective: null,
    },
  },
  pendingNotifications: {
    unread_count: 0,
    goal_deadlines_soon: [],
    missed_diary_days: 0,
  },
  userRoles: {
    is_admin: false,
    is_gestor: false,
    is_empresa: false,
    roles: ['user'],
  },
  integrationsStatus: {},
  okrLinks: [],
  lastUpdatedAt: '',
  cacheExists: false,
};

function transformCacheData(raw: Record<string, unknown>): HomeCache {
  return {
    isPlanComplete: (raw.is_plan_complete as boolean) ?? false,
    planCompletionDetails: (raw.plan_completion_details as HomeCache['planCompletionDetails']) ?? defaultCache.planCompletionDetails,
    subscriptionStatus: (raw.subscription_status as HomeCache['subscriptionStatus']) ?? 'trial',
    subscriptionPlan: (raw.subscription_plan as string) ?? 'gratuito',
    subscriptionDaysRemaining: (raw.subscription_days_remaining as number) ?? 0,
    isCompanyEmployee: (raw.is_company_employee as boolean) ?? false,
    isCompanyManager: (raw.is_company_manager as boolean) ?? false,
    companyId: (raw.company_id as string) ?? null,
    objectives: (raw.objectives_data as ObjectiveHierarchy[]) ?? [],
    progress: (raw.progress_stats as ProgressStats) ?? defaultCache.progress,
    gamification: (raw.gamification_data as GamificationData) ?? defaultCache.gamification,
    diary: (raw.diary_data as DiaryData) ?? defaultCache.diary,
    agenda: (raw.agenda_data as AgendaData) ?? defaultCache.agenda,
    insight: (raw.insight_data as InsightData) ?? defaultCache.insight,
    stoicReflection: (raw.stoic_reflection as StoicReflection) ?? null,
    dailyQuote: ((raw.daily_quote as Record<string, unknown>)?.quote as string) ?? '',
    toolsStatus: (raw.tools_status as ToolsStatus) ?? defaultCache.toolsStatus,
    planoVidaSummary: (raw.plano_vida_summary as PlanoVidaSummary) ?? defaultCache.planoVidaSummary,
    pendingNotifications: (raw.pending_notifications as PendingNotifications) ?? defaultCache.pendingNotifications,
    userRoles: (raw.user_roles as UserRoles) ?? defaultCache.userRoles,
    integrationsStatus: (raw.integrations_status as Record<string, { connected: boolean; last_sync?: string }>) ?? {},
    okrLinks: (raw.okr_links as HomeCache['okrLinks']) ?? [],
    lastUpdatedAt: (raw.last_updated_at as string) ?? '',
    cacheExists: true,
  };
}

export const useHomeCache = () => {
  return useQuery({
    queryKey: ['home-cache'],
    queryFn: async (): Promise<HomeCache> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_home_cache')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching home cache:', error);
        throw error;
      }
      
      // Cache doesn't exist yet
      if (!data) {
        return { ...defaultCache, cacheExists: false };
      }
      
      return transformCacheData(data as Record<string, unknown>);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};

// Hook to manually refresh cache for current user
export const useRefreshHomeCache = () => {
  const refreshCache = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const response = await supabase.functions.invoke('process-home-cache', {
        body: { user_id: user.id, trigger: 'manual' },
      });
      
      if (response.error) {
        console.error('Error refreshing cache:', response.error);
        throw response.error;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error invoking cache refresh:', error);
      throw error;
    }
  };

  return { refreshCache };
};
