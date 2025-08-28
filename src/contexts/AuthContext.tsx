import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  userName: string | null;
  name: string;
  lastName: string;
  plan: string;
  profileExpire: string | null;
  active: boolean;
  isAdmin: boolean;
  numberAgentes: number;
  createdAt: string;
  lastLogin: string | null;
  updatedAt: string | null;
  // Legacy properties for backward compatibility
  createAt: string;
  updateAt: string | null;
  agents: any[];
}

interface Session {
  user: User;
  token: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, plan: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyUser: (email: string, verificationCode: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        userName: profile.user_name,
        name: profile.name,
        lastName: profile.last_name,
        plan: profile.plan,
        profileExpire: profile.profile_expire,
        active: profile.active,
        isAdmin: profile.is_admin,
        numberAgentes: profile.number_agentes,
        createdAt: profile.created_at,
        lastLogin: profile.last_login,
        updatedAt: profile.updated_at,
        // Legacy properties for backward compatibility
        createAt: profile.created_at,
        updateAt: profile.updated_at,
        agents: [], // Will be loaded separately
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, supabaseSession) => {
        console.log('🔐 Auth state changed:', event, !!supabaseSession);
        
        if (supabaseSession?.user) {
          const profile = await fetchUserProfile(supabaseSession.user.id);
          if (profile) {
            setUser(profile);
            setSession({
              user: profile,
              token: supabaseSession.access_token
            });
          }
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
      if (supabaseSession?.user) {
        setTimeout(async () => {
          const profile = await fetchUserProfile(supabaseSession.user.id);
          if (profile) {
            setUser(profile);
            setSession({
              user: profile,
              token: supabaseSession.access_token
            });
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, plan: string = 'BASICO') => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: firstName,
            last_name: lastName,
            plan: plan
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });

      navigate('/verify-email', { state: { email } });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar conta';
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Iniciando processo de login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido');
        
        // Track Facebook Pixel event for successful login
        import('../lib/facebook-pixel').then(({ trackEvent, FacebookEvents }) => {
          trackEvent(FacebookEvents.COMPLETE_REGISTRATION, {
            content_name: 'User Login',
            status: 'completed'
          });
        });
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });

        console.log('🔄 Redirecionando para dashboard...');
        navigate('/dashboard');
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setSession(null);
      setUser(null);
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });

      navigate('/login');
    } catch (error: any) {
      console.error('Error during sign out:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro, mas você foi desconectado.",
        variant: "destructive",
      });
    }
  };

  const verifyUser = async (email: string, verificationCode: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Usuário verificado com sucesso!",
        description: "Agora você pode fazer login.",
      });

      navigate('/login');
    } catch (error: any) {
      let errorMessage = 'Erro ao verificar usuário';
      
      if (error.message?.includes('Invalid token')) {
        errorMessage = 'Código de verificação inválido';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao verificar usuário",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Código de recuperação enviado!",
        description: "Verifique seu email para recuperar sua senha.",
      });
    } catch (error: any) {
      let errorMessage = 'Erro ao solicitar recuperação de senha';
      
      if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao solicitar recuperação",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Senha alterada com sucesso!",
        description: "Agora você pode fazer login com sua nova senha.",
      });

      navigate('/login');
    } catch (error: any) {
      let errorMessage = 'Erro ao alterar senha';
      
      if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao alterar senha",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        verifyUser,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};