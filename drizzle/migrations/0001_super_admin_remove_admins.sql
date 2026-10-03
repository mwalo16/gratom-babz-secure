GRANT DELETE ON public.user_roles TO authenticated;
CREATE POLICY "Super admins remove admins" ON public.user_roles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role) AND role = 'admin'::app_role AND user_id <> auth.uid() AND NOT public.has_role(user_id, 'super_admin'::app_role));