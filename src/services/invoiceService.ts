
import { api } from '@/lib/api';
import { GetInvoicesResponse, ApiInvoice, InvoiceFilters } from '@/types/invoice';

export class InvoiceService {
  static async getInvoices(filters?: InvoiceFilters): Promise<ApiInvoice[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.action) {
        params.append('action', filters.action);
      }
      if (filters?.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('endDate', filters.endDate);
      }

      const queryString = params.toString();
      const url = queryString ? `/invoices?${queryString}` : '/invoices';
      
      const response = await api.get<GetInvoicesResponse>(url);
      
      console.log('Invoices fetched successfully:', response.data);
      return response.data.invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  static async downloadInvoice(invoiceId: number): Promise<Blob> {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  }

  static getActionText(action: string): string {
    switch (action) {
      case 'upgrade_plan':
        return 'Upgrade de Plano';
      case 'subscription':
        return 'Assinatura';
      case 'setup_fee':
        return 'Taxa de Configuração';
      default:
        return action;
    }
  }
}
