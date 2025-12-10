
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';

const chartConfig = {
  conversas: {
    label: 'Conversas Iniciadas',
    color: '#1e3a8a'
  },
  clientes: {
    label: 'Clientes Atendidos',
    color: '#1e40af'
  },
  finalizadas: {
    label: 'Conversas Finalizadas',
    color: '#0f172a'
  }
};

const DashboardMetrics = () => {
  const { weeklyChartData, monthlyChartData } = useDashboardMetrics();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Métricas de Atividade</CardTitle>
        <CardDescription>Acompanhe o desempenho dos seus agentes de IA</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className='h-full'>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorConversas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorFinalizadas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="conversas" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorConversas)" />
                    <Area type="monotone" dataKey="clientes" stroke="#1e40af" fillOpacity={1} fill="url(#colorClientes)" />
                    <Area type="monotone" dataKey="finalizadas" stroke="#0f172a" fillOpacity={1} fill="url(#colorFinalizadas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="conversas" fill="#1e3a8a" name="Conversas Iniciadas" />
                    <Bar dataKey="clientes" fill="#1e40af" name="Clientes Atendidos" />
                    <Bar dataKey="finalizadas" fill="#0f172a" name="Conversas Finalizadas" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardMetrics;
