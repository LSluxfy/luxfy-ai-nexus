import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle, 
  Eye, 
  AlertTriangle, 
  Calendar,
  User,
  Mail
} from 'lucide-react';
import { PendingInvoice } from '@/services/adminInvoiceService';

interface PendingInvoicesListProps {
  invoices: PendingInvoice[];
  selectedInvoices: number[];
  onSelectInvoice: (invoiceId: number, selected: boolean) => void;
  onMarkAsPaid: (invoiceId: number, paidValue?: number) => void;
  onViewDetails: (invoice: PendingInvoice) => void;
  isMarkingPaid: boolean;
  formatCurrency: (value: number) => string;
}

export const PendingInvoicesList: React.FC<PendingInvoicesListProps> = ({
  invoices,
  selectedInvoices,
  onSelectInvoice,
  onMarkAsPaid,
  onViewDetails,
  isMarkingPaid,
  formatCurrency,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysSinceCreated = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - created.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyBadge = (invoice: PendingInvoice) => {
    const days = getDaysSinceCreated(invoice.createdAt);
    
    if (days > 30) {
      return <Badge variant="destructive">Crítico ({days}d)</Badge>;
    } else if (days > 7) {
      return <Badge variant="secondary">Atenção ({days}d)</Badge>;
    } else {
      return <Badge variant="outline">Recente ({days}d)</Badge>;
    }
  };

  const isLowValue = (amount: number) => amount < 1;

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Nenhuma fatura pendente</h3>
        <p className="text-muted-foreground">Todas as faturas estão em dia!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedInvoices.length === invoices.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    invoices.forEach(invoice => {
                      if (!selectedInvoices.includes(invoice.id)) {
                        onSelectInvoice(invoice.id, true);
                      }
                    });
                  } else {
                    selectedInvoices.forEach(id => onSelectInvoice(id, false));
                  }
                }}
              />
            </TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Fatura</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Urgência</TableHead>
            <TableHead>Status Usuário</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow 
              key={invoice.id}
              className={isLowValue(invoice.amount) ? 'bg-green-50' : ''}
            >
              <TableCell>
                <Checkbox
                  checked={selectedInvoices.includes(invoice.id)}
                  onCheckedChange={(checked) => 
                    onSelectInvoice(invoice.id, !!checked)
                  }
                />
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{invoice.user_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{invoice.user_email}</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">#{invoice.publicId}</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.description}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(invoice.createdAt)}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className={`font-medium ${isLowValue(invoice.amount) ? 'text-green-600' : ''}`}>
                  {formatCurrency(invoice.amount)}
                </div>
                {isLowValue(invoice.amount) && (
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                    Valor baixo
                  </Badge>
                )}
              </TableCell>
              
              <TableCell>
                {getUrgencyBadge(invoice)}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  {invoice.user_active ? (
                    <Badge variant="outline" className="text-green-700 bg-green-50">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Inativo
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(invoice)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onMarkAsPaid(invoice.id)}
                    disabled={isMarkingPaid}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Marcar Pago
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <span>
          {invoices.length} faturas pendentes
        </span>
        <span>
          {invoices.filter(inv => isLowValue(inv.amount)).length} com valor baixo (&lt; $1)
        </span>
      </div>
    </div>
  );
};