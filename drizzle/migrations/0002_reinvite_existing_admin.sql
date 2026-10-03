CREATE OR REPLACE FUNCTION public.grant_admin_on_invite()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  SELECT p.id, 'admin'::app_role FROM public.profiles p WHERE lower(p.email) = lower(NEW.email)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.grant_admin_on_invite() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_admin_invite_created AFTER INSERT ON public.admin_invites
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_on_invite();