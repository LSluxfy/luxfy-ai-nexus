
import { createClient } from '@supabase/supabase-js';

// Utilizar as credenciais diretas do projeto Supabase
const supabaseUrl = 'https://wpnlfvaqlndmrtsngwme.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbmxmdmFxbG5kbXJ0c25nd21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Mjc1MzIsImV4cCI6MjA2MDAwMzUzMn0.a-dqDg9rSXC-MNJNVcAXBT6mEIkupkJVrMbC5h6t-vE';

// Criar o cliente Supabase com as opções de autenticação
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Exportar função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return true; // Agora sempre retorna true pois estamos usando as credenciais fixas
};
