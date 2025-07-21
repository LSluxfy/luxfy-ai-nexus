import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { ApiInvoice } from '@/types/invoice';

interface PaymentButtonProps {
  invoice: ApiInvoice;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const PaymentButton = ({ 
  invoice, 
  variant = 'default', 
  size = 'default',
  showIcon = true,
  className = ''
}: PaymentButtonProps) => {
  const { redirectToPayment, isGeneratingPayment } = useCart();

  const handlePayment = async () => {
    await redirectToPayment(invoice.id);
  };

  const isLoading = isGeneratingPayment === invoice.id;
  const isPending = invoice.status === 'PENDING';

  if (!isPending) {
    return null;
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          {showIcon && <CreditCard className="mr-2 h-4 w-4" />}
          Pagar Agora
        </>
      )}
    </Button>
  );
};