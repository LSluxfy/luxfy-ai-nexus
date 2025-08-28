import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { PendingInvoice } from '@/services/adminInvoiceService';

interface InvoiceDetailsModalProps {
  invoice: PendingInvoice;
  open: boolean;
  onClose: () => void;
  onMarkAsPaid: (invoiceId: number, paidValue?: number) => void;
  formatCurrency: (value: number) => string;
  isMarkingPaid: boolean;
}

export const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  invoice,
  open,
  onClose,
  onMarkAsPaid,
  formatCurrency,
  isMarkingPaid,
}) => {
  const [customPaidValue, setCustomPaidValue] = useState<string>('');
  const [useCustomValue, setUseCustomValue] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysSinceCreated = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - created.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleMarkAsPaid = () => {
    const paidValue = useCustomValue && customPaidValue 
      ? parseFloat(customPaidValue.replace(',', '.')) 
      : undefined;
    
    onMarkAsPaid(invoice.id, paidValue);
    onClose();
  };

  const isLowValue = invoice.amount < 1;
  const daysSinceCreated = getDaysSinceCreated(invoice.createdAt);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Fatura #{invoice.publicId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações do Usuário
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">Nome:</Label>
                  <div className="font-medium">{invoice.user_name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email:</Label>
                  <div className="font-medium flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {invoice.user_email}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status da Conta:</Label>
                  <div>
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
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Informações da Fatura
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">ID:</Label>
                  <div className="font-medium">#{invoice.publicId}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor:</Label>
                  <div className={`font-medium text-lg ${isLowValue ? 'text-green-600' : ''}`}>
                    {formatCurrency(invoice.amount)}
                    {isLowValue && (
                      <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-700">
                        Valor baixo
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status:</Label>
                  <div>
                    <Badge variant="secondary">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Detalhes da Transação
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Ação:</Label>
                <div className="font-medium">{invoice.action}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição:</Label>
                <div className="font-medium">{invoice.description}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Criação:</Label>
                <div className="font-medium flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(invoice.createdAt)}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Vencimento:</Label>
                <div className="font-medium">
                  {formatDate(invoice.dueDate)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Urgency Analysis */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Análise de Urgência
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-bold">
                  {daysSinceCreated}
                </div>
                <div className="text-muted-foreground">dias pendente</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className={`text-lg font-bold ${isLowValue ? 'text-green-600' : 'text-red-600'}`}>
                  {isLowValue ? 'Baixo' : 'Normal'}
                </div>
                <div className="text-muted-foreground">valor</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className={`text-lg font-bold ${daysSinceCreated > 30 ? 'text-red-600' : daysSinceCreated > 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {daysSinceCreated > 30 ? 'Alta' : daysSinceCreated > 7 ? 'Média' : 'Baixa'}
                </div>
                <div className="text-muted-foreground">prioridade</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Actions */}
          <div className="space-y-4">
            <h3 className="font-medium">Marcar como Pago</h3>
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment-type"
                  checked={!useCustomValue}
                  onChange={() => setUseCustomValue(false)}
                />
                Usar valor original ({formatCurrency(invoice.amount)})
              </Label>
              
              <Label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment-type"
                  checked={useCustomValue}
                  onChange={() => setUseCustomValue(true)}
                />
                Usar valor customizado
              </Label>
              
              {useCustomValue && (
                <div className="ml-6">
                  <Label htmlFor="custom-value">Valor pago:</Label>
                  <Input
                    id="custom-value"
                    type="number"
                    step="0.01"
                    value={customPaidValue}
                    onChange={(e) => setCustomPaidValue(e.target.value)}
                    placeholder="0.00"
                    className="w-32"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleMarkAsPaid}
                disabled={isMarkingPaid}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isMarkingPaid ? 'Processando...' : 'Marcar como Pago'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};