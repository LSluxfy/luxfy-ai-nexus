
import api from '@/lib/api';
import {
  ApiAgent,
  CreateAgentRequest,
  CreateAgentResponse,
  UpdateAgentRequest,
  UpdateAgentResponse,
  ConnectAgentResponse,
  AgentStatusResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
  GetCampaignsResponse,
  SimulatorRequest,
  SimulatorApiResponse,
  Campaign
} from '@/types/agent-api';

export class AgentApiService {
  // Listar agentes do usuário
  static async getUserAgents(): Promise<ApiAgent[]> {
    const response = await api.get('/v1/agente/user');
    return response.data.agents;
  }

  // Buscar agente por ID
  static async getAgentById(id: string): Promise<ApiAgent> {
    const response = await api.get(`/v1/agente/id/${id}`);
    return response.data.agent;
  }

  // Criar novo agente
  static async createAgent(data: CreateAgentRequest): Promise<CreateAgentResponse> {
    const response = await api.post('/v1/agente/create', data);
    return response.data;
  }

  // Atualizar agente
  static async updateAgent(id: string, data: UpdateAgentRequest): Promise<UpdateAgentResponse> {
    const response = await api.put(`/v1/agente/edit/${id}`, data);
    return response.data;
  }

  // Deletar agente
  static async deleteAgent(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/v1/agente/delete/${id}`);
    return response.data;
  }

  // Conectar agente ao WhatsApp
  static async connectAgent(id: string): Promise<ConnectAgentResponse> {
    const response = await api.get(`/v1/agente/connect/${id}`);
    return response.data;
  }

  // Verificar status do agente
  static async getAgentStatus(id: string): Promise<AgentStatusResponse> {
    const response = await api.get(`/v1/agente/status/${id}`);
    return response.data;
  }

  // Desconectar agente do WhatsApp
  static async disconnectAgent(id: string): Promise<{ message: string }> {
    const response = await api.put(`/v1/agente/disconnect/${id}`);
    return response.data;
  }

  // Simular conversa com agente
  static async simulateConversation(id: string, data: SimulatorRequest): Promise<SimulatorApiResponse> {
    const response = await api.put(`/v1/agente/simulator/${id}`, data);
    return response.data;
  }

  // Campanhas
  static async getAgentCampaigns(id: string): Promise<Campaign[]> {
    const response = await api.get(`/v1/agente/id/${id}/campaigns`);
    return response.data.campaigns;
  }

  static async createCampaign(agentId: string, data: CreateCampaignRequest): Promise<CreateCampaignResponse> {
    const response = await api.post(`/v1/agente/id/${agentId}/campaign/create`, data);
    return response.data;
  }

  static async updateCampaign(agentId: string, campaignId: string, data: CreateCampaignRequest): Promise<CreateCampaignResponse> {
    const response = await api.put(`/v1/agente/id/${agentId}/campaign/edit/${campaignId}`, data);
    return response.data;
  }
}
