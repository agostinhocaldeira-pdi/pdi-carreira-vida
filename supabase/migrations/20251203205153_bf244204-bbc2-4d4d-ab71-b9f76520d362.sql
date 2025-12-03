-- Add unique constraint for user_okr_links to enable upsert
ALTER TABLE public.user_okr_links 
ADD CONSTRAINT user_okr_links_user_objetivo_unique UNIQUE (user_id, objetivo_id);