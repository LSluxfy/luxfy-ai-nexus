import { useState } from 'react';
import { CartService } from '@/services/cartService';
import { useToast } from '@/hooks/use-toast';
import { PaymentAttempt } from '@/types/cart';

export const useCart = () => {
  const [isGeneratingPayment, setIsGeneratingPayment] = useState<number | null>(null);
  const [paymentAttempts, setPaymentAttempts] = useState<PaymentAttempt[]>([]);
  const { toast } = useToast();

  const generatePaymentLink = async (invoiceId: number): Promise<string | null> => {
    setIsGeneratingPayment(invoiceId);
    
    try {
      const link = await CartService.generatePaymentLink(invoiceId);
      
      // Record payment attempt
      const attempt: PaymentAttempt = {
        id: `${invoiceId}-${Date.now()}`,
        invoiceId,
        timestamp: new Date(),
        status: 'pending',
        stripeLink: link
      };
      
      setPaymentAttempts(prev => [attempt, ...prev]);
      
      toast({
        title: 'Link de pagamento gerado',
        description: 'Redirecionando para o checkout...',
        variant: 'default',
      });
      
      return link;
    } catch (error) {
      console.error('Error generating payment link:', error);
      
      // Record failed attempt
      const attempt: PaymentAttempt = {
        id: `${invoiceId}-${Date.now()}`,
        invoiceId,
        timestamp: new Date(),
        status: 'failed'
      };
      
      setPaymentAttempts(prev => [attempt, ...prev]);
      
      toast({
        title: 'Erro ao gerar pagamento',
        description: 'Não foi possível gerar o link de pagamento. Tente novamente.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsGeneratingPayment(null);
    }
  };

  const redirectToPayment = async (invoiceId: number): Promise<void> => {
    try {
      const link = await generatePaymentLink(invoiceId);
      if (link) {
        // Open Stripe checkout in a new tab
        window.open(link, '_blank');
      }
    } catch (error) {
      console.error('Error redirecting to payment:', error);
    }
  };

  const markPaymentSuccess = (invoiceId: number) => {
    setPaymentAttempts(prev => 
      prev.map(attempt => 
        attempt.invoiceId === invoiceId && attempt.status === 'pending'
          ? { ...attempt, status: 'success' }
          : attempt
      )
    );
  };

  const markPaymentFailed = (invoiceId: number) => {
    setPaymentAttempts(prev => 
      prev.map(attempt => 
        attempt.invoiceId === invoiceId && attempt.status === 'pending'
          ? { ...attempt, status: 'failed' }
          : attempt
      )
    );
  };

  return {
    generatePaymentLink,
    redirectToPayment,
    markPaymentSuccess,
    markPaymentFailed,
    isGeneratingPayment,
    paymentAttempts,
  };
};