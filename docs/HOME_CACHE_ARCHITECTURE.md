# Arquitetura de Cache da Home - Processamento Noturno

## Visão Geral

Este documento descreve a estrutura completa de cache para pré-computar dados na madrugada, eliminando latência no carregamento da aplicação durante o dia.

**Última atualização:** 2026-01-15
**Status:** Em implementação

---

## 1. Estrutura da Tabela de Cache

```sql
CREATE TABLE public.user_home_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  
  -- Status do Plano de Vida
  is_plan_complete BOOLEAN DEFAULT FALSE,
  plan_completion_details JSONB,
  /*
    {
      "quem_sou": true,
      "para_onde": true,
      "como_chegar": true,
      "has_objective": true,
      "has_goal": true,
      "has_action": true,
      "has_step": true
    }
  */
  
  -- Subscription / Checkout
  subscription_status TEXT, -- 'trial' | 'active' | 'expired' | 'company_exempt'
  subscription_plan TEXT,   -- 'gratuito' | 'basico' | 'completo'
  subscription_days_remaining INT,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  is_company_employee BOOLEAN DEFAULT FALSE,
  is_company_manager BOOLEAN DEFAULT FALSE,
  company_id UUID,
  
  -- Objetivos, Metas, Ações, Passos (resumo)
  objectives_data JSONB,
  /*
    [
      {
        "id": "uuid",
        "texto": "Ser promovido",
        "status": "em_andamento",
        "is_principal": true,
        "data_alvo": "2026-12-31",
        "conexao_vvd": "Visão",
        "goals": [
          {
            "id": "uuid",
            "texto": "Concluir certificação",
            "status": "em_andamento",
            "data_alvo": "2026-06-30",
            "actions": [
              {
                "id": "uuid",
                "texto": "Estudar 1h por dia",
                "status": "em_andamento",
                "periodicidade": "diaria",
                "steps": [
                  { "id": "uuid", "texto": "Módulo 1", "concluido": true },
                  { "id": "uuid", "texto": "Módulo 2", "concluido": false }
                ]
              }
            ]
          }
        ]
      }
    ]
  */
  
  -- Estatísticas de Progresso
  progress_stats JSONB,
  /*
    {
      "total_objectives": 3,
      "completed_objectives": 1,
      "total_goals": 8,
      "completed_goals": 3,
      "total_actions": 15,
      "completed_actions": 7,
      "total_steps": 42,
      "completed_steps": 28,
      "overall_percentage": 45
    }
  */
  
  -- Gamificação
  gamification_data JSONB,
  /*
    {
      "level": 5,
      "level_name": "Explorador",
      "total_points": 1250,
      "points_to_next_level": 250,
      "current_streak": 7,
      "longest_streak": 15,
      "last_activity_date": "2026-01-11",
      "achievements_count": 12,
      "recent_achievements": [
        { "id": "uuid", "code": "STREAK_7", "name": "Consistência", "unlocked_at": "2026-01-10" }
      ]
    }
  */
  
  -- Diário
  diary_data JSONB,
  /*
    {
      "last_entry_date": "2026-01-11",
      "entries_this_week": 5,
      "entries_this_month": 18,
      "mood_trend": ["feliz", "motivado", "neutro", "feliz", "motivado"],
      "has_entry_today": true
    }
  */
  
  -- Insight Personalizado
  insight_data JSONB,
  /*
    {
      "has_insight": true,
      "insight_text": "Você está no caminho certo...",
      "generated_at": "2026-01-10T03:00:00Z",
      "has_audio": true,
      "audio_url": "https://..."
    }
  */
  
  -- Reflexão Estoica do Dia
  stoic_reflection JSONB,
  /*
    {
      "date": "2026-01-12",
      "title": "Sobre a paciência",
      "content": "A paciência é a companheira da sabedoria...",
      "author": "Santo Agostinho",
      "has_audio": true,
      "audio_url": "https://...",
      "user_response": null
    }
  */
  
  -- Citação do Dia
  daily_quote JSONB,
  /*
    {
      "quote": "O sucesso é a soma de pequenos esforços...",
      "day_of_year": 12
    }
  */
  
  -- Ferramentas Completadas
  tools_status JSONB,
  /*
    {
      "roda_da_vida": { "completed": true, "last_updated": "2026-01-05" },
      "valores": { "completed": true, "count": 5 },
      "vvd": { "completed": true, "has_sentence": true },
      "swot": { "completed": true },
      "crencas": { "completed": true, "count": 3 },
      "autoavaliacao": { "completed": false },
      "eisenhower": { "completed": true, "tasks_count": 8 },
      "smart": { "completed": false }
    }
  */
  
  -- Plano de Vida (resumo das 3 etapas)
  plano_vida_summary JSONB,
  /*
    {
      "quem_sou": {
        "completed": true,
        "life_areas_count": 8,
        "avg_current_score": 6.5,
        "avg_desired_score": 8.2,
        "valores_count": 5,
        "top_valores": ["Família", "Saúde", "Crescimento"]
      },
      "para_onde": {
        "completed": true,
        "vvd_sentence": "Ser referência em...",
        "has_vvd_paragraph": true
      },
      "como_chegar": {
        "completed": true,
        "objectives_count": 3,
        "principal_objective": "Ser promovido a gerente"
      }
    }
  */
  
  -- Agenda (NOVO!)
  agenda_data JSONB,
  /*
    {
      "today_tasks_count": 5,
      "today_completed_count": 2,
      "overdue_tasks_count": 3,
      "upcoming_deadlines": [
        { "id": "uuid", "title": "Meta: Certificação", "date": "2026-01-20", "days_until": 5 }
      ],
      "tasks_by_source": {
        "manual": 3,
        "action": 5,
        "step": 8,
        "goal": 2,
        "objective": 1,
        "eisenhower": 4
      },
      "weekly_completion_rate": 75
    }
  */
  
  -- Notificações pendentes
  pending_notifications JSONB,
  /*
    {
      "unread_count": 3,
      "goal_deadlines_soon": [
        { "goal_id": "uuid", "texto": "Entregar projeto", "days_until": 5 }
      ],
      "missed_diary_days": 2
    }
  */
  
  -- User Roles e Permissões
  user_roles JSONB,
  /*
    {
      "is_admin": false,
      "is_gestor": false,
      "is_empresa": false,
      "roles": ["user"]
    }
  */
  
  -- Integrações ativas
  integrations_status JSONB,
  /*
    {
      "google_calendar": { "connected": true, "last_sync": "2026-01-11" },
      "notion": { "connected": false }
    }
  */
  
  -- OKRs vinculados (para funcionários de empresa)
  okr_links JSONB,
  /*
    [
      {
        "okr_id": "uuid",
        "okr_title": "Aumentar vendas em 20%",
        "linked_objective_id": "uuid",
        "contribution_percentage": 15
      }
    ]
  */
  
  -- Metadados do cache
  cache_version INT DEFAULT 1,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_update_at TIMESTAMP WITH TIME ZONE,
  update_triggered_by TEXT, -- 'cron' | 'user_action' | 'manual'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_user_home_cache_user_id ON public.user_home_cache(user_id);
CREATE INDEX idx_user_home_cache_last_updated ON public.user_home_cache(last_updated_at);

-- RLS
ALTER TABLE public.user_home_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cache"
ON public.user_home_cache FOR SELECT
USING (auth.uid() = user_id);

-- O sistema atualiza via service_role key
```

