
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download, Play, Pause, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessagesProps {
  messages: ChatMessage[];
  userName: string;
  userAvatar?: string;
}

const ChatMessages = ({ messages, userName, userAvatar }: ChatMessagesProps) => {
  const [playingAudio, setPlayingAudio] = React.useState<string | null>(null);

  const renderMessageContent = (message: ChatMessage) => {
    switch (message.type) {
      case 'audio':
        return (
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPlayingAudio(playingAudio === message.id ? null : message.id)}
              className="h-8 w-8 p-0"
            >
              {playingAudio === message.id ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <div className="flex-1 text-sm">
              {message.content}
              {message.audioDuration && ` (${message.audioDuration}s)`}
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
            <FileText size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {message.fileName || 'Arquivo'}
              </p>
              {message.content && message.content !== 'Arquivo enviado' && (
                <p className="text-xs opacity-75">{message.content}</p>
              )}
            </div>
            {message.fileUrl && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => window.open(message.fileUrl, '_blank')}
              >
                <Download size={16} />
              </Button>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="max-w-xs">
            {message.fileUrl ? (
              <img 
                src={message.fileUrl} 
                alt={message.content || "Imagem"} 
                className="rounded-lg max-w-full h-auto cursor-pointer"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
            ) : (
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                <ImageIcon size={20} />
                <span className="text-sm">{message.content}</span>
              </div>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  const getSenderName = (message: ChatMessage) => {
    if (message.senderName) {
      return message.senderName;
    }
    
    if (message.isFromUser) {
      return 'Você';
    }
    
    if (message.senderId === 'ai' || message.senderId === 'agent') {
      return 'IA';
    }
    
    return userName;
  };

  const getSenderInitials = (message: ChatMessage) => {
    if (message.isFromUser) {
      return 'EU';
    }
    
    if (message.senderId === 'ai' || message.senderId === 'agent') {
      return 'IA';
    }
    
    const name = message.senderName || userName;
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Nenhuma mensagem ainda</p>
            <p className="text-sm">Envie uma mensagem para começar a conversa</p>
          </div>
        </div>
      ) : (
        messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.isFromUser ? "justify-end" : "justify-start"
            )}
          >
            {!message.isFromUser && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={userAvatar} />
                <AvatarFallback className={cn(
                  "text-xs",
                  message.senderId === 'ai' || message.senderId === 'agent'
                    ? "bg-blue-100 text-blue-900"
                    : "bg-luxfy-purple/20 text-luxfy-purple"
                )}>
                  {getSenderInitials(message)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className={cn(
              "max-w-[70%] rounded-lg p-3",
              message.isFromUser 
                ? "bg-luxfy-purple text-white" 
                : message.senderId === 'ai' || message.senderId === 'agent'
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-900"
            )}>
              {renderMessageContent(message)}
              
              <div className={cn(
                "text-xs mt-1 opacity-70",
                message.isFromUser ? "text-right" : "text-left"
              )}>
                <span>
                  {formatDistanceToNow(message.timestamp, { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
                {!message.isFromUser && (
                  <span className="ml-2 font-medium">
                    {getSenderName(message)}
                  </span>
                )}
              </div>
            </div>

            {message.isFromUser && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  EU
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatMessages;
