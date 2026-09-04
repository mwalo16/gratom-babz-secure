-- 1) Remove privilege-escalation path: first signup no longer auto-becomes super_admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _email text := lower(coalesce(NEW.email, ''));
  _invited boolean;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;

  SELECT EXISTS (SELECT 1 FROM public.admin_invites WHERE lower(email) = _email) INTO _invited;

  IF _invited THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- 2) Least-privilege table grants (RLS still applies on top).
REVOKE ALL ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

REVOKE ALL ON public.admin_invites FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.admin_invites TO authenticated;
GRANT ALL ON public.admin_invites TO service_role;

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

REVOKE ALL ON public.job_applications FROM anon, authenticated;
GRANT INSERT ON public.job_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;

REVOKE ALL ON public.newsletter_subscribers FROM anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

REVOKE ALL ON public.services FROM anon, authenticated;
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

REVOKE ALL ON public.gallery_items FROM anon, authenticated;
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;

REVOKE ALL ON public.job_vacancies FROM anon, authenticated;
GRANT SELECT ON public.job_vacancies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_vacancies TO authenticated;
GRANT ALL ON public.job_vacancies TO service_role;

REVOKE ALL ON public.application_requirements FROM anon, authenticated;
GRANT SELECT ON public.application_requirements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_requirements TO authenticated;
GRANT ALL ON public.application_requirements TO service_role;

-- 3) Server-side input limits so public forms cannot be used to dump junk.
ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_lengths CHECK (
    char_length(coalesce(name,'')) BETWEEN 1 AND 120
    AND char_length(coalesce(phone,'')) <= 40
    AND char_length(coalesce(email,'')) <= 200
    AND char_length(coalesce(service,'')) <= 120
    AND char_length(coalesce(message,'')) BETWEEN 1 AND 3000
  );

ALTER TABLE public.job_applications
  ADD CONSTRAINT job_applications_lengths CHECK (
    char_length(coalesce(name,'')) BETWEEN 1 AND 120
    AND char_length(coalesce(phone,'')) <= 40
    AND char_length(coalesce(email,'')) <= 200
    AND char_length(coalesce(position,'')) <= 120
    AND char_length(coalesce(cover_note,'')) <= 3000
  );

ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_email_valid CHECK (
    char_length(email) BETWEEN 5 AND 200 AND email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$'
  );
