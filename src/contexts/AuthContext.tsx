
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

interface User {
  id: number;
  email: string;
  userName: string;
  name: string;
  lastName: string;
  loginMethod: string;
  verificationCode: string;
  numberAgentes: number;
  plan: string;
  profileExpire: string | null;
  appointments: any[];
  createAt: string;
  lastLogin: string | null;
  updateAt: string | null;
  agents: any[];
  invoices: any[];
}

interface Session {
  user: User;
  token: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
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

  const fetchUserData = async () => {
    try {
      const response = await api.get('/v1/user/auth');
      if (response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        const sessionData = {
          user: userData,
          token: localStorage.getItem('jwt-token') || ''
        };
        setSession(sessionData);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      
      // Se for erro 402 (fatura pendente), redireciona para página de fatura pendente
      if (error.response?.status === 402) {
        const errorData = error.response?.data;
        if (errorData?.invoice) {
          navigate(`/pending-invoice?invoice=${errorData.invoice}`);
          return;
        }
      }
      
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('user-data');
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    
    if (token) {
      // Como não existe mais endpoint para verificar auth, apenas marca como não carregando
      // O usuário terá que fazer login novamente se o token expirar
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, plan: string = 'BASICO') => {
    try {
      setLoading(true);
      const response = await api.post('/v1/user/register', {
        name: firstName,
        lastname: lastName,
        email,
        password,
        plan
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });

      navigate('/verify-email', { state: { email } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar conta';
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
      const response = await api.post('/v1/user/login', {
        email,
        password
      });

      if (response.data.jwt) {
        localStorage.setItem('jwt-token', response.data.jwt);
        
        // Cria um usuário temporário com dados básicos do JWT
        const userData = {
          id: 0,
          email,
          userName: '',
          name: '',
          lastName: '',
          loginMethod: 'EMAIL',
          verificationCode: '',
          numberAgentes: 0,
          plan: '',
          profileExpire: null,
          appointments: [],
          createAt: '',
          lastLogin: null,
          updateAt: null,
          agents: [],
          invoices: []
        };
        
        setUser(userData);
        const sessionData = {
          user: userData,
          token: response.data.jwt
        };
        setSession(sessionData);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.response?.status === 403) {
        errorMessage = 'Usuário não verificado. Verifique seu email.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
      localStorage.removeItem('jwt-token');
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
      const response = await api.post('/v1/user/verify-email', {
        email,
        code: verificationCode
      });

      toast({
        title: "Usuário verificado com sucesso!",
        description: "Agora você pode fazer login.",
      });

      navigate('/login');
    } catch (error: any) {
      let errorMessage = 'Erro ao verificar usuário';
      
      if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
      const response = await api.post('/v1/user/forgot-password', {
        email
      });

      toast({
        title: "Código de recuperação enviado!",
        description: "Verifique seu email para recuperar sua senha.",
      });
    } catch (error: any) {
      let errorMessage = 'Erro ao solicitar recuperação de senha';
      
      if (error.response?.status === 403) {
        errorMessage = 'Usuário não verificado';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
      const response = await api.post('/v1/user/redeem-password/code', {
        token,
        newPassword
      });

      toast({
        title: "Senha alterada com sucesso!",
        description: "Agora você pode fazer login com sua nova senha.",
      });

      navigate('/login');
    } catch (error: any) {
      let errorMessage = 'Erro ao alterar senha';
      
      if (error.response?.status === 403) {
        errorMessage = 'Código inválido';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
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
