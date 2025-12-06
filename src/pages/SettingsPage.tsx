
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettings from '@/components/settings/AccountSettings';
import AgentSettings from '@/components/settings/AgentSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{t('settings.subtitle')}</h2>
          <p className="text-gray-600">{t('settings.description')}</p>
        </div>

        <Tabs defaultValue="account" className="w-full space-y-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="account">{t('settings.tabs.account')}</TabsTrigger>
            <TabsTrigger value="agents">{t('settings.tabs.agents')}</TabsTrigger>
            <TabsTrigger value="security">{t('settings.tabs.security')}</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <AgentSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
