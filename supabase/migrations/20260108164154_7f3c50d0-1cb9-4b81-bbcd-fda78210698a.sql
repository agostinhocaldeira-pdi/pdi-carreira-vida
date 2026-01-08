-- Add is_principal column to user_objectives table
ALTER TABLE public.user_objectives ADD COLUMN is_principal BOOLEAN DEFAULT FALSE;

-- Create a function to ensure only one objective can be principal per user
CREATE OR REPLACE FUNCTION ensure_single_principal_objective()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated objective is being set as principal
  IF NEW.is_principal = TRUE THEN
    -- Remove principal status from all other objectives of the same user
    UPDATE public.user_objectives 
    SET is_principal = FALSE 
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_principal = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce single principal objective
CREATE TRIGGER trigger_ensure_single_principal_objective
BEFORE INSERT OR UPDATE ON public.user_objectives
FOR EACH ROW
EXECUTE FUNCTION ensure_single_principal_objective();