---

## 2. Edge Function: Processar Cache Noturno

### Localização: `supabase/functions/process-home-cache/index.ts`

A função processa todos os usuários ativos e atualiza o cache com:

1. **Dados do Plano de Vida**
   - Status de conclusão das 3 etapas
   - Roda da Vida, Valores, VVD

2. **Hierarquia de Objetivos**
   - Objetivos → Metas → Ações → Passos
   - Status e datas-alvo

3. **Estatísticas de Progresso**
   - Contagens e percentuais de conclusão

4. **Gamificação**
   - Nível, pontos, streak, conquistas

5. **Diário**
   - Última entrada, frequência, tendência de humor

6. **Agenda (NOVO!)**
   - Tarefas do dia (total e concluídas)
   - Tarefas atrasadas
   - Próximos prazos
   - Taxa de conclusão semanal
   - Distribuição por origem

7. **Reflexão Estoica**
   - Reflexão do dia com áudio

8. **Citação do Dia**
   - Baseada no day_of_year

9. **Status de Ferramentas**
   - Quais ferramentas foram completadas

10. **Notificações**
    - Prazos próximos, dias sem diário

---

## 3. Cron Job

O processamento ocorre às 3h da manhã (horário de Brasília):

```sql
-- Executar às 3h da manhã (horário de Brasília = 6h UTC)
SELECT cron.schedule(
  'process-home-cache-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zlclwweeyrvrgxuukdhl.supabase.co/functions/v1/process-home-cache',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);
```

