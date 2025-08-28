import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PricingV2 from '@/components/landing/PricingV2';

export default function SelectPlan() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com informações do usuário */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
              <p className="text-muted-foreground">Escolha um plano para começar a usar a plataforma</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>

      {/* Aviso de acesso bloqueado */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Acesso Restrito</CardTitle>
            <CardDescription>
              Para acessar todas as funcionalidades da plataforma, você precisa escolher e ativar um plano.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Após o pagamento, você terá acesso imediato ao dashboard</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Componente de pricing */}
        <PricingV2 />
      </div>
    </div>
  );
}