import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  User, 
  CreditCard, 
  Calendar,
  DollarSign,
  RefreshCw,
  Eye
} from 'lucide-react';
import { AdminInvoiceService } from '@/services/adminInvoiceService';
import { useToast } from '@/hooks/use-toast';
import { PendingInvoicesList } from '@/components/admin/PendingInvoicesList';
import { InvoiceDetailsModal } from '@/components/admin/InvoiceDetailsModal';
import { BulkActionsPanel } from '@/components/admin/BulkActionsPanel';

export const AdminInvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending invoices
  const { data: pendingInvoices, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-pending-invoices'],
    queryFn: AdminInvoiceService.getPendingInvoices,
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-invoice-stats'],
    queryFn: AdminInvoiceService.getInvoiceStats,
  });

  // Mark invoice as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: AdminInvoiceService.markInvoiceAsPaid,
    onSuccess: () => {
      toast({
        title: 'Fatura atualizada',
        description: 'A fatura foi marcada como paga com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['admin-invoice-stats'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar fatura',
        description: error.message || 'Não foi possível atualizar a fatura.',
        variant: 'destructive',
      });
    },
  });

  const handleMarkAsPaid = async (invoiceId: number, paidValue?: number) => {
    await markAsPaidMutation.mutateAsync({ invoiceId, paidValue });
  };

  const handleBulkMarkAsPaid = async () => {
    for (const invoiceId of selectedInvoices) {
      await handleMarkAsPaid(invoiceId);
    }
    setSelectedInvoices([]);
  };

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const filteredInvoices = pendingInvoices?.filter((invoice: any) =>
    invoice.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.publicId?.includes(searchTerm) ||
    invoice.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title="Admin - Faturas Pendentes" />
        <main className="flex-1 p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar faturas: {error.message}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Admin - Faturas Pendentes" />
      
      <main className="flex-1 p-6 bg-background">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
              <p className="text-muted-foreground">Gerencie faturas pendentes e resolva problemas de acesso</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPendingInvoices}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(stats.totalPendingAmount)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Afetados</CardTitle>
                <User className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.affectedUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Contas bloqueadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.averageAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Por fatura pendente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturas Baixo Valor</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowValueInvoices}</div>
                <p className="text-xs text-muted-foreground">
                  Candidatas à resolução automática
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros e Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Pesquisar por email, ID ou descrição</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="inkalandexplorers@gmail.com"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <BulkActionsPanel
            selectedCount={selectedInvoices.length}
            onMarkAllPaid={handleBulkMarkAsPaid}
            onClearSelection={() => setSelectedInvoices([])}
            isLoading={markAsPaidMutation.isPending}
          />
        )}

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Faturas Pendentes ({filteredInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Carregando faturas...
              </div>
            ) : (
              <PendingInvoicesList
                invoices={filteredInvoices}
                selectedInvoices={selectedInvoices}
                onSelectInvoice={(invoiceId, selected) => {
                  if (selected) {
                    setSelectedInvoices([...selectedInvoices, invoiceId]);
                  } else {
                    setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
                  }
                }}
                onMarkAsPaid={handleMarkAsPaid}
                onViewDetails={handleViewDetails}
                isMarkingPaid={markAsPaidMutation.isPending}
                formatCurrency={formatCurrency}
              />
            )}
          </CardContent>
        </Card>

        {/* Invoice Details Modal */}
        {selectedInvoice && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            open={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedInvoice(null);
            }}
            onMarkAsPaid={handleMarkAsPaid}
            formatCurrency={formatCurrency}
            isMarkingPaid={markAsPaidMutation.isPending}
          />
        )}
      </main>
    </div>
  );
};