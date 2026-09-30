DROP POLICY IF EXISTS "Public reads service images" ON storage.objects;
CREATE POLICY "Admins read service images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'service-images' AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')));

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (length(email) BETWEEN 5 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

DROP POLICY IF EXISTS "Anyone can apply" ON public.job_applications;
CREATE POLICY "Anyone can apply" ON public.job_applications FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND length(trim(name)) > 0);

DROP POLICY IF EXISTS "Anyone can submit a message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a message" ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new' AND length(trim(name)) > 0 AND length(trim(message)) > 0);