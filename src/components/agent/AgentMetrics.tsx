import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Users, Clock, Star } from 'lucide-react';
import { ApiAgent, AgentMetrics as MetricsType } from '@/types/agent-api';

interface AgentMetricsProps {
  agent: ApiAgent;
}

export function AgentMetrics({ agent }: AgentMetricsProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState('all');

  const metrics = agent.metrics || {};
  const years = Object.keys(metrics).sort().reverse();
  const months = selectedYear && metrics[selectedYear] ? Object.keys(metrics[selectedYear]).sort() : [];

  const getMetricsData = () => {
    if (!metrics[selectedYear]) return [];

    if (selectedMonth === 'all') {
      return Object.entries(metrics[selectedYear]).map(([month, data]) => ({
        period: `${month}/${selectedYear}`,
        month,
        ...data
      }));
    } else {
      const monthData = metrics[selectedYear][selectedMonth];
      return monthData ? [{ period: `${selectedMonth}/${selectedYear}`, month: selectedMonth, ...monthData }] : [];
    }
  };

  const metricsData = getMetricsData();
  const currentMetrics = metricsData.length > 0 ? metricsData[metricsData.length - 1] : null;

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const satisfactionData = [
    { name: 'Muito Satisfeito', value: currentMetrics?.satisfaction > 8 ? 40 : 20, color: COLORS[0] },
    { name: 'Satisfeito', value: currentMetrics?.satisfaction > 6 ? 35 : 30, color: COLORS[1] },
    { name: 'Neutro', value: 20, color: COLORS[2] },
    { name: 'Insatisfeito', value: currentMetrics?.satisfaction < 6 ? 25 : 5, color: COLORS[3] }
  ];

  const getMonthName = (month: string) => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return monthNames[parseInt(month) - 1] || month;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Métricas e Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Visualize a performance do agente
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {months.map((month) => (
                <SelectItem key={month} value={month}>{getMonthName(month)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!currentMetrics && (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Sem dados disponíveis</h3>
            <p className="text-sm text-muted-foreground">
              As métricas aparecerão aqui quando o agente começar a receber conversas
            </p>
          </CardContent>
        </Card>
      )}

      {currentMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chats Iniciados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.initChats}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedMonth === 'all' ? 'Total do ano' : 'No mês selecionado'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Clientes Únicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.clients}</div>
                <p className="text-xs text-muted-foreground">
                  Clientes diferentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chats Finalizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.finishChats}</div>
                <Badge variant="outline" className="mt-1">
                  {((currentMetrics.finishChats / currentMetrics.initChats) * 100).toFixed(1)}% concluídos
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tempo de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.timeResponse}s</div>
                <p className="text-xs text-muted-foreground">
                  Tempo médio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Satisfação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.satisfaction.toFixed(1)}</div>
                <Badge variant={currentMetrics.satisfaction >= 8 ? "default" : currentMetrics.satisfaction >= 6 ? "secondary" : "destructive"}>
                  {currentMetrics.satisfaction >= 8 ? 'Excelente' : currentMetrics.satisfaction >= 6 ? 'Bom' : 'Precisa melhorar'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {metricsData.length > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução dos Chats</CardTitle>
                  <CardDescription>Chats iniciados e finalizados por período</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => getMonthName(value)}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => `Mês ${getMonthName(value.toString())}`}
                      />
                      <Bar dataKey="initChats" fill="hsl(var(--primary))" name="Chats Iniciados" />
                      <Bar dataKey="finishChats" fill="hsl(var(--secondary))" name="Chats Finalizados" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tempo de Resposta</CardTitle>
                  <CardDescription>Evolução do tempo médio de resposta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => getMonthName(value)}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => `Mês ${getMonthName(value.toString())}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="timeResponse" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Tempo de Resposta (s)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Satisfação</CardTitle>
              <CardDescription>Como os clientes avaliam o atendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}