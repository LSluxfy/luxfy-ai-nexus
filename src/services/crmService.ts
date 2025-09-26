
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
      // Create CRM data object
      const crmData: any = {};
      
      if (updates.tables) {
        crmData.tables = JSON.stringify(updates.tables);
      }
      
      if (updates.rows) {
        crmData.rows = JSON.stringify(updates.rows);
      }

      // Create JSON file content
      const jsonContent = JSON.stringify(crmData);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const file = new File([blob], 'crm.json', { type: 'application/json' });

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put<CRMApiResponse>(`/v1/crm/${agentId}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseData = response.data.crm;
      
      // Parse JSON strings to objects
      const parsedTables: CRMTables = JSON.parse(responseData.tables);
      const parsedRows: CRMRow[] = JSON.parse(responseData.rows);
      
      return {
        id: responseData.id,
        tables: parsedTables,
        rows: parsedRows,
        Agent: responseData.Agent,
        createAt: responseData.createAt,
        updatedAt: responseData.updatedAt,
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
      tableId: data.tableId || 1, // Default to table 1
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      tags: data.tags || [],
      notes: data.notes || '',
      price: data.price || 0,
      responsibleId: data.responsibleId || 0,
      chatId: data.chatId || 0,
      status: data.status || '1', // Default to first status (Novos)
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
