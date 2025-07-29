
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { Campaign, CreateCampaignRequest } from '@/types/agent-api';

export function useAgentCampaigns(agentId?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Buscar campanhas do agente
  const fetchCampaigns = async () => {
    if (!agentId) return;
    
    try {
      setLoading(true);
      console.log('Buscando campanhas para agente:', agentId);
      const campaignsData = await AgentApiService.getAgentCampaigns(agentId);
      console.log('Campanhas recebidas:', campaignsData);
      setCampaigns(campaignsData);
    } catch (error: any) {
      console.error('Erro ao carregar campanhas:', error);
      toast({
        title: "Erro ao carregar campanhas",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar campanha
  const createCampaign = async (data: CreateCampaignRequest) => {
    if (!agentId) throw new Error('Agent ID is required');
    
    try {
      setCreating(true);
      console.log('Criando campanha para agente:', agentId, data);
      const response = await AgentApiService.createCampaign(agentId, data);
      
      toast({
        title: "Campanha criada",
        description: response.message,
      });

      // Força a busca das campanhas atualizadas
      console.log('Buscando campanhas atualizadas após criação...');
      await fetchCampaigns();
      return response.campaign;
    } catch (error: any) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: "Erro ao criar campanha",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setCreating(false);
    }
  };

  // Atualizar campanha
  const updateCampaign = async (campaignId: string, data: CreateCampaignRequest) => {
    if (!agentId) throw new Error('Agent ID is required');
    
    try {
      setUpdating(true);
      const response = await AgentApiService.updateCampaign(agentId, campaignId, data);
      
      toast({
        title: "Campanha atualizada",
        description: response.message,
      });

      await fetchCampaigns();
      return response.campaign;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar campanha",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  // Deletar campanha
  const deleteCampaign = async (campaignId: string) => {
    if (!agentId) throw new Error('Agent ID is required');
    
    try {
      setUpdating(true);
      const response = await AgentApiService.deleteCampaign(agentId, campaignId);
      
      toast({
        title: "Campanha excluída",
        description: response.message,
      });

      await fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir campanha",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchCampaigns();
    }
  }, [agentId]);

  return {
    campaigns,
    loading,
    creating,
    updating,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaigns,
  };
}
