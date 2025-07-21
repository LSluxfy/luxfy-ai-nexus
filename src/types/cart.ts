export interface PaymentLinkResponse {
  message: string;
  link: string;
}

export interface CartPaymentError {
  error: string;
}

export interface PaymentAttempt {
  id: string;
  invoiceId: number;
  timestamp: Date;
  status: 'pending' | 'success' | 'failed';
  stripeLink?: string;
}