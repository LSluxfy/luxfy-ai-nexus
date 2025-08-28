
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

  // Verificar se a conta está ativa e não expirada
  const isExpired = user.profileExpire && new Date(user.profileExpire) < new Date();
  const isInactive = !user.active;

  if (isInactive || isExpired) {
    console.log('⚠️ ProtectedRoute - Conta inativa ou expirada, redirecionando para ativação');
    return <Navigate to="/account-inactive" replace />;
  }

  console.log('✅ ProtectedRoute - Usuário autenticado e ativo, renderizando conteúdo protegido');
  return <>{children}</>;
};

export default ProtectedRoute;
