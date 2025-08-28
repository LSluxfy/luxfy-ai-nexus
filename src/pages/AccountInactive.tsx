import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CreditCard, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountInactive() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleGoToPayment = () => {
    navigate('/financeiro');
  };

  const handleSignOut = () => {
    signOut();
  };

  const isExpired = user?.profileExpire && new Date(user.profileExpire) < new Date();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Conta Inativa</CardTitle>
          <CardDescription>
            {isExpired 
              ? 'Sua conta expirou e precisa ser renovada'
              : 'Sua conta ainda não foi ativada'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {isExpired 
                  ? `Expirou em: ${new Date(user?.profileExpire || '').toLocaleDateString('pt-BR')}`
                  : 'Aguardando ativação do plano'
                }
              </span>
            </div>
            {user?.plan && (
              <div className="mt-2 text-sm font-medium">
                Plano atual: {user.plan}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleGoToPayment} 
              className="w-full"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isExpired ? 'Renovar Plano' : 'Ativar Conta'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full"
            >
              Sair da Conta
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Precisa de ajuda? Entre em contato com o suporte.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}