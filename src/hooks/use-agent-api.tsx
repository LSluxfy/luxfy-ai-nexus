
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent, CreateAgentRequest, UpdateAgentRequest } from '@/types/agent-api';

export function useAgentApi() {
  const [agents, setAgents] = useState<ApiAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar agentes do usuário
  const fetchAgents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const agentsData = await AgentApiService.getUserAgents();
      setAgents(agentsData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar agentes",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar agente
  const createAgent = async (data: CreateAgentRequest) => {
    try {
      const response = await AgentApiService.createAgent(data);
      toast({
        title: "Agente criado",
        description: response.message,
      });
      await fetchAgents();
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
      await fetchAgents();
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
      await fetchAgents();
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

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  return {
    agents,
    loading,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgent,
    fetchAgents,
  };
}
