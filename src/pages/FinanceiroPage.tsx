
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowUpRight, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceList } from '@/components/financial/InvoiceList';
import { useInvoices } from '@/hooks/use-invoices';
import { InvoiceService } from '@/services/invoiceService';

const FinanceiroPage = () => {
  const [currentPlan] = useState({
    name: 'Plano Básico',
    price: '$22,00',
    period: 'mensal',
    features: ['1 Agente', 'CRM avanzado', 'IA gratis incluida', 'Respuestas ilimitadas', 'Agenda con sincronización', 'Campañas de WhatsApp', 'Soporte prioritario']
  });

  const [availablePlans] = useState([
    {
      name: 'Básico',
      price: '$22',
      period: '/mês',
      current: true,
      features: ['1 Agente', 'CRM avanzado', 'IA gratis incluida', 'Respuestas ilimitadas', 'Agenda con sincronización', 'Campañas de WhatsApp', 'Soporte prioritario']
    },
    {
      name: 'Pro',
      price: '$39',
      period: '/mês',
      current: false,
      popular: true,
      features: ['3 Agentes', 'CRM avanzado', 'IA gratis incluida', 'Respuestas ilimitadas', 'Agenda con sincronización', 'Campañas de WhatsApp', 'Soporte prioritario']
    },
    {
      name: 'Premium',
      price: '$79',
      period: '/mês',
      current: false,
      features: ['6 Agentes', 'CRM avanzado', 'IA gratis incluida', 'Respuestas ilimitadas', 'Agenda con sincronización', 'Campañas de WhatsApp', 'Soporte prioritario']
    }
  ]);

  // Use real invoice data for next payment
  const { nextPayment, stats } = useInvoices();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Financeiro" />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento Financeiro</h2>
          <p className="text-gray-600">Gerencie seu plano, faturas e faça upgrades</p>
        </div>

        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="plan">Plano Atual</TabsTrigger>
            <TabsTrigger value="upgrade">Fazer Upgrade</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Plano Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                        <p className="text-gray-600">Renovação automática ativa</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-luxfy-purple">{currentPlan.price}</div>
                        <div className="text-sm text-gray-500">por mês</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Recursos Inclusos:</h4>
                      <ul className="space-y-1">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Estatísticas de Faturas */}
                    {stats && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Resumo Financeiro:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Total Pago:</span>
                            <div className="font-medium text-green-600">
                              {formatCurrency(stats.totalPaid)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Pendente:</span>
                            <div className="font-medium text-yellow-600">
                              {formatCurrency(stats.totalPending)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline">Cancelar Plano</Button>
                      <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Fazer Upgrade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próxima Cobrança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nextPayment ? (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {calculateDaysUntilDue(nextPayment.dueDate!)} dias
                          </div>
                          <div className="text-sm text-gray-500">para vencimento</div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Data:</span>
                            <span>{formatDate(nextPayment.dueDate!)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Valor:</span>
                            <span className="font-medium">{formatCurrency(nextPayment.amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Descrição:</span>
                            <span className="text-xs">{nextPayment.description}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge className={InvoiceService.getStatusColor(nextPayment.status)}>
                              {InvoiceService.getStatusText(nextPayment.status)}
                            </Badge>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-500">
                          Nenhuma cobrança pendente
                        </div>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full">
                      Alterar Método
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upgrade" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.current ? 'border-luxfy-purple' : ''} ${plan.popular ? 'border-2 border-yellow-400' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900">
                      Mais Popular
                    </Badge>
                  )}
                  {plan.current && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-luxfy-purple">
                      Plano Atual
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-500">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.current ? 'bg-gray-400' : 'bg-luxfy-purple hover:bg-luxfy-darkPurple'}`}
                      disabled={plan.current}
                    >
                      {plan.current ? 'Plano Atual' : 'Fazer Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FinanceiroPage;
