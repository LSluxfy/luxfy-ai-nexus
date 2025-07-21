
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface ApiInvoice {
  id: number;
  publicId: string;
  amount: number;
  status: InvoiceStatus;
  action: string;
  description: string;
  dueDate?: string | null;
  paymentDate?: string | null;
  paidWith?: string | null;
  paidValue?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetInvoicesResponse {
  message: string;
  invoices: ApiInvoice[];
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface InvoiceStats {
  totalPaid: number;
  totalPending: number;
  totalCancelled: number;
  count: {
    paid: number;
    pending: number;
    cancelled: number;
    total: number;
  };
}
