import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { ApiAgent } from '@/types/agent-api';

interface AgentSelectorProps {
  selectedAgentId: string | null;
  onAgentChange: (agentId: string) => void;
}

export function AgentSelector({ selectedAgentId, onAgentChange }: AgentSelectorProps) {
  const { user } = useAuth();

  if (!user?.agents || user.agents.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Nenhum agente disponível
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Agente:
      </label>
      <Select value={selectedAgentId || ''} onValueChange={onAgentChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione um agente" />
        </SelectTrigger>
        <SelectContent>
          {user.agents.map((agent: ApiAgent) => (
            <SelectItem key={agent.id} value={agent.id.toString()}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}