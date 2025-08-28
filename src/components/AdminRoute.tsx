import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, session, loading, isAdmin } = useAuth();

  console.log('🔒 AdminRoute - Estado atual:', {
    loading,
    hasUser: !!user,
    hasSession: !!session,
    isAdmin,
    currentPath: window.location.pathname
  });

  if (loading) {
    console.log('⏳ AdminRoute - Ainda carregando...');
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user || !session) {
    console.log('🚫 AdminRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('🚫 AdminRoute - Usuário não é admin, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ AdminRoute - Usuário admin autenticado, renderizando conteúdo admin');
  return <>{children}</>;
};

export default AdminRoute;