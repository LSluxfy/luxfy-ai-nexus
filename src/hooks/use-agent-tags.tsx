import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface UseAgentTagsResponse {
  message: string;
  tags: string[];
}

export const useAgentTags = (agentId: string | undefined) => {
  return useQuery({
    queryKey: ['agent-tags', agentId],
    queryFn: async (): Promise<string[]> => {
      if (!agentId) {
        throw new Error('Agent ID is required');
      }

      console.log('Fetching tags for agent:', agentId);
      
      try {
        const response = await api.get<UseAgentTagsResponse>(`/v1/agente/tags/${agentId}`);
        console.log('Tags response:', response.data);
        return response.data.tags;
      } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
    },
    enabled: !!agentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};