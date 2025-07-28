import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const PendingInvoice = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const invoiceId = searchParams.get('invoice');

  useEffect(() => {
    if (!invoiceId) {
      navigate('/login');
    }
  }, [invoiceId, navigate]);

  const handlePayment = async () => {
    if (!invoiceId) return;
    
    setIsLoading(true);
    
    try {
      const response = await api.get(`/v1/cart/pay/${invoiceId}`);
      
      if (response.data.link) {
        // Redirecionar para o link de pagamento do Stripe
        window.open(response.data.link, '_blank');
        
        toast({
          title: 'Redirecionando para pagamento',
          description: 'Você será redirecionado para completar o pagamento.',
          variant: 'default',
        });
      }
    } catch (error: any) {
      console.error('Erro ao gerar link de pagamento:', error);
      
      let errorMessage = 'Erro ao gerar link de pagamento';
      if (error.response?.status === 404) {
        errorMessage = 'Fatura não encontrada';
      } else if (error.response?.status === 400) {
        errorMessage = 'ID da fatura inválido';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast({
        title: 'Erro no pagamento',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (!invoiceId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Fatura Pendente</CardTitle>
          <CardDescription>
            Você possui uma fatura pendente que precisa ser paga para continuar usando a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            ID da Fatura: #{invoiceId}
          </div>
          
          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando link...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar Fatura
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleBackToLogin}
            className="w-full"
            disabled={isLoading}
          >
            Voltar ao Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};