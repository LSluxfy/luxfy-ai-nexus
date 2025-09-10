import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AgentConfigTabs } from '@/components/agent/AgentConfigTabs';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { ApiAgent } from '@/types/agent-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Bot, RefreshCw, CheckCircle } from 'lucide-react';

export function AgentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<ApiAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDirectAccessAlert, setShowDirectAccessAlert] = useState(false);
  const { user } = useAuth();

  const handleAgentChange = (agentId: string) => {
    navigate(`/dashboard/agent/${agentId}`);
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  const handleContinue = () => {
    setShowDirectAccessAlert(false);
  };

  // Detectar se a página foi aberta diretamente
  useEffect(() => {
    const checkDirectAccess = () => {
      try {
        // Verificar o tipo de navegação usando performance.navigation
        const navigationType = (performance.navigation && performance.navigation.type) || 
                              (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]?.type);
        
        // Verificar se foi abertura direta (navigate/reload) e não back_forward
        const isDirectAccess = navigationType === 'navigate' || 
                              navigationType === 'reload' || 
                              navigationType === 1 || // TYPE_RELOAD
                              navigationType === 0;   // TYPE_NAVIGATE
        
        const isBackForward = navigationType === 'back_forward' || 
                             navigationType === 2; // TYPE_BACK_FORWARD

        console.log('🔍 Navigation detection:', {
          navigationType,
          isDirectAccess,
          isBackForward,
          pathname: window.location.pathname
        });

        // Só mostrar alerta se for acesso direto e estivermos na rota do agente
        if (isDirectAccess && !isBackForward && window.location.pathname.includes('/dashboard/agent/')) {
          setShowDirectAccessAlert(true);
        }
      } catch (error) {
        console.warn('❌ Erro ao detectar tipo de navegação:', error);
      }
    };

    // Executar a verificação após um pequeno delay para garantir que tudo esteja carregado
    const timeoutId = setTimeout(checkDirectAccess, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    console.log('AgentPage - ID:', id);
    console.log('AgentPage - User agents:', user?.agents);
    
    if (!id || !user?.agents) {
      console.log('AgentPage - Missing ID or user agents');
      setLoading(false);
      return;
    }

    // Buscar o agente nos dados que já temos do contexto
    const foundAgent = user.agents.find(agent => agent.id.toString() === id);
    console.log('AgentPage - Found agent:', foundAgent);
    
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
        <div>Carregando agente...</div>
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
              <CardTitle>Nenhum agente encontrado</CardTitle>
              <CardDescription>
                Você ainda não tem agentes criados. Vá para a página de Agentes para criar seu primeiro agente.
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
            <CardTitle>Selecione um agente</CardTitle>
            <CardDescription>
              {id ? 'Agente não encontrado. Selecione um agente válido abaixo:' : 'Escolha um agente para configurar:'}
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
    <>
      <AgentConfigTabs 
        agent={agent} 
        onUpdate={setAgent}
      />
      
      {/* Modal de aviso para acesso direto */}
      <AlertDialog open={showDirectAccessAlert} onOpenChange={setShowDirectAccessAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Aviso de atualização de dados
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left leading-relaxed">
              Percebemos que você abriu esta página diretamente ao iniciar o navegador. Os dados exibidos podem não estar atualizados. 
              Você pode recarregar a página para garantir informações mais recentes ou continuar assim mesmo e verificar se os dados estão corretos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={handleContinue} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              ✅ Continuar assim
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleReloadPage} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              🔄 Recarregar página
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default AgentPage;