import { supabase } from '@/integrations/supabase/client';

export interface PendingInvoice {
  id: number;
  publicId: string;
  amount: number;
  status: string;
  action: string;
  description: string;
  dueDate?: string;
  createdAt: string;
  user_id: number;
  user_email?: string;
  user_name?: string;
  user_active?: boolean;
}

export interface InvoiceStats {
  totalPendingInvoices: number;
  totalPendingAmount: number;
  affectedUsers: number;
  averageAmount: number;
  lowValueInvoices: number;
}

export class AdminInvoiceService {
  /**
   * Get all pending invoices with user information
   */
  static async getPendingInvoices(): Promise<PendingInvoice[]> {
    try {
      // Using direct SQL query to join invoices with users table
      const { data, error } = await supabase.rpc('get_pending_invoices_with_users');
      
      if (error) {
        console.error('Error fetching pending invoices:', error);
        throw new Error(`Erro ao buscar faturas pendentes: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('AdminInvoiceService.getPendingInvoices error:', error);
      throw error;
    }
  }

  /**
   * Get statistics about pending invoices
   */
  static async getInvoiceStats(): Promise<InvoiceStats> {
    try {
      const { data, error } = await supabase.rpc('get_invoice_statistics');
      
      if (error) {
        console.error('Error fetching invoice stats:', error);
        throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
      }

      return data || {
        totalPendingInvoices: 0,
        totalPendingAmount: 0,
        affectedUsers: 0,
        averageAmount: 0,
        lowValueInvoices: 0,
      };
    } catch (error) {
      console.error('AdminInvoiceService.getInvoiceStats error:', error);
      throw error;
    }
  }

  /**
   * Mark an invoice as paid
   */
  static async markInvoiceAsPaid({ 
    invoiceId, 
    paidValue 
  }: { 
    invoiceId: number; 
    paidValue?: number; 
  }): Promise<void> {
    try {
      // First get the invoice to determine the paid value
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('amount')
        .eq('id', invoiceId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao buscar fatura: ${fetchError.message}`);
      }

      const finalPaidValue = paidValue ?? invoice.amount;

      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'PAID',
          payment_date: new Date().toISOString(),
          paid_value: finalPaidValue,
          update_at: new Date().toISOString(),
        })
        .eq('id', invoiceId);

      if (error) {
        console.error('Error updating invoice:', error);
        throw new Error(`Erro ao atualizar fatura: ${error.message}`);
      }

      console.log(`Invoice ${invoiceId} marked as paid with value ${finalPaidValue}`);
    } catch (error) {
      console.error('AdminInvoiceService.markInvoiceAsPaid error:', error);
      throw error;
    }
  }

  /**
   * Get invoice details by ID
   */
  static async getInvoiceDetails(invoiceId: number): Promise<PendingInvoice | null> {
    try {
      const { data, error } = await supabase.rpc('get_invoice_details', {
        invoice_id: invoiceId
      });

      if (error) {
        console.error('Error fetching invoice details:', error);
        throw new Error(`Erro ao buscar detalhes da fatura: ${error.message}`);
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('AdminInvoiceService.getInvoiceDetails error:', error);
      throw error;
    }
  }

  /**
   * Audit log for invoice changes
   */
  static async logInvoiceAction(
    invoiceId: number, 
    action: string, 
    details?: any
  ): Promise<void> {
    try {
      console.log(`AUDIT LOG: Invoice ${invoiceId} - ${action}`, details);
      // Here you could implement a proper audit log table
      // For now, we're just logging to console
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  }
}