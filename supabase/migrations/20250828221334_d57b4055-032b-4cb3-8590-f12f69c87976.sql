-- Create function to get pending invoices with user information
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

-- Create function to get invoice statistics
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

-- Create function to get invoice details by ID
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