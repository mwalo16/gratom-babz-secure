CREATE TABLE public.job_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'Full-time',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.job_vacancies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_vacancies TO authenticated;
GRANT ALL ON public.job_vacancies TO service_role;

ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads published vacancies" ON public.job_vacancies
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all vacancies" ON public.job_vacancies
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins manage vacancies" ON public.job_vacancies
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE TABLE public.application_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.application_requirements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_requirements TO authenticated;
GRANT ALL ON public.application_requirements TO service_role;

ALTER TABLE public.application_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads requirements" ON public.application_requirements
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage requirements" ON public.application_requirements
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_job_vacancies_updated_at BEFORE UPDATE ON public.job_vacancies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_application_requirements_updated_at BEFORE UPDATE ON public.application_requirements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.job_vacancies (title, location, employment_type, sort_order) VALUES
  ('Security Officer', 'Kiambu, Nakuru, Nyeri', 'Full-time', 1),
  ('K9 Handler', 'Nairobi', 'Full-time', 2),
  ('Control Room Operator', 'Head Office', 'Shift', 3),
  ('Mobile Patrol Officer', 'Central Region', 'Full-time', 4),
  ('CCTV Technician', 'Nairobi', 'Full-time', 5),
  ('Operations Supervisor', 'Murang''a', 'Full-time', 6);

INSERT INTO public.application_requirements (requirement, sort_order) VALUES
  ('KCSE Certificate (D+ and above)', 1),
  ('Valid National ID and Certificate of Good Conduct', 2),
  ('Physically fit, minimum height 5''6"', 3),
  ('Aged between 21 and 45 years', 4),
  ('Previous security or disciplined-forces experience is an advantage', 5);