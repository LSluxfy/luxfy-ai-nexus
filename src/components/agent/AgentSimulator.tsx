import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useAgentSimulator } from '@/hooks/use-agent-simulator';
import { ApiAgent } from '@/types/agent-api';

interface AgentSimulatorProps {
  agent: ApiAgent;
}

export function AgentSimulator({ agent }: AgentSimulatorProps) {
  const [message, setMessage] = useState('');
  const { simulating, conversation, simulateMessage, clearConversation } = useAgentSimulator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || simulating) return;

    const currentMessage = message;
    setMessage('');
    
    try {
      await simulateMessage(agent.id.toString(), currentMessage);
    } catch (error) {
      console.error('Erro na simulação:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Simulador de Conversa</h3>
          <p className="text-sm text-muted-foreground">
            Teste o agente com mensagens simuladas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-2">
            <div className={`h-2 w-2 rounded-full ${agent.active ? 'bg-green-500' : 'bg-red-500'}`} />
            {agent.active ? 'Ativo' : 'Inativo'}
          </Badge>
          
          {conversation.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearConversation}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Conversa</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {conversation.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Inicie uma conversa com o agente</p>
                  <p className="text-sm">Digite uma mensagem abaixo para começar</p>
                </div>
              )}
              
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                    `}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div
                      className={`
                        px-4 py-2 rounded-lg break-words
                        ${msg.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                        }
                      `}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {simulating && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={simulating}
                className="flex-1"
              />
              <Button type="submit" disabled={simulating || !message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Agente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Modelo:</span> {agent.model}
            </div>
            <div>
              <span className="font-medium">Idioma:</span> {agent.language}
            </div>
            <div>
              <span className="font-medium">Estilo:</span> {agent.styleResponse}
            </div>
            <div>
              <span className="font-medium">Delay:</span> {agent.delayResponse}ms
            </div>
          </div>
          
          {agent.tags.length > 0 && (
            <div>
              <span className="font-medium text-sm">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {agent.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}