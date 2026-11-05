CREATE OR REPLACE FUNCTION public.provision_admin_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
 INSERT INTO public.profiles(id) VALUES(NEW.id) ON CONFLICT DO NOTHING;
 IF lower(NEW.email)='advaithsunil2001@gmail.com' AND NEW.email_confirmed_at IS NOT NULL THEN
 INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,'admin') ON CONFLICT DO NOTHING;
 ELSE DELETE FROM public.user_roles WHERE user_id=NEW.id AND role='admin'; END IF;
 RETURN NEW; END $$;
DROP TRIGGER provision_vclean_admin ON auth.users;
CREATE TRIGGER provision_vclean_admin AFTER INSERT OR UPDATE OF email,email_confirmed_at ON auth.users FOR EACH ROW EXECUTE FUNCTION public.provision_admin_profile();
REVOKE ALL ON FUNCTION public.provision_admin_profile() FROM PUBLIC,anon,authenticated;
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE(display_name,avatar_url,preferences) ON public.profiles TO authenticated;