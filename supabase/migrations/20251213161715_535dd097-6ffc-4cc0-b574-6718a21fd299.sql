-- Function to delete old rooms (cascade will delete related questions and answers)
CREATE OR REPLACE FUNCTION public.delete_old_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete rooms older than 30 days
  DELETE FROM public.rooms
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;