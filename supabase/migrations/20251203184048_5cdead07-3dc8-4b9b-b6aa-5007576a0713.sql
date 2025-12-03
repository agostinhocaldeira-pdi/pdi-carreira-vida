-- =============================================
-- MIGRAÇÃO COMPLETA: localStorage -> Supabase
-- =============================================

-- 1. VVD (Visão de Vida Desejada)
CREATE TABLE public.user_vvd (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vvd_text TEXT,
  vvd_paragraph TEXT,
  vvd_sentence TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_vvd ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own VVD" ON public.user_vvd
  FOR ALL USING (auth.uid() = user_id);

-- 2. Valores Pessoais (12 valores)
CREATE TABLE public.user_valores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valores TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_valores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own valores" ON public.user_valores
  FOR ALL USING (auth.uid() = user_id);

-- 3. Áreas da Vida (10 áreas com notas)
CREATE TABLE public.user_life_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL,
  current_score INTEGER DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 10),
  desired_score INTEGER DEFAULT 0 CHECK (desired_score >= 0 AND desired_score <= 10),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_life_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own life areas" ON public.user_life_areas
  FOR ALL USING (auth.uid() = user_id);

-- 4. Objetivos
CREATE TABLE public.user_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  data_alvo DATE,
  conexao_vvd TEXT,
  status TEXT DEFAULT 'a fazer' CHECK (status IN ('concluido', 'a fazer', 'pendente', 'em andamento')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own objectives" ON public.user_objectives
  FOR ALL USING (auth.uid() = user_id);

-- 5. Metas (vinculadas a objetivos)
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES public.user_objectives(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  data_alvo DATE,
  status TEXT DEFAULT 'a fazer' CHECK (status IN ('concluido', 'a fazer', 'pendente', 'em andamento')),
  from_smart BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- 6. Ações (vinculadas a metas)
CREATE TABLE public.user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.user_goals(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  periodicidade TEXT,
  status TEXT DEFAULT 'a fazer' CHECK (status IN ('concluido', 'a fazer', 'pendente', 'em andamento')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own actions" ON public.user_actions
  FOR ALL USING (auth.uid() = user_id);

-- 7. Passos (vinculados a ações)
CREATE TABLE public.user_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id UUID REFERENCES public.user_actions(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own steps" ON public.user_steps
  FOR ALL USING (auth.uid() = user_id);

-- 8. Competências
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own skills" ON public.user_skills
  FOR ALL USING (auth.uid() = user_id);

-- 9. Pontos Fortes e a Melhorar
CREATE TABLE public.user_strengths_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('strength', 'weakness')),
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_strengths_weaknesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own strengths/weaknesses" ON public.user_strengths_weaknesses
  FOR ALL USING (auth.uid() = user_id);

-- 10. Diário
CREATE TABLE public.diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('feliz', 'neutro', 'triste')),
  reflections TEXT,
  gratitude TEXT,
  conquests TEXT,
  daily_progress TEXT,
  habits TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own diary entries" ON public.diary_entries
  FOR ALL USING (auth.uid() = user_id);

-- 11. Análise SWOT
CREATE TABLE public.user_swot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  opportunities TEXT[] DEFAULT '{}',
  threats TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_swot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own SWOT" ON public.user_swot
  FOR ALL USING (auth.uid() = user_id);

-- 12. Crenças Transformadas
CREATE TABLE public.user_beliefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  limiting_belief TEXT NOT NULL,
  type TEXT CHECK (type IN ('positive', 'negative')),
  transformation_answers JSONB,
  new_belief TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_beliefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own beliefs" ON public.user_beliefs
  FOR ALL USING (auth.uid() = user_id);

-- 13. Matriz de Eisenhower
CREATE TABLE public.user_eisenhower_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_text TEXT NOT NULL,
  quadrant TEXT NOT NULL CHECK (quadrant IN ('urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_eisenhower_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own eisenhower tasks" ON public.user_eisenhower_tasks
  FOR ALL USING (auth.uid() = user_id);

-- 14. Insights do usuário
CREATE TABLE public.user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_text TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own insights" ON public.user_insights
  FOR ALL USING (auth.uid() = user_id);

-- 15. Autoavaliação 360
CREATE TABLE public.user_self_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  self_answers JSONB DEFAULT '{}',
  feedback_360 TEXT,
  ai_analysis TEXT,
  last_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_self_assessment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own self assessment" ON public.user_self_assessment
  FOR ALL USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_user_vvd_updated_at BEFORE UPDATE ON public.user_vvd FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_valores_updated_at BEFORE UPDATE ON public.user_valores FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_life_areas_updated_at BEFORE UPDATE ON public.user_life_areas FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_objectives_updated_at BEFORE UPDATE ON public.user_objectives FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON public.user_goals FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_actions_updated_at BEFORE UPDATE ON public.user_actions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_steps_updated_at BEFORE UPDATE ON public.user_steps FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON public.user_skills FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_strengths_weaknesses_updated_at BEFORE UPDATE ON public.user_strengths_weaknesses FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON public.diary_entries FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_swot_updated_at BEFORE UPDATE ON public.user_swot FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_beliefs_updated_at BEFORE UPDATE ON public.user_beliefs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_eisenhower_tasks_updated_at BEFORE UPDATE ON public.user_eisenhower_tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_user_self_assessment_updated_at BEFORE UPDATE ON public.user_self_assessment FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Políticas adicionais para gestores e empresas verem dados de funcionários
CREATE POLICY "Managers can view employee objectives" ON public.user_objectives
  FOR SELECT USING (
    user_id IN (
      SELECT ce.user_id FROM company_employees ce
      JOIN company_managers cm ON ce.company_id = cm.company_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view employee goals" ON public.user_goals
  FOR SELECT USING (
    user_id IN (
      SELECT ce.user_id FROM company_employees ce
      JOIN company_managers cm ON ce.company_id = cm.company_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view employee actions" ON public.user_actions
  FOR SELECT USING (
    user_id IN (
      SELECT ce.user_id FROM company_employees ce
      JOIN company_managers cm ON ce.company_id = cm.company_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Company can view employee objectives" ON public.user_objectives
  FOR SELECT USING (
    user_id IN (
      SELECT ce.user_id FROM company_employees ce
      JOIN companies c ON ce.company_id = c.id
      WHERE c.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Company can view employee goals" ON public.user_goals
  FOR SELECT USING (
    user_id IN (
      SELECT ce.user_id FROM company_employees ce
      JOIN companies c ON ce.company_id = c.id
      WHERE c.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Company can view employee diary" ON public.diary_entries
  FOR SELECT USING (
    user_id IN (
      SELECT ce.user_id FROM company_employees ce
      JOIN companies c ON ce.company_id = c.id
      WHERE c.owner_user_id = auth.uid()
    )
  );

-- Admin pode ver tudo
CREATE POLICY "Admins can view all objectives" ON public.user_objectives FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all goals" ON public.user_goals FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all actions" ON public.user_actions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all diary entries" ON public.diary_entries FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all VVD" ON public.user_vvd FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all valores" ON public.user_valores FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all life areas" ON public.user_life_areas FOR SELECT USING (has_role(auth.uid(), 'admin'));