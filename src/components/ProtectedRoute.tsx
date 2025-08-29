
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - Estado atual:', {
    loading,
    hasUser: !!user,
    hasSession: !!session,
    currentPath: window.location.pathname
  });

  if (loading) {
    console.log('⏳ ProtectedRoute - Ainda carregando...');
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user || !session) {
    console.log('🚫 ProtectedRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário tem plano ativo
  // Admin sempre tem acesso (luxfyapp@gmail.com)
  const isAdmin = user.email === 'luxfyapp@gmail.com';
  
  if (!isAdmin) {
    // Debug: verificar todos os campos do usuário
    console.log('🔍 ProtectedRoute - Campos do usuário:', {
      active: user.active,
      profileExpire: user.profileExpire,
      profile_expire: (user as any).profile_expire,
      userKeys: Object.keys(user)
    });
    
    // Verificar se precisa de plano: não ativo OU sem data de expiração OU data expirada
    const needsPlan = !user.active || !user.profileExpire || new Date(user.profileExpire) < new Date();
    
    if (needsPlan) {
      console.log('🚫 ProtectedRoute - Usuário sem plano ativo, redirecionando para seleção de plano');
      return <Navigate to="/select-plan" replace />;
    }
  }

  console.log('✅ ProtectedRoute - Usuário autenticado e ativo, renderizando conteúdo protegido');
  return <>{children}</>;
};

export default ProtectedRoute;
