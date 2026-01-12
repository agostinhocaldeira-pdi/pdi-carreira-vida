# Arquitetura de Cache da Home - Processamento Noturno

## Visão Geral

Este documento descreve a estrutura completa de cache para pré-computar dados na madrugada, eliminando latência no carregamento da aplicação durante o dia.

---

## 1. Estrutura da Tabela de Cache

```sql
CREATE TABLE public.user_home_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
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

-- Apenas o sistema (service_role) pode inserir/atualizar
CREATE POLICY "System can manage cache"
ON public.user_home_cache FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');
```

---

## 2. Edge Function: Processar Cache Noturno

```typescript
// supabase/functions/process-home-cache/index.ts

// Função que será chamada pelo cron na madrugada
// Processa todos os usuários ativos e atualiza o cache

// Lógica:
// 1. Busca todos os usuários ativos (logaram nos últimos 30 dias)
// 2. Para cada usuário, calcula todos os dados
// 3. Upsert na tabela user_home_cache
// 4. Log de execução para monitoramento
```

---

## 3. Configuração do Cron (pg_cron)

```sql
-- Executar às 3h da manhã (horário de Brasília = 6h UTC)
SELECT cron.schedule(
  'process-home-cache-daily',
  '0 6 * * *',  -- 6:00 UTC = 3:00 BRT
  $$
  SELECT net.http_post(
    url := 'https://zlclwweeyrvrgxuukdhl.supabase.co/functions/v1/process-home-cache',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ANON_KEY"}'::jsonb,
    body := '{"trigger": "cron", "timestamp": "' || now() || '"}'::jsonb
  );
  $$
);
```

---

## 4. Atualização em Tempo Real (Triggers)

Para não esperar a madrugada quando o usuário fizer ações importantes:

```sql
-- Trigger para atualizar cache quando:
-- 1. Usuário completa o plano de vida
-- 2. Usuário conclui objetivo/meta/ação
-- 3. Mudança no status da assinatura

CREATE OR REPLACE FUNCTION update_home_cache_on_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Marca o cache como "dirty" para atualização prioritária
  -- Ou atualiza campos específicos imediatamente
  UPDATE public.user_home_cache
  SET 
    last_updated_at = NOW(),
    update_triggered_by = 'user_action'
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Uso no Frontend

```typescript
// hooks/useHomeCache.ts

export const useHomeCache = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_home_cache')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    cache: data,
    isLoading,
    isPlanComplete: data?.is_plan_complete ?? false,
    subscriptionStatus: data?.subscription_status,
    objectives: data?.objectives_data ?? [],
    progress: data?.progress_stats,
    gamification: data?.gamification_data,
    // ... demais campos
  };
};
```

---

## 6. Lógica de Roteamento da Home

```typescript
// No App.tsx ou componente de rota

const HomeRouter = () => {
  const { isPlanComplete, isLoading } = useHomeCache();

  if (isLoading) return <LoadingScreen />;

  // Redireciona baseado no cache pré-computado
  return isPlanComplete ? <HomeComplete /> : <Home />;
};
```

---

## 7. Campos a Definir para Nova Home

> **PENDENTE**: Definir quais dados do cache serão exibidos na nova Home (HomeComplete)

### Sugestões de seções para a nova Home:
- [ ] Resumo do progresso geral
- [ ] Objetivo principal em destaque
- [ ] Próximas ações/passos pendentes
- [ ] Streak e gamificação
- [ ] Reflexão estoica do dia
- [ ] Citação do dia
- [ ] Acesso rápido às ferramentas
- [ ] Notificações pendentes
- [ ] Mini calendário com metas

---

## 8. Benefícios da Arquitetura

| Aspecto | Antes (atual) | Depois (com cache) |
|---------|---------------|-------------------|
| Queries no login | 8-12 queries | 1 query |
| Tempo de carregamento | 2-4 segundos | < 500ms |
| Carga no banco (pico) | Alta | Mínima |
| Processamento | Cliente | Servidor (madrugada) |
| Consistência | Tempo real | Near-realtime* |

*Com triggers para ações críticas

---

## 9. Monitoramento

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

## 10. Próximos Passos

1. [ ] Definir layout/componentes da nova Home (HomeComplete)
2. [ ] Definir quais campos do cache são prioritários
3. [ ] Implementar tabela `user_home_cache`
4. [ ] Implementar Edge Function `process-home-cache`
5. [ ] Configurar pg_cron
6. [ ] Implementar triggers para atualização em tempo real
7. [ ] Criar hook `useHomeCache`
8. [ ] Implementar `HomeComplete.tsx`
9. [ ] Atualizar roteamento
10. [ ] Testes e monitoramento