---

## 4. Atualização em Tempo Real (Triggers)

Para ações críticas que não podem esperar a madrugada:

```sql
-- Trigger genérico para marcar cache como dirty
CREATE OR REPLACE FUNCTION mark_cache_dirty()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_home_cache
  SET 
    last_updated_at = NOW(),
    update_triggered_by = 'user_action'
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar em tabelas críticas
CREATE TRIGGER cache_dirty_on_objective_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_objectives
FOR EACH ROW EXECUTE FUNCTION mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_goal_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_goals
FOR EACH ROW EXECUTE FUNCTION mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_action_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_actions
FOR EACH ROW EXECUTE FUNCTION mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_agenda_change
AFTER INSERT OR UPDATE OR DELETE ON public.agenda_events
FOR EACH ROW EXECUTE FUNCTION mark_cache_dirty();
```

---

## 5. Hook useHomeCache

```typescript
// hooks/useHomeCache.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Objectives hierarchy
  objectives: ObjectiveWithHierarchy[];
  
  // Progress
  progress: {
    totalObjectives: number;
    completedObjectives: number;
    totalGoals: number;
    completedGoals: number;
    totalActions: number;
    completedActions: number;
    totalSteps: number;
    completedSteps: number;
    overallPercentage: number;
  };
  
  // Gamification
  gamification: {
    level: number;
    levelName: string;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
  };
  
  // Diary
  diary: {
    lastEntryDate: string | null;
    hasEntryToday: boolean;
    entriesThisWeek: number;
    moodTrend: string[];
  };
  
  // Agenda (NEW!)
  agenda: {
    todayTasksCount: number;
    todayCompletedCount: number;
    overdueTasksCount: number;
    upcomingDeadlines: Array<{
      id: string;
      title: string;
      date: string;
      daysUntil: number;
    }>;
    weeklyCompletionRate: number;
  };
  
  // Insight
  insight: {
    hasInsight: boolean;
    insightText: string | null;
    hasAudio: boolean;
    audioUrl: string | null;
  };
  
  // Stoic reflection
  stoicReflection: {
    date: string;
    title: string;
    content: string;
    author: string;
    hasAudio: boolean;
    audioUrl: string | null;
  };
  
  // Daily quote
  dailyQuote: string;
  
  // Tools status
  toolsStatus: Record<string, { completed: boolean; count?: number }>;
  
  // Metadata
  lastUpdatedAt: string;
}

export const useHomeCache = () => {
  return useQuery({
    queryKey: ['home-cache'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_home_cache')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // Cache doesn't exist yet, return defaults
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return transformCacheData(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};

function transformCacheData(raw: any): HomeCache {
  return {
    isPlanComplete: raw.is_plan_complete ?? false,
    planCompletionDetails: raw.plan_completion_details ?? {},
    subscriptionStatus: raw.subscription_status ?? 'trial',
    subscriptionPlan: raw.subscription_plan ?? 'gratuito',
    subscriptionDaysRemaining: raw.subscription_days_remaining ?? 0,
    isCompanyEmployee: raw.is_company_employee ?? false,
    isCompanyManager: raw.is_company_manager ?? false,
    objectives: raw.objectives_data ?? [],
    progress: raw.progress_stats ?? {
      totalObjectives: 0,
      completedObjectives: 0,
      totalGoals: 0,
      completedGoals: 0,
      totalActions: 0,
      completedActions: 0,
      totalSteps: 0,
      completedSteps: 0,
      overallPercentage: 0,
    },
    gamification: raw.gamification_data ?? {
      level: 1,
      levelName: 'Iniciante',
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    diary: raw.diary_data ?? {
      lastEntryDate: null,
      hasEntryToday: false,
      entriesThisWeek: 0,
      moodTrend: [],
    },
    agenda: raw.agenda_data ?? {
      todayTasksCount: 0,
      todayCompletedCount: 0,
      overdueTasksCount: 0,
      upcomingDeadlines: [],
      weeklyCompletionRate: 0,
    },
    insight: raw.insight_data ?? {
      hasInsight: false,
      insightText: null,
      hasAudio: false,
      audioUrl: null,
    },
    stoicReflection: raw.stoic_reflection ?? {},
    dailyQuote: raw.daily_quote?.quote ?? '',
    toolsStatus: raw.tools_status ?? {},
    lastUpdatedAt: raw.last_updated_at,
  };
}
```

