
-- Event tracking: page views
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  page_path text NOT NULL,
  page_title text,
  referrer text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own page views"
ON public.page_views FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all page views"
ON public.page_views FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for faster queries
CREATE INDEX idx_page_views_user_id ON public.page_views(user_id);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);

-- Event tracking: user events (clicks, actions, etc.)
CREATE TABLE public.user_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  page_path text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events"
ON public.user_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all events"
ON public.user_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at DESC);
CREATE INDEX idx_user_events_event_type ON public.user_events(event_type);
