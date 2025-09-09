import React, { Suspense, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

interface SafeRouteProps {
  children: ReactNode;
  fallbackMessage?: string;
  loadingMessage?: string;
}

const SafeRoute = ({ 
  children, 
  fallbackMessage = "Erro ao carregar página", 
  loadingMessage = "Carregando..." 
}: SafeRouteProps) => {
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">{fallbackMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    }>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default SafeRoute;