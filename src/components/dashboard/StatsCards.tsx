
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: number;
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => {
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
            <span>{trend}% em relação à semana anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatsCards = () => {
  const { metrics } = useDashboardMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Conversas Iniciadas"
        value={metrics.totalChats.toString()}
        description="Total do mês atual"
        icon={<MessageSquareText size={18} />}
        trend={12} // Pode ser calculado comparando com o mês anterior
      />
      <StatsCard
        title="Clientes Atendidos"
        value={metrics.totalClients.toString()}
        description="Total do mês atual"
        icon={<Users size={18} />}
        trend={8}
      />
      <StatsCard
        title="Conversas Finalizadas"
        value={metrics.totalFinishedChats.toString()}
        description="Total do mês atual"
        icon={<CheckCircle size={18} />}
        trend={-3}
      />
      <StatsCard
        title="Taxa de Conversão"
        value={`${Math.round(metrics.conversionRate)}%`}
        description="Média do mês atual"
        icon={<TrendingUp size={18} />}
        trend={5}
      />
    </div>
  );
};

export default StatsCards;
