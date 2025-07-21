
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const clientAcquisitionData = [
  { month: 'Jan', novos: 45, retornando: 25, total: 70 },
  { month: 'Fev', novos: 52, retornando: 30, total: 82 },
  { month: 'Mar', novos: 48, retornando: 35, total: 83 },
  { month: 'Abr', novos: 61, retornando: 40, total: 101 },
  { month: 'Mai', novos: 55, retornando: 45, total: 100 },
  { month: 'Jun', novos: 67, retornando: 50, total: 117 },
];

const conversionFunnelData = [
  { stage: 'Visitantes', count: 1000, percentage: 100 },
  { stage: 'Iniciaram Chat', count: 400, percentage: 40 },
  { stage: 'Engajaram', count: 280, percentage: 28 },
  { stage: 'Interessados', count: 150, percentage: 15 },
  { stage: 'Converteram', count: 85, percentage: 8.5 },
];

const clientSourceData = [
  { source: 'Website', clients: 45 },
  { source: 'WhatsApp', clients: 67 },
  { source: 'Instagram', clients: 31 },
  { source: 'Referência', clients: 19 },
  { source: 'Outros', clients: 23 },
];

const chartConfig = {
  novos: { label: 'Novos Clientes', color: '#10B981' },
  retornando: { label: 'Retornando', color: '#1EAEDB' },
  total: { label: 'Total', color: '#8B5CF6' },
};

const ClientMetrics = () => {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Novos Clientes</CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+67</div>
            <p className="text-xs text-muted-foreground mt-1">+15% vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
            <CardDescription>Chat → Cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8.5%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.1% vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Valor Médio</CardTitle>
            <CardDescription>Por cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">R$ 847</div>
            <p className="text-xs text-muted-foreground mt-1">+5.2% vs mês anterior</p>
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
                    <span className="text-sm font-medium">{stage.percentage}%</span>
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
