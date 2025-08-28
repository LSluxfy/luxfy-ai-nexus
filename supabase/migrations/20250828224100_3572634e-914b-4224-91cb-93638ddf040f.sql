-- Criar usuário admin diretamente no profiles
-- Usar um UUID fixo para o usuário admin
INSERT INTO public.profiles (
  id,
  email,
  name,
  last_name,
  user_name,
  plan,
  active,
  is_admin,
  profile_expire,
  number_agentes,
  created_at,
  updated_at
) VALUES (
  '4cb56b21-f356-4870-a0ce-d884b6c493e6',
  'luxfyapp@gmail.com',
  'Admin',
  'Luxfy',
  'admin',
  'PREMIUM',
  true,
  true,
  NULL,
  10,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  active = true,
  is_admin = true,
  plan = 'PREMIUM',
  email = 'luxfyapp@gmail.com',
  updated_at = now();