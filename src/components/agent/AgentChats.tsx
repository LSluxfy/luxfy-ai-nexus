import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, MessageSquare, Phone, Calendar, User, Bot, FileText, Image, Paperclip } from 'lucide-react';
import { ApiAgent, ChatData, ChatMessage } from '@/types/agent-api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgentChatsProps {
  agent: ApiAgent;
}

export function AgentChats({ agent }: AgentChatsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const chats = agent.chats || [];
  
  const filteredChats = chats.filter(chat => {
    const matchesSearch = !searchTerm || 
      chat.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || chat.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(chats.flatMap(chat => chat.tags)));

  const getMessageIcon = (message: ChatMessage) => {
    if (message.attachments && message.attachments.length > 0) {
      const hasImage = message.attachments.some(att => 
        att.toLowerCase().includes('.jpg') || 
        att.toLowerCase().includes('.png') || 
        att.toLowerCase().includes('.gif')
      );
      return hasImage ? <Image className="h-3 w-3" /> : <Paperclip className="h-3 w-3" />;
    }
    if (message.audio) {
      return <MessageSquare className="h-3 w-3" />;
    }
    return <FileText className="h-3 w-3" />;
  };

  const getSenderIcon = (by: string) => {
    switch (by) {
      case 'agent':
        return <Bot className="h-4 w-4" />;
      case 'attendant':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getSenderLabel = (by: string) => {
    switch (by) {
      case 'agent':
        return 'Agente IA';
      case 'attendant':
        return 'Atendente';
      case 'user':
        return 'Cliente';
      default:
        return 'Cliente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Histórico de Chats</h3>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie as conversas do agente
          </p>
        </div>
        
        <Badge variant="outline">
          {chats.length} conversas totais
        </Badge>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedTag === '' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag('')}
          >
            Todas
          </Button>
          {allTags.slice(0, 5).map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {filteredChats.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma conversa encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || selectedTag 
                ? 'Tente ajustar os filtros de busca' 
                : 'As conversas aparecerão aqui quando o agente começar a atender'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredChats.map((chat) => (
            <Card key={chat.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedChat(chat)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {chat.number}
                  </CardTitle>
                  <Badge variant="outline" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {chat.messagesCount}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(chat.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                
                {chat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {chat.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {chat.messages.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Última mensagem:</p>
                    <div className="flex items-start gap-2">
                      {getSenderIcon(chat.messages[chat.messages.length - 1].by)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {getSenderLabel(chat.messages[chat.messages.length - 1].by)}
                        </p>
                        <p className="text-sm line-clamp-2">
                          {chat.messages[chat.messages.length - 1].text || 
                           (chat.messages[chat.messages.length - 1].audio ? '[Áudio]' : 
                           (chat.messages[chat.messages.length - 1].attachments?.length ? '[Anexo]' : ''))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedChat} onOpenChange={() => setSelectedChat(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Conversa com {selectedChat?.number}
            </DialogTitle>
          </DialogHeader>
          
          {selectedChat && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Informações da Conversa</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Iniciada: {format(new Date(selectedChat.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                    <span>Mensagens: {selectedChat.messagesCount}</span>
                    <span>Última atividade: {format(new Date(selectedChat.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
                </div>
                
                {selectedChat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedChat.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <ScrollArea className="h-[400px] p-4 border rounded-lg">
                <div className="space-y-4">
                  {selectedChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.by === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.by === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${message.by === 'user' ? 'bg-primary text-primary-foreground' : 
                            message.by === 'agent' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}
                        `}>
                          {getSenderIcon(message.by)}
                        </div>
                        
                        <div
                          className={`
                            px-4 py-2 rounded-lg break-words space-y-2
                            ${message.by === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : message.by === 'agent'
                              ? 'bg-secondary text-secondary-foreground'
                              : 'bg-muted'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 text-xs opacity-75">
                            <span>{getSenderLabel(message.by)}</span>
                            <span>•</span>
                            <span>{format(new Date(message.sendAt), 'HH:mm', { locale: ptBR })}</span>
                          </div>
                          
                          {message.text && (
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          )}
                          
                          {message.audio && (
                            <div className="flex items-center gap-2 p-2 bg-black/10 rounded">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm">Mensagem de áudio</span>
                            </div>
                          )}
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="space-y-1">
                              {message.attachments.map((attachment, attIndex) => (
                                <div key={attIndex} className="flex items-center gap-2 p-2 bg-black/10 rounded">
                                  {getMessageIcon(message)}
                                  <span className="text-sm">{attachment.split('/').pop()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}