import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Bot } from 'lucide-react';

const CampanhasSelectionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAgentChange = (agentId: string) => {
    navigate(`/dashboard/campanhas/${agentId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Campanhas de Marketing" />

      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Megaphone className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Campanhas de Marketing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Selecione um agente para gerenciar suas campanhas
            </p>
          </div>

          {!user?.agents || user.agents.length === 0 ? (
            <Card className="text-center">
              <CardHeader>
                <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <CardTitle>Nenhum agente encontrado</CardTitle>
                <CardDescription>
                  Você ainda não tem agentes criados. Vá para a página de Agentes para criar seu primeiro agente.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Selecione um Agente</CardTitle>
                <CardDescription>
                  Escolha um agente para visualizar e gerenciar suas campanhas de marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <AgentSelector
                  selectedAgentId={null}
                  onAgentChange={handleAgentChange}
                />
              </CardContent>
            </Card>
          )}

          {user?.agents && user.agents.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.agents.map((agent: any) => (
                <Card 
                  key={agent.id} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleAgentChange(agent.id.toString())}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {agent.description || 'Sem descrição'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CampanhasSelectionPage;