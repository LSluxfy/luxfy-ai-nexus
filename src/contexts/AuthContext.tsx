import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

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
  paymentStatus: "PENDING_PAYMENT" | "ACTIVE" | "CANCELED";
  active: boolean;
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

  console.log("✅ AuthProvider inicializado");

  const fetchUserData = async (isAutoRefresh = false): Promise<User | null> => {
    const timestamp = new Date().toISOString();
    const requestType = isAutoRefresh ? "🔄 [AUTO-REFRESH]" : "🚀 [INITIAL/MANUAL]";

    console.log(`${requestType} ${timestamp} - Iniciando busca de dados dos agentes (ANTI-CACHE MÁXIMO)`);

    try {
      const antiCacheHeaders = {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        "If-None-Match": "",
        "If-Modified-Since": "",
        "X-Cache-Bust": `auth-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        "X-Requested-With": "XMLHttpRequest",
      };

      const response = await api.get("/v1/user/auth", {
        headers: antiCacheHeaders,
        adapter: undefined,
        timeout: 30000,
      });

      if (response.data.user) {
        const rawUserData = response.data.user;
        const successTimestamp = new Date().toISOString();

        console.log(`✅ ${requestType} ${successTimestamp} - Dados recebidos com sucesso`);
        console.log(`📊 [USER DATA] ${successTimestamp}`, {
          agentes: rawUserData.agents?.length || 0,
          usuario: rawUserData.name,
          plan: rawUserData.plan,
          profileExpire: rawUserData.profileExpire,
          paymentStatus: rawUserData.paymentStatus,
          active:
            !!rawUserData.plan &&
            !!rawUserData.profileExpire &&
            new Date(rawUserData.profileExpire) > new Date(),
        });
        console.log(`🔍 [RAW API DATA] ${successTimestamp}`, rawUserData);

        const userData: User = {
          id: rawUserData.id,
          email: rawUserData.email,
          userName: rawUserData.userName || rawUserData.user_name || "",
          name: rawUserData.name,
          lastName: rawUserData.lastName || rawUserData.last_name || "",
          loginMethod: rawUserData.loginMethod || rawUserData.login_method || "",
          verificationCode: rawUserData.verificationCode || rawUserData.verification_code || "",
          numberAgentes: rawUserData.numberAgentes || rawUserData.number_agentes || 0,
          plan: rawUserData.plan,
          profileExpire: rawUserData.profileExpire || rawUserData.profile_expire,
          paymentStatus: rawUserData.paymentStatus,
          active:
            !!rawUserData.plan &&
            !!rawUserData.profileExpire &&
            new Date(rawUserData.profileExpire) > new Date(),
          appointments: rawUserData.appointments || [],
          createAt: rawUserData.createAt || rawUserData.create_at || "",
          lastLogin: rawUserData.lastLogin || rawUserData.last_login,
          updateAt: rawUserData.updateAt || rawUserData.update_at,
          agents: rawUserData.agents || [],
          invoices: rawUserData.invoices || [],
        };

        setUser(userData);
        const sessionData: Session = {
          user: userData,
          token: localStorage.getItem("jwt-token") || "",
        };
        setSession(sessionData);

        console.log(`💾 [STATE UPDATE] ${successTimestamp} - Estado do usuário atualizado`);

        return userData;
      }

      return null;
    } catch (error: any) {
      const errorTimestamp = new Date().toISOString();
      console.error(`❌ ${requestType} ${errorTimestamp} - Erro ao buscar dados dos agentes`);
      console.error(`🚨 [ERROR DETAILS] ${errorTimestamp}`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      // 402 = pagamento pendente → NÃO limpa token, só propaga erro
      if (error.response?.status === 402) {
        console.log(
          `💳 [AUTH] ${errorTimestamp} - Plano/pagamento pendente (402), repassando erro para quem chamou`,
        );
        throw error;
      }

      // Outros erros (401, 403, 500 etc.), só limpa se não for auto-refresh
      if (!isAutoRefresh) {
        console.log(`🧹 [CLEANUP] ${errorTimestamp} - Removendo dados locais devido ao erro`);
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("user-data");
      }

      throw error;
    }
  };

  useEffect(() => {
    const initTimestamp = new Date().toISOString();

    try {
      console.log(`🚀 [SYSTEM INIT] ${initTimestamp} - Inicializando AuthProvider`);

      const token = localStorage.getItem("jwt-token");

      if (token) {
        console.log(`🔑 [TOKEN FOUND] ${initTimestamp} - Token JWT encontrado, iniciando busca de dados`);

        fetchUserData(false)
          .catch((error) => {
            const errorTimestamp = new Date().toISOString();
            console.error(`❌ [INITIAL FETCH ERROR] ${errorTimestamp}`, error.message || error);
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });

        const autoRefreshInterval = setInterval(() => {
          const refreshTimestamp = new Date().toISOString();
          const currentToken = localStorage.getItem("jwt-token");

          if (currentToken) {
            console.log(
              `⏰ [AUTO-REFRESH TRIGGER] ${refreshTimestamp} - Executando refresh automático (ignorando cache)`,
            );
            fetchUserData(true).catch((error) => {
              const errorTimestamp = new Date().toISOString();
              console.error(`❌ [AUTO-REFRESH ERROR] ${errorTimestamp}`, error.message || error);
            });
          } else {
            const cancelTimestamp = new Date().toISOString();
            console.log(`🚫 [AUTO-REFRESH CANCELLED] ${cancelTimestamp} - Usuário não autenticado`);
            clearInterval(autoRefreshInterval);
          }
        }, 2 * 60 * 1000);

        console.log(
          `✅ [SYSTEM CONFIGURED] ${initTimestamp} - Auto-refresh configurado para 2 minutos com anti-cache`,
        );

        return () => {
          const cleanupTimestamp = new Date().toISOString();
          console.log(`🧹 [CLEANUP] ${cleanupTimestamp} - Limpando sistema de auto-refresh`);
          clearInterval(autoRefreshInterval);
        };
      } else {
        console.log(`🚫 [NO TOKEN] ${initTimestamp} - Nenhum token encontrado`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error(`🚨 [INIT ERROR] ${initTimestamp} - Erro na inicialização do AuthProvider:`, error);
      setLoading(false);
    }
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    plan: string = "BASICO",
  ) => {
    try {
      setLoading(true);
      await api.post("/v1/user/register", {
        name: firstName,
        lastname: lastName,
        email,
        password,
        plan,
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });

      navigate("/verify-email", { state: { email } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao criar conta";
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
    console.log("🔐 Iniciando processo de login para:", email);

    const response = await api.post("/v1/user/login", {
      email,
      password,
    });

    if (!response.data.jwt) {
      throw new Error("JWT não retornado pelo backend");
    }

    console.log("✅ JWT recebido, salvando no localStorage");
    localStorage.setItem("jwt-token", response.data.jwt);

    console.log("📡 Buscando dados do usuário (pós-login)...");
    const freshUser = await fetchUserData(false);

    console.log("👤 Dados do usuário carregados (freshUser):", freshUser);

    // Se por algum motivo não vier user, tratar como sem plano
    if (!freshUser) {
      console.log("⚠️ freshUser vazio, redirecionando para select-plan por segurança");
      navigate("/select-plan");
      return;
    }

    // Se pagamento estiver ativo → dashboard
    if (freshUser.paymentStatus === "ACTIVE") {
      console.log("🔄 Pagamento ativo, redirecionando para dashboard...");

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });

      import("../lib/facebook-pixel").then(({ trackEvent, FacebookEvents }) => {
        trackEvent(FacebookEvents.COMPLETE_REGISTRATION, {
          content_name: "User Login",
          status: "completed",
        });
      });

      navigate("/dashboard");
      return;
    }

    // Qualquer outro status (PENDING_PAYMENT, CANCELED) → select-plan
    console.log(
      `💳 Pagamento não ativo (status=${freshUser.paymentStatus}), redirecionando para select-plan`,
    );
    navigate("/select-plan");
    return;
  } catch (error: any) {
    console.error("❌ Erro no fluxo de login:", error);

    // ⬇️ AQUI É O PONTO CRÍTICO:
    // Se der 402 em QUALQUER chamada (login ou auth), vai para select-plan
    if (error.response?.status === 402) {
      console.log("💳 [CATCH GLOBAL] 402 detectado, redirecionando para /select-plan");
      navigate("/select-plan");
      return;
    }

    let errorMessage = "Erro ao fazer login";

    if (error.response?.status === 401) {
      errorMessage = "Email ou senha incorretos";
    } else if (error.response?.status === 403) {
      errorMessage = "Usuário não verificado. Verifique seu email.";
    } else if (error.response?.status === 402) {
      errorMessage = "Usuário sem plano.";
      navigate("/select-plan");
    } else if (error.response?.status === 404) {
      errorMessage = "Usuário não encontrado";
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
      localStorage.removeItem("jwt-token");
      setSession(null);
      setUser(null);

      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Error during sign out:", error);
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
      await api.put("/v1/user/verify", {
        email,
        verificationCode,
      });

      toast({
        title: "Usuário verificado com sucesso!",
        description: "Você já pode acessar sua conta.",
      });

      try {
        await fetchUserData(false);
        navigate("/select-plan");
      } catch {
        navigate("/login");
      }
    } catch (error: any) {
      let errorMessage = "Erro ao verificar usuário";

      if (error.response?.status === 400) {
        errorMessage = "Dados inválidos";
      } else if (error.response?.status === 404) {
        errorMessage = "Usuário não encontrado";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
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
      await api.post("/v1/user/redeem-password", {
        email,
      });

      toast({
        title: "Código de recuperação enviado!",
        description: "Verifique seu email para recuperar sua senha.",
      });
    } catch (error: any) {
      let errorMessage = "Erro ao solicitar recuperação de senha";

      if (error.response?.status === 403) {
        errorMessage = "Usuário não verificado";
      } else if (error.response?.status === 404) {
        errorMessage = "Usuário não encontrado";
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
      await api.post("/v1/user/redeem-password/code", {
        token,
        newPassword,
      });

      toast({
        title: "Senha alterada com sucesso!",
        description: "Agora você pode fazer login com sua nova senha.",
      });

      navigate("/login");
    } catch (error: any) {
      let errorMessage = "Erro ao alterar senha";

      if (error.response?.status === 403) {
        errorMessage = "Código inválido";
      } else if (error.response?.status === 404) {
        errorMessage = "Usuário não encontrado";
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
    console.error("🚨 useAuth chamado fora do AuthProvider. Componente atual:", new Error().stack);
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};