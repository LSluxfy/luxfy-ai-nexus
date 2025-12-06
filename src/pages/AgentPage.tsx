import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AgentConfigTabs } from '@/components/agent/AgentConfigTabs';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { ApiAgent } from '@/types/agent-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export function AgentPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<ApiAgent | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  const handleAgentChange = (agentId: string) => {
    navigate(`/dashboard/agent/${agentId}`);
  };


  useEffect(() => {
    if (!id || !user?.agents) {
      setLoading(false);
      return;
    }

    // Buscar o agente nos dados que já temos do contexto
    const foundAgent = user.agents.find(agent => agent.id.toString() === id);
    
    // Converter strings JSON para objetos JavaScript
    if (foundAgent) {
      const processedAgent = {
        ...foundAgent,
        apprenticeship: typeof foundAgent.apprenticeship === 'string' 
          ? JSON.parse(foundAgent.apprenticeship || '[]') 
          : foundAgent.apprenticeship || [],
        flow: typeof foundAgent.flow === 'string' 
          ? JSON.parse(foundAgent.flow || '[]') 
          : foundAgent.flow || []
      };
      setAgent(processedAgent);
    } else {
      setAgent(null);
    }
    setLoading(false);
  }, [id, user]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div> {t('SelectAgent.loading')}</div>
      </div>
    );
  }

  if (!agent) {
    // Se não há agentes, mostrar mensagem
    if (!user?.agents || user.agents.length === 0) {
      return (
        <div className="container mx-auto py-6">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <CardTitle>{t('SelectAgent.noAgent')}</CardTitle>
              <CardDescription>
                {t('SelectAgent.noAgentDescription')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    // Se há agentes mas não encontrou o ID específico, mostrar seletor
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>{t('SelectAgent.title')}</CardTitle>
            <CardDescription>
              {id ? t('SelectAgent.description') : 'Escolha um agente para configurar:'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgentSelector
              selectedAgentId={null}
              onAgentChange={handleAgentChange}
            />
          </CardContent>
        </Card>
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