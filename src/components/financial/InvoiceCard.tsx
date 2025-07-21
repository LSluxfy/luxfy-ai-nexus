
import React from 'react';
import { ApiInvoice } from '@/types/invoice';
import { InvoiceService } from '@/services/invoiceService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, Clock, XCircle } from 'lucide-react';

interface InvoiceCardProps {
  invoice: ApiInvoice;
  onDownload: (invoiceId: number, fileName?: string) => void;
  isDownloading: boolean;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ 
  invoice, 
  onDownload, 
  isDownloading 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDownload = () => {
    const fileName = `fatura-${invoice.publicId}.pdf`;
    onDownload(invoice.id, fileName);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {getStatusIcon(invoice.status)}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-medium">Fatura #{invoice.id}</span>
            <Badge className={InvoiceService.getStatusColor(invoice.status)}>
              {InvoiceService.getStatusText(invoice.status)}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-4">
              <span>
                {formatDate(invoice.createdAt)} • {InvoiceService.getActionText(invoice.action)}
              </span>
              {invoice.dueDate && (
                <span className="text-xs">
                  Venc: {formatDate(invoice.dueDate)}
                </span>
              )}
            </div>
            
            {invoice.description && (
              <div className="text-xs text-gray-500">
                {invoice.description}
              </div>
            )}
            
            {invoice.paymentDate && (
              <div className="text-xs text-green-600">
                Pago em {formatDate(invoice.paymentDate)}
                {invoice.paidWith && ` via ${invoice.paidWith}`}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium text-lg">
            {formatCurrency(invoice.paidValue || invoice.amount)}
          </div>
          {invoice.paidValue && invoice.paidValue !== invoice.amount && (
            <div className="text-xs text-gray-500">
              Valor original: {formatCurrency(invoice.amount)}
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
