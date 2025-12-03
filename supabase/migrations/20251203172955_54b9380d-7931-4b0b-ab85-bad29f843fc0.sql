-- ============================================
-- 1. GAMIFICAÇÃO - Conquistas e Streaks
-- ============================================

-- Definições de conquistas disponíveis
CREATE TABLE public.achievement_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conquistas desbloqueadas pelos usuários
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Streaks dos usuários
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 2. LEMBRETES AUTOMÁTICOS
-- ============================================

CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  diary_reminder_enabled BOOLEAN NOT NULL DEFAULT true,
  diary_reminder_time TIME NOT NULL DEFAULT '20:00:00',
  goal_deadline_reminder BOOLEAN NOT NULL DEFAULT true,
  goal_deadline_days_before INTEGER NOT NULL DEFAULT 3,
  weekly_summary_enabled BOOLEAN NOT NULL DEFAULT true,
  weekly_summary_day INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 4. INTEGRAÇÕES (Google Calendar, etc)
-- ============================================

CREATE TABLE public.user_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_type TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  settings JSONB DEFAULT '{}',
  connected_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, integration_type)
);

-- ============================================
-- 10. OKRs CORPORATIVOS
-- ============================================

CREATE TABLE public.company_okrs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.okr_key_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  okr_id UUID NOT NULL REFERENCES public.company_okrs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vinculação de objetivos pessoais aos OKRs
CREATE TABLE public.user_okr_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  okr_id UUID NOT NULL REFERENCES public.company_okrs(id) ON DELETE CASCADE,
  objetivo_id TEXT NOT NULL,
  contribution_percentage NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, okr_id, objetivo_id)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Achievement definitions - públicas para leitura
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON public.achievement_definitions FOR SELECT USING (true);

-- User achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User streaks
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own streaks" ON public.user_streaks FOR ALL USING (auth.uid() = user_id);

-- Notification preferences
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON public.user_notification_preferences FOR ALL USING (auth.uid() = user_id);

-- User integrations
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own integrations" ON public.user_integrations FOR ALL USING (auth.uid() = user_id);

-- Company OKRs
ALTER TABLE public.company_okrs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company members can view OKRs" ON public.company_okrs FOR SELECT USING (
  company_id IN (SELECT company_id FROM public.company_employees WHERE user_id = auth.uid())
  OR company_id IN (SELECT company_id FROM public.company_managers WHERE user_id = auth.uid())
  OR company_id IN (SELECT id FROM public.companies WHERE owner_user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);
CREATE POLICY "Company owners can manage OKRs" ON public.company_okrs FOR ALL USING (
  company_id IN (SELECT id FROM public.companies WHERE owner_user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- OKR Key Results
ALTER TABLE public.okr_key_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View key results through OKR access" ON public.okr_key_results FOR SELECT USING (
  okr_id IN (SELECT id FROM public.company_okrs)
);
CREATE POLICY "Manage key results through OKR access" ON public.okr_key_results FOR ALL USING (
  okr_id IN (SELECT id FROM public.company_okrs WHERE company_id IN (SELECT id FROM public.companies WHERE owner_user_id = auth.uid()))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- User OKR Links
ALTER TABLE public.user_okr_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their OKR links" ON public.user_okr_links FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Company can view employee OKR links" ON public.user_okr_links FOR SELECT USING (
  okr_id IN (SELECT id FROM public.company_okrs WHERE company_id IN (SELECT id FROM public.companies WHERE owner_user_id = auth.uid()))
);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.user_notification_preferences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_user_integrations_updated_at BEFORE UPDATE ON public.user_integrations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_company_okrs_updated_at BEFORE UPDATE ON public.company_okrs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_okr_key_results_updated_at BEFORE UPDATE ON public.okr_key_results FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SEED: Achievement Definitions
-- ============================================

INSERT INTO public.achievement_definitions (code, name, description, icon, category, points, requirement_type, requirement_value) VALUES
('first_diary', 'Primeiro Passo', 'Registrou seu primeiro dia no diário', '📝', 'diario', 10, 'diary_entries', 1),
('diary_week', 'Semana Consistente', 'Registrou 7 dias consecutivos no diário', '🔥', 'diario', 50, 'diary_streak', 7),
('diary_month', 'Mês de Reflexão', 'Registrou 30 dias consecutivos no diário', '🏆', 'diario', 200, 'diary_streak', 30),
('first_objective', 'Visionário', 'Criou seu primeiro objetivo', '🎯', 'objetivos', 10, 'objectives', 1),
('three_objectives', 'Foco Total', 'Tem 3 objetivos ativos', '🎯', 'objetivos', 30, 'objectives', 3),
('first_goal', 'Planejador', 'Criou sua primeira meta', '📊', 'metas', 10, 'goals', 1),
('ten_goals', 'Estrategista', 'Criou 10 metas', '📊', 'metas', 100, 'goals', 10),
('first_action', 'Executor', 'Completou sua primeira ação', '⚡', 'acoes', 10, 'actions_completed', 1),
('fifty_actions', 'Máquina de Ação', 'Completou 50 ações', '⚡', 'acoes', 200, 'actions_completed', 50),
('vvd_complete', 'Visão Clara', 'Definiu sua Visão de Vida Desejada', '🌟', 'plano', 50, 'vvd_complete', 1),
('valores_complete', 'Valores Definidos', 'Completou o exercício de Valores', '💎', 'plano', 50, 'valores_complete', 1),
('roda_complete', 'Autoconhecimento', 'Completou a Roda da Vida', '🎡', 'ferramentas', 30, 'roda_complete', 1),
('swot_complete', 'Analista', 'Completou a Análise SWOT', '📋', 'ferramentas', 30, 'swot_complete', 1),
('smart_complete', 'Metas SMART', 'Criou uma meta usando método SMART', '🧠', 'ferramentas', 40, 'smart_goals', 1),
('level_5', 'Aprendiz', 'Alcançou o nível 5', '⭐', 'nivel', 100, 'level', 5),
('level_10', 'Praticante', 'Alcançou o nível 10', '⭐', 'nivel', 200, 'level', 10),
('level_25', 'Mestre', 'Alcançou o nível 25', '👑', 'nivel', 500, 'level', 25);