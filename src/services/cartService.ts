import { api } from '@/lib/api';
import { PaymentLinkResponse, CartPaymentError } from '@/types/cart';

export class CartService {
  static async generatePaymentLink(invoiceId: number): Promise<string> {
    try {
      const response = await api.get<PaymentLinkResponse>(`/v1/cart/pay/${invoiceId}`);
      
      console.log('Payment link generated successfully:', response.data);
      return response.data.link;
    } catch (error) {
      console.error('Error generating payment link:', error);
      throw error;
    }
  }

  static async redirectToPayment(invoiceId: number): Promise<void> {
    try {
      const paymentLink = await this.generatePaymentLink(invoiceId);
      
      // Open Stripe checkout in a new tab
      window.open(paymentLink, '_blank');
    } catch (error) {
      console.error('Error redirecting to payment:', error);
      throw error;
    }
  }
}