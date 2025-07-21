import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAgentApi } from '@/hooks/use-agent-api';
import { AgentConfigTabs } from '@/components/agent/AgentConfigTabs';
import { ApiAgent } from '@/types/agent-api';

export function AgentPage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<ApiAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const { getAgent } = useAgentApi();

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) return;
      
      try {
        const agentData = await getAgent(id);
        setAgent(agentData);
      } catch (error) {
        console.error('Erro ao buscar agente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div>Carregando agente...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto py-6">
        <div>Agente não encontrado</div>
      </div>
    );
  }

  return (
    <AgentConfigTabs 
      agent={agent} 
      onUpdate={setAgent}
    />
  );
}

export default AgentPage;