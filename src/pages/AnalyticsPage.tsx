
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewMetrics from '@/components/analytics/OverviewMetrics';
import ConversationMetrics from '@/components/analytics/ConversationMetrics';
import ClientMetrics from '@/components/analytics/ClientMetrics';
import TagAnalytics from '@/components/analytics/TagAnalytics';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import ResponseTimeChart from '@/components/analytics/ResponseTimeChart';
import { useTranslation } from 'react-i18next';

const AnalyticsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title={t('analytics.title')} />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{t('analytics.subtitle')}</h2>
          <p className="text-gray-600">{t('analytics.description')}</p>
        </div>

        <Tabs defaultValue="overview" className="w-full space-y-6">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">{t('analytics.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="conversations">{t('analytics.tabs.conversations')}</TabsTrigger>
            <TabsTrigger value="clients">{t('analytics.tabs.clients')}</TabsTrigger>
            <TabsTrigger value="tags">{t('analytics.tabs.tags')}</TabsTrigger>
            <TabsTrigger value="performance">{t('analytics.tabs.performance')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart />
              <ResponseTimeChart />
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <ConversationMetrics />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientMetrics />
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <TagAnalytics />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PerformanceChart />
              <ResponseTimeChart />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AnalyticsPage;
