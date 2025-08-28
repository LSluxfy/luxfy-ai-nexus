-- Add active field to users table for account activation control
ALTER TABLE public.users 
ADD COLUMN active boolean NOT NULL DEFAULT false;

-- Add comment to explain the field
COMMENT ON COLUMN public.users.active IS 'Controls if user account is active and can access platform features';