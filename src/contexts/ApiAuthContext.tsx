
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/authService';
import { ApiUser, RegisterRequest, LoginRequest, VerifyUserRequest, RedeemPasswordRequest, RedeemPasswordCodeRequest, PlanType } from '@/types/api';

interface ApiAuthContextType {
  user: ApiUser | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, plan: PlanType) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyUser: (email: string, verificationCode: string) => Promise<void>;
  redeemPassword: (email: string) => Promise<void>;
  redeemPasswordCode: (token: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const ApiAuthContext = createContext<ApiAuthContextType | undefined>(undefined);

export const ApiAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isAuthenticated = !!user && AuthService.hasToken();

  // Verificar se usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      if (!AuthService.hasToken()) {
        setLoading(false);
        return;
      }

      try {
        const response = await AuthService.auth();
        setUser(response.user);
      } catch (error: any) {
        console.error('Erro ao verificar autenticação:', error);
        AuthService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, plan: PlanType) => {
    try {
      const data: RegisterRequest = {
        name: firstName,
        lastname: lastName,
        email,
        password,
        plan,
      };

      await AuthService.register(data);
      
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar sua conta.",
      });
      
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro no cadastro';
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data: LoginRequest = { email, password };
      const response = await AuthService.login(data);
      
      // Salvar token
      AuthService.saveToken(response.jwt);
      
      // Buscar dados do usuário
      const authResponse = await AuthService.auth();
      setUser(authResponse.user);

      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao seu painel Luxfy.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro no login';
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      AuthService.removeToken();
      setUser(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const verifyUser = async (email: string, verificationCode: string) => {
    try {
      const data: VerifyUserRequest = { email, verificationCode };
      await AuthService.verify(data);
      
      toast({
        title: "Conta verificada!",
        description: "Sua conta foi verificada com sucesso. Você já pode fazer login.",
      });
      
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro na verificação';
      toast({
        title: "Erro na verificação",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const redeemPassword = async (email: string) => {
    try {
      const data: RedeemPasswordRequest = { email };
      await AuthService.redeemPassword(data);
      
      toast({
        title: "Código enviado!",
        description: "Verifique seu email para o código de recuperação.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao solicitar recuperação';
      toast({
        title: "Erro na recuperação",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const redeemPasswordCode = async (token: string, newPassword: string) => {
    try {
      const data: RedeemPasswordCodeRequest = { token, newPassword };
      await AuthService.redeemPasswordCode(data);
      
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao alterar senha';
      toast({
        title: "Erro na alteração",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <ApiAuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        verifyUser,
        redeemPassword,
        redeemPasswordCode,
        isAuthenticated,
      }}
    >
      {children}
    </ApiAuthContext.Provider>
  );
};

export const useApiAuth = () => {
  const context = useContext(ApiAuthContext);
  if (context === undefined) {
    throw new Error('useApiAuth must be used within an ApiAuthProvider');
  }
  return context;
};
