-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only revealed answers are visible" ON public.answers;

-- Create new policy: Allow reading all answers (the reveal mechanism is UI-based, not DB-based)
-- Host needs to see all answers to display gift boxes, revelation is tracked for display purposes
CREATE POLICY "Anyone can view answers"
ON public.answers
FOR SELECT
USING (true);