-- Tabela principal de cache da Home
CREATE TABLE public.user_home_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  
  -- Status do Plano de Vida
  is_plan_complete BOOLEAN DEFAULT FALSE,
  plan_completion_details JSONB DEFAULT '{}',
  
  -- Subscription / Checkout
  subscription_status TEXT DEFAULT 'trial',
  subscription_plan TEXT DEFAULT 'gratuito',
  subscription_days_remaining INT DEFAULT 0,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  is_company_employee BOOLEAN DEFAULT FALSE,
  is_company_manager BOOLEAN DEFAULT FALSE,
  company_id UUID,
  
  -- Objetivos, Metas, Ações, Passos (resumo)
  objectives_data JSONB DEFAULT '[]',
  
  -- Estatísticas de Progresso
  progress_stats JSONB DEFAULT '{}',
  
  -- Gamificação
  gamification_data JSONB DEFAULT '{}',
  
  -- Diário
  diary_data JSONB DEFAULT '{}',
  
  -- Insight Personalizado
  insight_data JSONB DEFAULT '{}',
  
  -- Reflexão Estoica do Dia
  stoic_reflection JSONB DEFAULT '{}',
  
  -- Citação do Dia
  daily_quote JSONB DEFAULT '{}',
  
  -- Ferramentas Completadas
  tools_status JSONB DEFAULT '{}',
  
  -- Plano de Vida (resumo das 3 etapas)
  plano_vida_summary JSONB DEFAULT '{}',
  
  -- Agenda
  agenda_data JSONB DEFAULT '{}',
  
  -- Notificações pendentes
  pending_notifications JSONB DEFAULT '{}',
  
  -- User Roles e Permissões
  user_roles JSONB DEFAULT '{}',
  
  -- Integrações ativas
  integrations_status JSONB DEFAULT '{}',
  
  -- OKRs vinculados (para funcionários de empresa)
  okr_links JSONB DEFAULT '[]',
  
  -- Metadados do cache
  cache_version INT DEFAULT 1,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_update_at TIMESTAMP WITH TIME ZONE,
  update_triggered_by TEXT DEFAULT 'system',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_user_home_cache_user_id ON public.user_home_cache(user_id);
CREATE INDEX idx_user_home_cache_last_updated ON public.user_home_cache(last_updated_at);

-- Habilitar RLS
ALTER TABLE public.user_home_cache ENABLE ROW LEVEL SECURITY;

-- Usuários podem apenas ler seu próprio cache
CREATE POLICY "Users can view own cache"
ON public.user_home_cache FOR SELECT
USING (auth.uid() = user_id);

-- Tabela de logs do processamento de cache
CREATE TABLE public.cache_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  users_processed INT DEFAULT 0,
  users_failed INT DEFAULT 0,
  duration_seconds NUMERIC,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para logs (apenas admins podem ver)
ALTER TABLE public.cache_processing_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view cache logs"
ON public.cache_processing_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Função para marcar cache como dirty quando há mudanças
CREATE OR REPLACE FUNCTION public.mark_cache_dirty()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_home_cache
  SET 
    last_updated_at = NOW(),
    update_triggered_by = 'user_action'
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para marcar cache como dirty em mudanças críticas
CREATE TRIGGER cache_dirty_on_objective_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_objectives
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_goal_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_goals
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_action_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_actions
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_step_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_steps
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_agenda_change
AFTER INSERT OR UPDATE OR DELETE ON public.agenda_events
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_diary_change
AFTER INSERT OR UPDATE OR DELETE ON public.diary_entries
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();

CREATE TRIGGER cache_dirty_on_streak_change
AFTER INSERT OR UPDATE ON public.user_streaks
FOR EACH ROW EXECUTE FUNCTION public.mark_cache_dirty();