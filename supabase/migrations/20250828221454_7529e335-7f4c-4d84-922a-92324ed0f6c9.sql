-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for users table (most important)
CREATE POLICY "Users can view their own data" ON public.users
FOR SELECT
USING (id = current_setting('app.current_user_id', true)::integer);

CREATE POLICY "Users can update their own data" ON public.users
FOR UPDATE
USING (id = current_setting('app.current_user_id', true)::integer);

-- Create RLS policies for invoices (admin access)
CREATE POLICY "Service role can manage all invoices" ON public.invoices
FOR ALL
USING (current_user = 'service_role');

CREATE POLICY "Users can view their own invoices" ON public.invoices
FOR SELECT
USING (user_id = current_setting('app.current_user_id', true)::integer);

-- Fix search path for functions to be more secure
CREATE OR REPLACE FUNCTION get_pending_invoices_with_users()
RETURNS TABLE (
  id integer,
  public_id text,
  amount double precision,
  status text,
  action text,
  description text,
  due_date timestamp without time zone,
  created_at timestamp without time zone,
  user_id integer,
  user_email text,
  user_name text,
  user_active boolean
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    i.id,
    i.public_id,
    i.amount,
    i.status::text,
    i.action,
    i.description,
    i.due_date,
    i.create_at as created_at,
    i.user_id,
    u.email as user_email,
    u.name as user_name,
    u.active as user_active
  FROM invoices i
  LEFT JOIN users u ON i.user_id = u.id
  WHERE i.status = 'PENDING'
  ORDER BY i.create_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_invoice_statistics()
RETURNS TABLE (
  total_pending_invoices bigint,
  total_pending_amount double precision,
  affected_users bigint,
  average_amount double precision,
  low_value_invoices bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_pending_invoices,
    COALESCE(SUM(amount), 0) as total_pending_amount,
    COUNT(DISTINCT user_id) as affected_users,
    COALESCE(AVG(amount), 0) as average_amount,
    COUNT(*) FILTER (WHERE amount < 1) as low_value_invoices
  FROM invoices 
  WHERE status = 'PENDING';
$$;

CREATE OR REPLACE FUNCTION get_invoice_details(invoice_id integer)
RETURNS TABLE (
  id integer,
  public_id text,
  amount double precision,
  status text,
  action text,
  description text,
  due_date timestamp without time zone,
  created_at timestamp without time zone,
  user_id integer,
  user_email text,
  user_name text,
  user_active boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    i.id,
    i.public_id,
    i.amount,
    i.status::text,
    i.action,
    i.description,
    i.due_date,
    i.create_at as created_at,
    i.user_id,
    u.email as user_email,
    u.name as user_name,
    u.active as user_active
  FROM invoices i
  LEFT JOIN users u ON i.user_id = u.id
  WHERE i.id = invoice_id;
$$;