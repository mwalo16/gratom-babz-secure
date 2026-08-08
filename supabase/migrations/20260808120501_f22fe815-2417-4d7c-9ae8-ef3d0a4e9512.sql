-- roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- invite list
CREATE TABLE public.admin_invites (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.admin_invites TO authenticated;
GRANT ALL ON public.admin_invites TO service_role;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invites" ON public.admin_invites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- signup handler: profile + admin grant when invited (or first ever user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text := lower(coalesce(NEW.email, ''));
  _invited boolean;
  _has_admins boolean;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;

  SELECT EXISTS (SELECT 1 FROM public.admin_invites WHERE lower(email) = _email) INTO _invited;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO _has_admins;

  IF _invited OR NOT _has_admins THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  service text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- job applications
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  position text,
  cover_note text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.job_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.job_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read applications" ON public.job_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update applications" ON public.job_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete applications" ON public.job_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Shield',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published services" ON public.services FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all services" ON public.services FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- seed services
INSERT INTO public.services (title, description, icon, sort_order) VALUES
('Security Guards & Guardettes','Uniformed, vetted male and female officers for every environment.','Shield',1),
('Residential Security','Guards, patrols and monitoring for estates and homes.','Home',2),
('Commercial Security','Offices, retail, banks and hospitality protection.','Building2',3),
('Industrial Security','Perimeter, asset and personnel protection for plants.','Factory',4),
('VIP Protection','Trained close-protection officers for executives and dignitaries.','UserCheck',5),
('Event Security','Crowd control, access and rapid response for events.','Users',6),
('Mobile Patrol','GPS-tracked motorcycle and vehicle patrols.','Bike',7),
('Alarm Response & Back-up','24/7 dispatch of reaction and back-up units on alarm trigger.','Bell',8),
('CCTV Installation','Design, supply and installation of surveillance systems.','Camera',9),
('CCTV Monitoring','Live remote monitoring from our control room.','Video',10),
('Access Control Systems','Card, PIN and mobile-based site access.','KeyRound',11),
('Biometric Systems','Fingerprint and facial recognition entry solutions.','Fingerprint',12),
('Electric Fence Installation','Certified, energized perimeter fencing.','Zap',13),
('Security Dog Services','Detection and deterrence dogs with certified handlers.','Dog',14),
('Intruder Alarm Systems','Supply, installation and maintenance of intruder alarms.','Bell',15),
('Car Tracking & Fleet Management','GPS vehicle tracking, fuel monitoring and fleet reporting.','Car',16),
('Security Consultancy','Advisory on strategy, policy and technology.','ClipboardList',17),
('Risk Assessment','Comprehensive on-site threat and vulnerability audits.','ShieldAlert',18);

-- seed gallery
INSERT INTO public.gallery_items (image_url, category, sort_order) VALUES
('/__l5e/assets-v1/eda7024d-e70a-40d7-b087-c065c0f431fa/fleet-branded.jpg','Patrol Vehicles',1),
('/__l5e/assets-v1/4f3eccf7-7c5b-4cca-88f5-d6719199deb3/fleet-cars.jpg','Patrol Vehicles',2),
('/__l5e/assets-v1/c1450b28-f5fb-4dee-af05-4ab90a613b89/patrol-truck-blue.jpg','Patrol Vehicles',3),
('/__l5e/assets-v1/7c6e705d-c024-4f50-add3-93c9af8bfb22/dog-unit-vehicle.jpg','Patrol Vehicles',4),
('/__l5e/assets-v1/1e31e2ff-3d58-4b35-97b6-8cdd7ddd6f6f/response-unit.jpg','Response Unit',5),
('/__l5e/assets-v1/07f82c9b-611c-49bd-912b-667c0c546a6a/moto-riders.jpg','Motorcycle Patrol',6),
('/__l5e/assets-v1/5d2ff067-7399-4a46-9092-473281c39609/moto-branded.jpg','Motorcycle Patrol',7),
('/__l5e/assets-v1/2de20b95-70dc-4260-88b2-b4ef0bd56fdd/k9-officer.jpg','K9 Unit',8),
('/__l5e/assets-v1/40652665-ac7e-4fae-9bf3-b9d67f136081/k9-pair.jpg','K9 Unit',9),
('/__l5e/assets-v1/d1783441-861d-4f8e-9fe4-8c94222f24be/k9-training.jpg','K9 Unit',10),
('/__l5e/assets-v1/cef0be5b-9859-445b-90da-b82d323a58f9/k9-bite-training.jpg','K9 Unit',11),
('/__l5e/assets-v1/4c46a5d2-c970-4be9-b9e0-5b97fca63987/cctv-install.jpg','CCTV Installation',12),
('/__l5e/assets-v1/caf8cd5c-0d0b-42a5-826a-a2667ee6348a/cctv-mounting.jpg','CCTV Installation',13),
('/__l5e/assets-v1/8d6ffc88-fdb8-4e78-9b74-0e420f8fbb60/alarm-system.jpg','Alarm Systems',14),
('/__l5e/assets-v1/c0173e60-e67d-4a8d-a27e-0f4bebea44f9/alarm-kit.jpg','Alarm Systems',15),
('/__l5e/assets-v1/24e4ce3b-49fa-4038-b74b-ffa4170aa0cd/parade-salute.jpg','Security Officers',16),
('/__l5e/assets-v1/ea47cb80-0105-43b9-9171-f67912b14498/guard-parade.jpg','Security Officers',17),
('/__l5e/assets-v1/2f4514fc-907a-4bfa-9707-0b7f83696d38/razor-wire.jpg','Electric Fencing',18);