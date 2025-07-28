
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
  access_token: string;
}

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const response = await api.get(`/v1/user/profile/${userId}`);
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Verificar se há token armazenado
    const token = localStorage.getItem('jwt-token');
    const userData = localStorage.getItem('user-data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const sessionData = {
          user: parsedUser,
          access_token: token
        };
        setSession(sessionData);
        setUser(parsedUser);
        fetchProfile(parsedUser.id);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user-data');
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      const response = await api.post('/v1/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });

      if (response.data.user && response.data.token) {
        const sessionData = {
          user: response.data.user,
          access_token: response.data.token
        };
        
        localStorage.setItem('jwt-token', response.data.token);
        localStorage.setItem('user-data', JSON.stringify(response.data.user));
        
        setSession(sessionData);
        setUser(response.data.user);
        
        if (response.data.profile) {
          setProfile(response.data.profile);
        }

        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao sistema.",
        });

        navigate('/dashboard');
      }
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
      const response = await api.post('/v1/auth/login', {
        email,
        password
      });

      if (response.data.user && response.data.token) {
        const sessionData = {
          user: response.data.user,
          access_token: response.data.token
        };
        
        localStorage.setItem('jwt-token', response.data.token);
        localStorage.setItem('user-data', JSON.stringify(response.data.user));
        
        setSession(sessionData);
        setUser(response.data.user);
        
        if (response.data.profile) {
          setProfile(response.data.profile);
        } else {
          await fetchProfile(response.data.user.id);
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
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
      // Fazer logout na API se necessário
      try {
        await api.post('/v1/auth/logout');
      } catch (error) {
        console.error('Error during API logout:', error);
      }

      localStorage.removeItem('jwt-token');
      localStorage.removeItem('user-data');
      setSession(null);
      setUser(null);
      setProfile(null);
      
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await api.put('/v1/user/profile', updates);
      
      if (response.data.profile) {
        setProfile(response.data.profile);
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar perfil';
      toast({
        title: "Erro ao atualizar perfil",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
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
