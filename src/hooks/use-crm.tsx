
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CRMService } from '@/services/crmService';
import { useToast } from '@/hooks/use-toast';
import type { ParsedCRMData, CRMTables, CRMRow, LeadStatus } from '@/types/crm';

interface UseCRMOptions {
  agentId: string;
  enabled?: boolean;
}

export function useCRM({ agentId, enabled = true }: UseCRMOptions) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    tables?: CRMTables;
    rows?: CRMRow[];
  }>({});

  // Query para buscar dados do CRM
  const {
    data: crmData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['crm', agentId],
    queryFn: () => CRMService.getCRMData(agentId),
    enabled: enabled && !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation para atualizar dados do CRM
  const updateMutation = useMutation({
    mutationFn: (updates: { tables?: CRMTables; rows?: CRMRow[] }) =>
      CRMService.updateCRMData(agentId, updates),
    onSuccess: (data) => {
      // Update cache with new data
      queryClient.setQueryData(['crm', agentId], data);
      // Clear optimistic updates
      setOptimisticUpdates({});
      toast({
        title: "CRM atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      // Revert optimistic updates
      setOptimisticUpdates({});
      toast({
        title: "Erro ao atualizar CRM",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Dados combinando server data com optimistic updates
  const finalData: ParsedCRMData | undefined = crmData ? {
    ...crmData,
    tables: optimisticUpdates.tables || crmData.tables,
    rows: optimisticUpdates.rows || crmData.rows,
  } : undefined;

  // Função para atualizar tabelas
  const updateTables = useCallback((newTables: CRMTables) => {
    if (!finalData) return;
    
    // Optimistic update
    setOptimisticUpdates(prev => ({ ...prev, tables: newTables }));
    
    // Debounced server update
    setTimeout(() => {
      updateMutation.mutate({ tables: newTables });
    }, 500);
  }, [finalData, updateMutation]);

  // Função para atualizar linhas/leads
  const updateRows = useCallback((newRows: CRMRow[]) => {
    if (!finalData) return;
    
    // Optimistic update
    setOptimisticUpdates(prev => ({ ...prev, rows: newRows }));
    
    // Debounced server update
    setTimeout(() => {
      updateMutation.mutate({ rows: newRows });
    }, 500);
  }, [finalData, updateMutation]);

  // Função para mover lead entre colunas
  const moveLead = useCallback((leadId: number, newStatus: LeadStatus) => {
    if (!finalData?.rows) return;
    
    const updatedRows = finalData.rows.map(row => 
      row.id === leadId 
        ? { ...row, status: newStatus, updatedAt: new Date().toISOString() }
        : row
    );
    
    updateRows(updatedRows);
  }, [finalData?.rows, updateRows]);

  // Função para adicionar novo lead
  const addLead = useCallback((leadData: Partial<CRMRow>) => {
    if (!finalData?.rows) return;
    
    const newLead = CRMService.createNewLead(leadData);
    const updatedRows = [...finalData.rows, newLead];
    
    updateRows(updatedRows);
  }, [finalData?.rows, updateRows]);

  // Função para atualizar lead existente
  const updateLead = useCallback((leadId: number, updates: Partial<CRMRow>) => {
    if (!finalData?.rows) return;
    
    const updatedRows = finalData.rows.map(row =>
      row.id === leadId
        ? { ...row, ...updates, updatedAt: new Date().toISOString() }
        : row
    );
    
    updateRows(updatedRows);
  }, [finalData?.rows, updateRows]);

  // Função para remover lead
  const removeLead = useCallback((leadId: number) => {
    if (!finalData?.rows) return;
    
    const updatedRows = finalData.rows.filter(row => row.id !== leadId);
    updateRows(updatedRows);
  }, [finalData?.rows, updateRows]);

  // Função para adicionar nova coluna
  const addColumn = useCallback((columnName: string) => {
    if (!finalData?.tables) return;
    
    const tableKeys = Object.keys(finalData.tables);
    const nextKey = (Math.max(...tableKeys.map(k => parseInt(k))) + 1).toString();
    
    const updatedTables = {
      ...finalData.tables,
      [nextKey]: columnName
    };
    
    updateTables(updatedTables);
  }, [finalData?.tables, updateTables]);

  // Função para remover coluna
  const removeColumn = useCallback((columnKey: string) => {
    if (!finalData?.tables || !finalData?.rows) return;
    
    // Remove the column
    const updatedTables = { ...finalData.tables };
    delete updatedTables[columnKey];
    
    // Remove leads in this column or move them to a default column
    const updatedRows = finalData.rows.filter(row => row.status !== columnKey);
    
    updateTables(updatedTables);
    updateRows(updatedRows);
  }, [finalData?.tables, finalData?.rows, updateTables, updateRows]);

  // Função para renomear coluna
  const renameColumn = useCallback((columnKey: string, newName: string) => {
    if (!finalData?.tables) return;
    
    const updatedTables = {
      ...finalData.tables,
      [columnKey]: newName
    };
    
    updateTables(updatedTables);
  }, [finalData?.tables, updateTables]);

  // Função para agrupar leads por status
  const getGroupedLeads = useCallback(() => {
    if (!finalData?.rows || !finalData?.tables) return {};
    
    return finalData.rows.reduce((acc, lead) => {
      const status = lead.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(lead);
      return acc;
    }, {} as Record<string, CRMRow[]>);
  }, [finalData?.rows, finalData?.tables]);

  return {
    // Data
    crmData: finalData,
    groupedLeads: getGroupedLeads(),
    
    // States
    isLoading,
    error,
    isUpdating: updateMutation.isPending,
    
    // Actions
    updateTables,
    updateRows,
    moveLead,
    addLead,
    updateLead,
    removeLead,
    addColumn,
    removeColumn,
    renameColumn,
    refetch,
  };
}
