
import { useApiAuth } from '@/contexts/ApiAuthContext';
import { Navigate } from 'react-router-dom';

interface ApiProtectedRouteProps {
  children: React.ReactNode;
}

const ApiProtectedRoute = ({ children }: ApiProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useApiAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ApiProtectedRoute;
