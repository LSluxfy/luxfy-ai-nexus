-- Create profiles for existing users who don't have one yet
INSERT INTO public.profiles (id, first_name, last_name)
SELECT 
  u.id,
  u.raw_user_meta_data ->> 'first_name' as first_name,
  u.raw_user_meta_data ->> 'last_name' as last_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;