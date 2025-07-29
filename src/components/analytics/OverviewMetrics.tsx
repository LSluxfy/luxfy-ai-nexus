
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, Users, CheckCircle, TrendingUp, Clock, Bot, Target, Zap } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { useAuth } from '@/contexts/AuthContext';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

const MetricCard = ({ title, value, description, icon, trend, trendLabel }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-luxfy-blue/10 flex items-center justify-center text-luxfy-blue">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend !== undefined && (
          <div className={`flex items-center text-xs mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp size={14} className="mr-1" />
            <span>{trend > 0 ? '+' : ''}{trend}% {trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OverviewMetrics = () => {
  const { metrics } = useDashboardMetrics();
  const { user } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total de Conversas"
        value={metrics.totalChats.toLocaleString('pt-BR')}
        description="Este mês"
        icon={<MessageSquareText size={18} />}
      />
      <MetricCard
        title="Clientes Atendidos"
        value={metrics.totalClients.toLocaleString('pt-BR')}
        description="Este mês"
        icon={<Users size={18} />}
      />
      <MetricCard
        title="Taxa de Conversão"
        value={`${metrics.conversionRate.toFixed(1)}%`}
        description="Conversas → Clientes"
        icon={<Target size={18} />}
      />
      <MetricCard
        title="Tempo Médio de Resposta"
        value={metrics.averageResponseTime > 0 ? `${metrics.averageResponseTime.toFixed(1)}s` : "N/A"}
        description="Resposta da IA"
        icon={<Zap size={18} />}
      />
      <MetricCard
        title="Conversas Finalizadas"
        value={metrics.totalFinishedChats.toLocaleString('pt-BR')}
        description="Este mês"
        icon={<CheckCircle size={18} />}
      />
      <MetricCard
        title="Agentes Ativos"
        value={user?.agents?.length?.toString() || "0"}
        description="IA funcionando"
        icon={<Bot size={18} />}
      />
      <MetricCard
        title="Uptime da IA"
        value="99.8%"
        description="Disponibilidade"
        icon={<Clock size={18} />}
      />
      <MetricCard
        title="Satisfação"
        value={metrics.averageSatisfaction > 0 ? `${metrics.averageSatisfaction.toFixed(1)}/5` : "N/A"}
        description="Avaliação média"
        icon={<TrendingUp size={18} />}
      />
    </div>
  );
};

export default OverviewMetrics;
