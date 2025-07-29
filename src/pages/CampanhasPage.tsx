import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { AgentCampaigns } from '@/components/agent/AgentCampaigns';

const CampanhasPage = () => {
  // TODO: Pegar o ID do agente selecionado do contexto/estado global
  // Por enquanto usando um agente fixo para teste
  const agentId = "1"; // Este deve ser o ID do agente atual selecionado

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Campanhas de Marketing" />
      
      <main className="flex-1 p-6">
        <AgentCampaigns agentId={agentId} />
      </main>
    </div>
  );
};

export default CampanhasPage;