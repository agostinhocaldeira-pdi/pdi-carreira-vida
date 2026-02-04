-- Add stoic_response column to diary_entries table
-- This separates the Stoic Reflection response from the regular diary reflections

ALTER TABLE public.diary_entries 
ADD COLUMN IF NOT EXISTS stoic_response TEXT;