---

## 6. Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                        MADRUGADA (3h)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  pg_cron    │───►│ process-home-    │───►│ user_home_    │  │
│  │  trigger    │    │ cache function   │    │ cache table   │  │
│  └─────────────┘    └──────────────────┘    └───────────────┘  │
│                              │                                  │
│                              ▼                                  │
│                    ┌──────────────────┐                        │
│                    │ Processa todos   │                        │
│                    │ usuários ativos  │                        │
│                    │ (último login    │                        │
│                    │  < 30 dias)      │                        │
│                    └──────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DURANTE O DIA                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  Usuário    │───►│   useHomeCache   │───►│ user_home_    │  │
│  │  acessa     │    │   hook           │    │ cache table   │  │
│  │  Home       │    │   (1 query!)     │    │ (pré-comp.)   │  │
│  └─────────────┘    └──────────────────┘    └───────────────┘  │
│                                                                 │
│  ┌─────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  Usuário    │───►│   Triggers       │───►│ Marca cache   │  │
│  │  faz ação   │    │   (INSERT/UPDATE)│    │ como "dirty"  │  │
│  │  crítica    │    │                  │    │               │  │
│  └─────────────┘    └──────────────────┘    └───────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Benefícios da Arquitetura

| Aspecto | Antes (atual) | Depois (com cache) |
|---------|---------------|-------------------|
| Queries no login | 15-20 queries | 1 query |
| Tempo de carregamento | 2-5 segundos | < 300ms |
| Carga no banco (pico) | Alta | Mínima |
| Processamento | Cliente | Servidor (madrugada) |
| Consistência | Tempo real | Near-realtime* |
| Dados da Agenda | 8+ queries | Incluído no cache |

*Com triggers para ações críticas

---

## 8. Monitoramento

```sql
-- Tabela de logs do processamento
CREATE TABLE public.cache_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  users_processed INT,
  users_failed INT,
  duration_seconds NUMERIC,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 9. Checklist de Implementação

- [x] Documento de arquitetura atualizado
- [ ] Tabela `user_home_cache` criada
- [ ] Edge Function `process-home-cache` implementada
- [ ] Hook `useHomeCache` implementado
- [ ] Triggers de atualização configurados
- [ ] Componentes da Home atualizados
- [ ] pg_cron configurado
- [ ] Monitoramento implementado
- [ ] Testes realizados

---

## 10. Considerações de Segurança

1. **RLS**: Usuários só podem ler seu próprio cache
2. **Service Role**: Apenas o sistema pode escrever no cache
3. **Dados Sensíveis**: Nenhum dado sensível é armazenado no cache
4. **Validação**: Edge function valida todos os dados antes de inserir
