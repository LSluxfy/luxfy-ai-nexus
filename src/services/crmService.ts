
import { api } from '@/lib/api';
import type { CRMApiResponse, CRMUpdateRequest, ParsedCRMData, CRMTables, CRMRow } from '@/types/crm';

export class CRMService {
  /**
   * Get CRM data for a specific agent
   */
  static async getCRMData(agentId: string): Promise<ParsedCRMData> {
    try {
      const response = await api.get<CRMApiResponse>(`/v1/crm/${agentId}`);
      const crmData = response.data.crm;
      
      // Parse JSON strings to objects
      const parsedTables: CRMTables = JSON.parse(crmData.tables);
      const parsedRows: CRMRow[] = JSON.parse(crmData.rows);
      
      return {
        id: crmData.id,
        tables: parsedTables,
        rows: parsedRows,
        Agent: crmData.Agent,
        createAt: crmData.createAt,
        updatedAt: crmData.updatedAt,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do CRM:', error);
      throw error;
    }
  }

  /**
   * Update CRM data for a specific agent
   */
  static async updateCRMData(
    agentId: string, 
    updates: { tables?: CRMTables; rows?: CRMRow[] }
  ): Promise<ParsedCRMData> {
    try {
      // Convert objects to JSON strings for API
      const updatePayload: CRMUpdateRequest = {};
      
      if (updates.tables) {
        updatePayload.tables = JSON.stringify(updates.tables);
      }
      
      if (updates.rows) {
        updatePayload.rows = JSON.stringify(updates.rows);
      }

      const response = await api.put<CRMApiResponse>(`/v1/crm/${agentId}/update`, updatePayload);
      const crmData = response.data.crm;
      
      // Parse JSON strings to objects
      const parsedTables: CRMTables = JSON.parse(crmData.tables);
      const parsedRows: CRMRow[] = JSON.parse(crmData.rows);
      
      return {
        id: crmData.id,
        tables: parsedTables,
        rows: parsedRows,
        Agent: crmData.Agent,
        createAt: crmData.createAt,
        updatedAt: crmData.updatedAt,
      };
    } catch (error) {
      console.error('Erro ao atualizar dados do CRM:', error);
      throw error;
    }
  }

  /**
   * Helper function to get default CRM structure
   */
  static getDefaultCRMStructure(): { tables: CRMTables; rows: CRMRow[] } {
    return {
      tables: {
        "1": "Novos",
        "2": "Contatados", 
        "3": "Qualificados",
        "4": "Negociação",
        "5": "Fechados",
        "6": "Perdidos"
      },
      rows: []
    };
  }

  /**
   * Helper function to create a new lead with default values
   */
  static createNewLead(data: Partial<CRMRow>): CRMRow {
    const now = new Date().toISOString();
    
    return {
      id: Date.now(), // Temporary ID, server should assign real ID
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      tags: data.tags || [],
      notes: data.notes || '',
      price: data.price || 0,
      responsibleId: data.responsibleId || 0,
      chatId: data.chatId || 0,
      status: data.status || 'new',
      interests: data.interests || [],
      logs: data.logs || [],
      activities: data.activities || [],
      createdBy: data.createdBy || 'attendant',
      delivery: data.delivery || '',
      createdAt: now,
      updatedAt: now,
      ...data
    };
  }
}
