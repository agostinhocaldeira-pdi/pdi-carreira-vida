-- Add UPDATE policy for user_consents table
CREATE POLICY "Users can update their own consents"
ON public.user_consents
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);