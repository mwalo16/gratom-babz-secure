CREATE POLICY "Public reads service images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'service-images');
CREATE POLICY "Admins manage service images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'service-images' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))) WITH CHECK (bucket_id = 'service-images' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin')));

UPDATE public.services SET image_url = 'https://ctbrixdlscvrempapkju.supabase.co/storage/v1/object/public/service-images/commercial-security.jpg' WHERE title = 'Commercial Security';
UPDATE public.services SET image_url = 'https://ctbrixdlscvrempapkju.supabase.co/storage/v1/object/public/service-images/industrial-security.jpg' WHERE title = 'Industrial Security';
UPDATE public.services SET image_url = 'https://ctbrixdlscvrempapkju.supabase.co/storage/v1/object/public/service-images/vip-protection.jpg' WHERE title = 'VIP Protection';
UPDATE public.services SET image_url = 'https://ctbrixdlscvrempapkju.supabase.co/storage/v1/object/public/service-images/biometric-systems.jpg' WHERE title = 'Biometric Systems';
UPDATE public.services SET image_url = 'https://ctbrixdlscvrempapkju.supabase.co/storage/v1/object/public/service-images/access-control.jpg' WHERE title = 'Access Control Systems';