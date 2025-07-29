import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AgentConfigTabs } from '@/components/agent/AgentConfigTabs';
import { ApiAgent } from '@/types/agent-api';

export function AgentPage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<ApiAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id || !user?.agents) {
      setLoading(false);
      return;
    }

    // Buscar o agente nos dados que já temos do contexto
    const foundAgent = user.agents.find(agent => agent.id.toString() === id);
    setAgent(foundAgent || null);
    setLoading(false);
  }, [id, user]);

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