
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent, CreateAgentRequest, UpdateAgentRequest } from '@/types/agent-api';

export function useAgentApi() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Os agentes já estão disponíveis no contexto de auth
  const agents = user?.agents || [];

  const refreshAgents = async () => {
    // Como os agentes vêm no contexto de auth, não precisamos buscar separadamente
    // Mas podemos implementar uma lógica de refresh se necessário
  };

  // Criar agente
  const createAgent = async (data: CreateAgentRequest) => {
    try {
      const response = await AgentApiService.createAgent(data);
      toast({
        title: "Agente criado",
        description: response.message,
      });
      // Os agentes serão atualizados automaticamente no próximo login ou refresh
      return response.agent;
    } catch (error: any) {
      toast({
        title: "Erro ao criar agente",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Atualizar agente
  const updateAgent = async (id: string, data: UpdateAgentRequest) => {
    try {
      const response = await AgentApiService.updateAgent(id, data);
      toast({
        title: "Agente atualizado",
        description: response.message,
      });
      // Os agentes serão atualizados automaticamente no próximo login ou refresh
      return response.agent;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar agente",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Deletar agente
  const deleteAgent = async (id: string) => {
    try {
      const response = await AgentApiService.deleteAgent(id);
      toast({
        title: "Agente removido",
        description: response.message,
      });
      // Os agentes serão atualizados automaticamente no próximo login ou refresh
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover agente",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Buscar agente específico
  const getAgent = async (id: string) => {
    try {
      return await AgentApiService.getAgentById(id);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar agente",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    agents,
    loading,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgent,
    refreshAgents,
  };
}
