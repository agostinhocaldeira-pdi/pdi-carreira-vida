-- Criar índice único para prevenir duplicação de passos (action_id + texto normalizado)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_steps_unique_per_action 
ON public.user_steps (action_id, lower(trim(texto)));