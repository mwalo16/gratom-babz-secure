CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT INSERT, SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));