
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiInvoice, InvoiceFilters, InvoiceStats } from '@/types/invoice';
import { InvoiceService } from '@/services/invoiceService';
import { useToast } from '@/hooks/use-toast';

export const useInvoices = (filters?: InvoiceFilters) => {
  const { toast } = useToast();
  const [downloadingInvoice, setDownloadingInvoice] = useState<number | null>(null);

  const {
    data: invoices = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => InvoiceService.getInvoices(filters),
  });

  // Handle errors with useEffect instead of onError callback
  useEffect(() => {
    if (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: 'Erro ao carregar faturas',
        description: 'Não foi possível carregar as faturas. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const downloadInvoice = async (invoiceId: number, fileName?: string) => {
    try {
      setDownloadingInvoice(invoiceId);
      
      const blob = await InvoiceService.downloadInvoice(invoiceId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `fatura-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download realizado',
        description: 'A fatura foi baixada com sucesso.',
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar a fatura. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const calculateStats = (invoices: ApiInvoice[]): InvoiceStats => {
    const stats: InvoiceStats = {
      totalPaid: 0,
      totalPending: 0,
      totalCancelled: 0,
      count: {
        paid: 0,
        pending: 0,
        cancelled: 0,
        total: invoices.length
      }
    };

    invoices.forEach(invoice => {
      switch (invoice.status) {
        case 'PAID':
          stats.totalPaid += invoice.paidValue || invoice.amount;
          stats.count.paid++;
          break;
        case 'PENDING':
          stats.totalPending += invoice.amount;
          stats.count.pending++;
          break;
        case 'CANCELLED':
          stats.totalCancelled += invoice.amount;
          stats.count.cancelled++;
          break;
      }
    });

    return stats;
  };

  const stats = calculateStats(invoices);

  const getNextPayment = (): ApiInvoice | null => {
    const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING' && inv.dueDate);
    if (pendingInvoices.length === 0) return null;
    
    return pendingInvoices.sort((a, b) => 
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )[0];
  };

  return {
    invoices,
    isLoading,
    error,
    refetch,
    downloadInvoice,
    downloadingInvoice,
    stats,
    nextPayment: getNextPayment()
  };
};
