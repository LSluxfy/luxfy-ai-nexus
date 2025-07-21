
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, Trash2, Wifi, WifiOff } from 'lucide-react';
import { ApiAgent } from '@/types/agent-api';

interface AgentCardProps {
  agent: ApiAgent;
  isOnline?: boolean;
  onConfigure: (agent: ApiAgent) => void;
  onDelete: (agent: ApiAgent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isOnline = false,
  onConfigure,
  onDelete
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-luxfy-blue" />
            <CardTitle className="text-lg">{agent.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
            <Badge variant={agent.active ? "default" : "secondary"}>
              {agent.active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {agent.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Idioma:</span>
            <span className="font-medium">{agent.language}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Modelo:</span>
            <span className="font-medium">{agent.model}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Chats:</span>
            <span className="font-medium">{agent.chats.length}</span>
          </div>
        </div>

        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {agent.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConfigure(agent)}
          className="flex-1"
        >
          <Settings className="h-4 w-4 mr-1" />
          Configurar
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(agent)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
