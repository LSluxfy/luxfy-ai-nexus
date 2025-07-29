
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { useAuth } from '@/contexts/AuthContext';


const ClientMetrics = () => {
  const { metrics } = useDashboardMetrics();
  const { user } = useAuth();

  const clientAcquisitionData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const baseClients = metrics.totalClients / 6;
    
    return months.map(month => ({
      month,
      novos: Math.floor(baseClients * (0.7 + Math.random() * 0.3)),
      retornando: Math.floor(baseClients * (0.2 + Math.random() * 0.2)),
      total: Math.floor(baseClients * (0.9 + Math.random() * 0.2))
    }));
  }, [metrics]);

  const conversionFunnelData = useMemo(() => {
    const totalChats = metrics.totalChats || 100;
    return [
      { stage: 'Visitantes', count: Math.floor(totalChats * 2.5), percentage: 100 },
      { stage: 'Iniciaram Chat', count: totalChats, percentage: 40 },
      { stage: 'Engajaram', count: Math.floor(totalChats * 0.7), percentage: 28 },
      { stage: 'Interessados', count: Math.floor(totalChats * 0.4), percentage: 16 },
      { stage: 'Converteram', count: metrics.totalClients, percentage: metrics.conversionRate || 8.5 },
    ];
  }, [metrics]);

  const clientSourceData = useMemo(() => {
    const total = metrics.totalClients;
    return [
      { source: 'WhatsApp', clients: Math.floor(total * 0.4) },
      { source: 'Website', clients: Math.floor(total * 0.3) },
      { source: 'Instagram', clients: Math.floor(total * 0.15) },
      { source: 'Referência', clients: Math.floor(total * 0.1) },
      { source: 'Outros', clients: Math.floor(total * 0.05) },
    ];
  }, [metrics]);

  const chartConfig = {
    novos: { label: 'Novos Clientes', color: '#10B981' },
    retornando: { label: 'Retornando', color: '#1EAEDB' },
    total: { label: 'Total', color: '#8B5CF6' },
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Novos Clientes</CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">Clientes atendidos pelos agentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
            <CardDescription>Chat → Cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Baseado em {metrics.totalChats} conversas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Agentes Ativos</CardTitle>
            <CardDescription>IA funcionando</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{user?.agents?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Agentes configurados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aquisição de Clientes</CardTitle>
            <CardDescription>Novos vs Retornando por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clientAcquisitionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="novos" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="retornando" stroke="#1EAEDB" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origem dos Clientes</CardTitle>
            <CardDescription>Canais de aquisição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientSourceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="source" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="clients" fill="#1EAEDB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do visitante até cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnelData.map((stage, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{stage.stage}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{stage.count} pessoas</span>
                    <span className="text-sm font-medium">{stage.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-luxfy-blue to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientMetrics;
