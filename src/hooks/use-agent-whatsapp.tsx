
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';

export function useAgentWhatsApp() {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { toast } = useToast();

  // Conectar agente ao WhatsApp com verificação de sessão existente
  const connectAgent = async (agentId: string, forceReconnect = false) => {
    try {
      setConnecting(true);
      console.log(`Tentando conectar agente ${agentId}, forceReconnect: ${forceReconnect}`);

      // Primeiro verificar se há uma sessão existente
      if (!forceReconnect) {
        console.log('Verificando status da sessão existente...');
        const isOnline = await checkStatus(agentId);
        if (isOnline) {
          toast({
            title: "Agente já conectado",
            description: "O agente já possui uma sessão ativa do WhatsApp",
          });
          return { agent: null, message: "Sessão já ativa" };
        }
      }

      const response = await AgentApiService.connectAgent(agentId);
      
      toast({
        title: "Conexão iniciada",
        description: response.message,
      });

      return response;
    } catch (error: any) {
      console.error('Erro ao conectar agente:', error);
      
      // Verificar se é erro de sessão existente
      const errorMessage = error.response?.data?.error || error.message;
      if (errorMessage.includes('sessão') && errorMessage.includes('já existe')) {
        console.log('Erro de sessão existente detectado');
        
        toast({
          title: "Sessão já existe",
          description: "Uma sessão já está ativa. Tentando reconectar...",
          variant: "destructive",
        });
        
        // Tentar desconectar primeiro e depois reconectar
        try {
          console.log('Tentando desconectar sessão existente...');
          await AgentApiService.disconnectAgent(agentId);
          
          // Aguardar um pouco antes de reconectar
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log('Tentando reconectar após desconexão...');
          const retryResponse = await AgentApiService.connectAgent(agentId);
          
          toast({
            title: "Reconexão realizada",
            description: "Sessão anterior removida e nova conexão estabelecida",
          });
          
          return retryResponse;
        } catch (retryError: any) {
          console.error('Erro na tentativa de reconexão:', retryError);
          toast({
            title: "Erro na reconexão",
            description: "Não foi possível reconectar. Tente novamente em alguns minutos.",
            variant: "destructive",
          });
          throw retryError;
        }
      } else {
        toast({
          title: "Erro ao conectar",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
    } finally {
      setConnecting(false);
    }
  };

  // Verificar status do agente
  const checkStatus = async (agentId: string) => {
    try {
      setCheckingStatus(true);
      const response = await AgentApiService.getAgentStatus(agentId);
      return response.isOnline;
    } catch (error: any) {
      toast({
        title: "Erro ao verificar status",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setCheckingStatus(false);
    }
  };

  // Forçar nova conexão (desconectar e reconectar)
  const forceReconnect = async (agentId: string) => {
    try {
      console.log(`Forçando reconexão para agente ${agentId}`);
      return await connectAgent(agentId, true);
    } catch (error) {
      console.error('Erro ao forçar reconexão:', error);
      throw error;
    }
  };

  // Desconectar agente do WhatsApp
  const disconnectAgent = async (agentId: string) => {
    try {
      setDisconnecting(true);
      console.log(`Desconectando agente ${agentId}`);
      
      const response = await AgentApiService.disconnectAgent(agentId);
      
      toast({
        title: "Agente desconectado",
        description: response.message,
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao desconectar agente:', error);
      
      toast({
        title: "Erro ao desconectar",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setDisconnecting(false);
    }
  };

  return {
    connecting,
    disconnecting,
    checkingStatus,
    connectAgent,
    checkStatus,
    disconnectAgent,
    forceReconnect,
  };
}
