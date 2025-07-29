
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  personality?: string;
  training_data?: string;
  voice_enabled?: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan_type: string;
  max_agents: number;
  created_at: string;
  updated_at: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAgents = async () => {
    if (!user) return;
    
    try {
      // Os agentes já vêm no contexto do usuário
      if (user.agents) {
        setAgents(user.agents);
      }
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Erro ao carregar agentes",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUserPlan = async () => {
    if (!user) return;
    
    try {
      // Usar dados do plano que já vêm do contexto do usuário
      const planData = {
        id: user.id.toString(),
        user_id: user.id.toString(),
        plan_type: user.plan.toLowerCase(),
        max_agents: user.numberAgentes,
        created_at: user.createAt,
        updated_at: user.updateAt || user.createAt
      };
      setUserPlan(planData);
    } catch (error: any) {
      console.error('Error fetching user plan:', error);
    }
  };

  const createAgent = async (name: string, description?: string): Promise<Agent | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return null;
    }

    if (userPlan && agents.length >= userPlan.max_agents) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${userPlan.max_agents} agente(s) para seu plano atual.`,
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await api.post('/v1/agente/create', {
        name,
        description: description || ''
      });

      if (response.data.agent) {
        const newAgent = response.data.agent;
        setAgents(prev => [...prev, newAgent]);
        
        toast({
          title: "Agente criado",
          description: `O agente "${name}" foi criado com sucesso.`,
        });
        
        return newAgent;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error creating agent:', error);
      toast({
        title: "Erro ao criar agente",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAgent = async (agentId: string): Promise<boolean> => {
    try {
      // A API não documenta delete de agentes, então vamos apenas remover do estado local
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      
      toast({
        title: "Agente excluído",
        description: "O agente foi excluído com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Erro ao excluir agente",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAgent = async (agentId: string, updates: Partial<Agent>): Promise<Agent | null> => {
    try {
      const response = await api.put(`/v1/agente/edit/${agentId}`, updates);
      
      if (response.data.agent) {
        const updatedAgent = response.data.agent;
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? updatedAgent : agent
        ));
        
        toast({
          title: "Agente atualizado",
          description: "As informações do agente foram atualizadas com sucesso.",
        });
        
        return updatedAgent;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error updating agent:', error);
      toast({
        title: "Erro ao atualizar agente",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchUserPlan(), fetchAgents()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  const canCreateAgent = userPlan ? agents.length < userPlan.max_agents : false;

  return {
    agents,
    userPlan,
    loading,
    createAgent,
    deleteAgent,
    updateAgent,
    fetchAgents,
    canCreateAgent,
  };
}
