
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CRMKanban } from '@/components/crm/CRMKanban';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { NewLeadDialog } from '@/components/crm/NewLeadDialog';
import { useCRM } from '@/hooks/use-crm';
import { useAgentTags } from '@/hooks/use-agent-tags';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import type { CRMRow } from '@/types/crm';

const CRMPage = () => {
  const { t } = useTranslation();
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Se não há agentId na URL, redireciona para a página de seleção
  if (!agentId) {
    navigate('/dashboard/crm', { replace: true });
    return null;
  }
  
  // Estado para o agente selecionado (sempre será o agentId da URL)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agentId);

  // Buscar tags do agente
  const { data: agentTags = [], isLoading: tagsLoading } = useAgentTags(agentId);

  const {
    crmData,
    groupedLeads,
    isLoading,
    error,
    isUpdating,
    moveLead,
    addLead,
    updateLead,
    removeLead,
    addColumn,
    removeColumn,
    renameColumn,
  } = useCRM({
    agentId: agentId,
    enabled: !!agentId
  });

  // Handler para mudança de agente (redireciona para página de seleção)
  const handleAgentChange = (agentId: string) => {
    navigate(`/dashboard/crm/${agentId}`);
  };

  // Filter leads based on search term
  const filteredGroupedLeads = React.useMemo(() => {
    if (!searchTerm || !groupedLeads) return groupedLeads;

    const filtered: Record<string, CRMRow[]> = {};

    Object.entries(groupedLeads).forEach(([status, leads]) => {
      const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      if (filteredLeads.length > 0) {
        filtered[status] = filteredLeads;
      }
    });

    return filtered;
  }, [groupedLeads, searchTerm]);

  const handleOpenChat = (lead: CRMRow) => {
    if (lead.chatId) {
      navigate('/dashboard/chat', {
        state: {
          selectedUserId: lead.chatId.toString(),
          userName: lead.name
        }
      });
    } else {
      // If no chatId, could create a new chat or show message
      console.log('No chat ID associated with this lead');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title={t('crm.title')} />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title={t('crm.title')} />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Erro ao carregar CRM
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error instanceof Error ? error.message : 'Erro desconhecido'}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!crmData) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title={t('crm.title')} />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {t('crm.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('crm.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <AgentSelector 
                selectedAgentId={selectedAgentId}
                onAgentChange={handleAgentChange}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                CRM não encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Nenhum dado de CRM disponível para este agente.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title={t('crm.title')} />

      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t('crm.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('crm.subtitle')}
            </p>
            {crmData.Agent && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Agente: {crmData.Agent.name}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <AgentSelector 
              selectedAgentId={selectedAgentId}
              onAgentChange={handleAgentChange}
            />
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder={t('crm.searchPlaceholder')}
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <NewLeadDialog
                onAddLead={addLead}
                tables={crmData?.tables || {}}
                isUpdating={isUpdating}
                agentTags={agentTags}
                tagsLoading={tagsLoading}
              />
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Salvando alterações...</p>
            </div>
          </div>
        )}

        <CRMKanban
          tables={crmData.tables}
          groupedLeads={filteredGroupedLeads}
          onMoveLead={moveLead}
          onUpdateLead={updateLead}
          onRemoveLead={removeLead}
          onAddColumn={addColumn}
          onRemoveColumn={removeColumn}
          onRenameColumn={renameColumn}
          onOpenChat={handleOpenChat}
          isUpdating={isUpdating}
        />
      </main>
    </div>
  );
};

export default CRMPage;
