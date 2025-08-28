-- Migrar dados do usuário existente da tabela users para auth.users e profiles
-- Primeiro, inserir na auth.users (simular signup do usuário admin)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'luxfyapp@gmail.com',
  crypt('senha_temporaria_123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Admin", "last_name": "Luxfy"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Depois inserir no profiles usando o ID do auth.users
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
)
SELECT 
  au.id,
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
FROM auth.users au
WHERE au.email = 'luxfyapp@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  active = true,
  is_admin = true,
  plan = 'PREMIUM',
  updated_at = now();