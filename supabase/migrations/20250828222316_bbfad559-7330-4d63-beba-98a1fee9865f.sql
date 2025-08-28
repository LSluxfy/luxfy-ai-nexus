-- Fase 1: Adicionar coluna is_admin na tabela users
ALTER TABLE public.users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- Fase 2: Ativar conta luxfyapp@gmail.com e definir como admin
UPDATE public.users 
SET 
  active = true,
  profile_expire = '2026-12-31 23:59:59'::timestamp,
  is_admin = true
WHERE email = 'luxfyapp@gmail.com';

-- Fase 3: Marcar fatura ID 12 como paga
UPDATE public.invoices 
SET 
  status = 'PAID',
  payment_date = CURRENT_TIMESTAMP,
  paid_value = amount,
  paid_with = 'Admin Activation'
WHERE id = 12;