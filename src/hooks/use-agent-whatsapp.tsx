
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';

export function useAgentWhatsApp() {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { toast } = useToast();

  // Conectar agente ao WhatsApp
  const connectAgent = async (agentId: string) => {
    try {
      setConnecting(true);
      const response = await AgentApiService.connectAgent(agentId);
      
      toast({
        title: "Conexão iniciada",
        description: response.message,
      });

      return response.agent;
    } catch (error: any) {
      toast({
        title: "Erro ao conectar",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
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

  // Desconectar agente do WhatsApp
  const disconnectAgent = async (agentId: string) => {
    try {
      setDisconnecting(true);
      const response = await AgentApiService.disconnectAgent(agentId);
      
      toast({
        title: "Agente desconectado",
        description: response.message,
      });

      return true;
    } catch (error: any) {
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
  };
}
