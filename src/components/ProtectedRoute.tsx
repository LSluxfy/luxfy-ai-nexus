
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

  console.log('✅ ProtectedRoute - Usuário autenticado, renderizando conteúdo protegido');
  return <>{children}</>;
};

export default ProtectedRoute;
