import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { AgentCampaigns } from '@/components/agent/AgentCampaigns';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { useAuth } from '@/contexts/AuthContext';

const CampanhasPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Se não há agentId na URL, redireciona para a página de seleção
  if (!agentId) {
    navigate('/dashboard/campanhas', { replace: true });
    return null;
  }
  
  // Estado para o agente selecionado (sempre será o agentId da URL)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agentId);

  // Handler para mudança de agente (redireciona para página de seleção)
  const handleAgentChange = (agentId: string) => {
    navigate(`/dashboard/campanhas/${agentId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Campanhas de Marketing" />
      
      <main className="flex-1 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Campanhas de Marketing
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Gerencie campanhas de email e WhatsApp
            </p>
            {/* Mostrar nome do agente selecionado */}
            {user?.agents && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Agente: {user.agents.find((agent: any) => agent.id.toString() === agentId)?.name || 'Agente não encontrado'}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <AgentSelector 
              selectedAgentId={selectedAgentId}
              onAgentChange={handleAgentChange}
            />
          </div>
        </div>
        
        <AgentCampaigns agentId={agentId} />
      </main>
    </div>
  );
};

export default CampanhasPage;