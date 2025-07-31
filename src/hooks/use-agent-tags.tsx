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

      const response = await api.get<UseAgentTagsResponse>(`/v1/agente/tags/${agentId}`);
      return response.data.tags;
    },
    enabled: !!agentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};