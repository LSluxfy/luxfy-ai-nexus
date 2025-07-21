
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { SimulatorContext, SimulatorResponse } from '@/types/agent-api';

export function useAgentSimulator() {
  const [simulating, setSimulating] = useState(false);
  const [conversation, setConversation] = useState<SimulatorContext[]>([]);
  const { toast } = useToast();

  // Simular mensagem
  const simulateMessage = async (agentId: string, message: string) => {
    try {
      setSimulating(true);
      
      const response = await AgentApiService.simulateConversation(agentId, {
        context: conversation,
        message
      });

      // Adicionar mensagem do usuário ao contexto
      const newUserMessage: SimulatorContext = {
        role: 'user',
        content: message
      };

      // Adicionar resposta do agente ao contexto
      const newAgentMessage: SimulatorContext = {
        role: 'assistant',
        content: response.response.message
      };

      setConversation(prev => [...prev, newUserMessage, newAgentMessage]);

      return response.response;
    } catch (error: any) {
      toast({
        title: "Erro na simulação",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setSimulating(false);
    }
  };

  // Limpar conversa
  const clearConversation = () => {
    setConversation([]);
  };

  // Definir contexto da conversa
  const setContext = (context: SimulatorContext[]) => {
    setConversation(context);
  };

  return {
    simulating,
    conversation,
    simulateMessage,
    clearConversation,
    setContext,
  };
}
