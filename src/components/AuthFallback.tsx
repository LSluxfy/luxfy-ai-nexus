import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AuthFallbackProps {
  error?: string;
  onRetry?: () => void;
}

const AuthFallback: React.FC<AuthFallbackProps> = ({ error, onRetry }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Erro de Autenticação</CardTitle>
          <CardDescription>
            {error || 'Houve um problema ao inicializar o sistema de autenticação.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            )}
            <Button 
              onClick={handleReload}
              className="flex-1"
            >
              Recarregar Página
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthFallback;