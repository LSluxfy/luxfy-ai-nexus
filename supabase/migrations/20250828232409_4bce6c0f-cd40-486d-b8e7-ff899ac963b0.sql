-- Migrar dados do usuário admin da tabela users para profiles
-- Primeiro, vamos inserir o perfil do admin usando os dados da tabela users existente
INSERT INTO public.profiles (
  id,
  email,
  name,
  last_name,
  user_name,
  plan,
  number_agentes,
  active,
  is_admin,
  profile_expire,
  last_login,
  created_at,
  updated_at
)
SELECT 
  '856c07a6-2e86-4324-b4ee-afb0614708f8'::uuid,
  email,
  name,
  last_name,
  user_name,
  plan::text,
  number_agentes,
  active,
  is_admin,
  profile_expire,
  last_login,
  create_at,
  COALESCE(update_at, create_at)
FROM public.users 
WHERE email = 'luxfyapp@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  last_name = EXCLUDED.last_name,
  user_name = EXCLUDED.user_name,
  plan = EXCLUDED.plan,
  number_agentes = EXCLUDED.number_agentes,
  active = EXCLUDED.active,
  is_admin = EXCLUDED.is_admin,
  profile_expire = EXCLUDED.profile_expire,
  last_login = EXCLUDED.last_login,
  updated_at = now();

-- Criar função para criar perfil automaticamente quando um usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    last_name,
    user_name,
    plan,
    number_agentes,
    active,
    is_admin
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'user_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'plan', 'FREE'),
    1,
    true,
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();