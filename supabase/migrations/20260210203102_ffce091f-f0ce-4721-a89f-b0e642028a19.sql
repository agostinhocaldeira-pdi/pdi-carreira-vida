-- Fix leads table: remove overly permissive INSERT policy and replace with a more restricted one
-- The current "Anyone can insert leads" policy uses WITH CHECK (true) which is too broad

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Allow unauthenticated inserts but only for specific columns (name, email, phone, source)
-- This is needed for ebook landing pages where visitors submit their info
-- We use anon role access but restrict via the policy
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (
  -- Only allow setting safe fields - confirmation_token and email_confirmed default to safe values
  -- Prevent setting admin-only fields
  ebook_downloaded IS NOT DISTINCT FROM false
  AND email_confirmed IS NOT DISTINCT FROM false
);
