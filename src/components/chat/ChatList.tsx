
import React from 'react';
import { Chat } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isLoading?: boolean;
}

const ChatList = ({ chats, selectedChatId, onSelectChat }: ChatListProps) => {
  // Ordenar chats por mensagem mais recente primeiro
  const sortedChats = [...chats].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || a.updatedAt;
    const bTime = b.lastMessage?.timestamp || b.updatedAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });


  function isProbablyPhone(value: string) {
    const v = (value || "").replace(/\D/g, "");
    // 10~15 dígitos costuma ser telefone (BR +55 etc)
    return v.length >= 10 && v.length <= 15;
  }

  function formatPhoneBR(raw: string) {
    const digits = (raw || "").replace(/\D/g, "");
    // fallback simples (não inventar demais)
    if (digits.length === 13 && digits.startsWith("55")) {
      const ddd = digits.slice(2, 4);
      const n1 = digits.slice(4, 9);
      const n2 = digits.slice(9);
      return `+55 (${ddd}) ${n1}-${n2}`;
    }
    return raw;
  }

  function getDisplayName(chat: Chat) {
    const name = (chat.user?.name || "").trim();
    const phone = (chat.user?.phone || "").trim();

    // se name está vazio ou parece telefone, cai pro phone formatado
    if (!name || isProbablyPhone(name)) {
      return phone ? formatPhoneBR(phone) : "Sem nome";
    }

    return name;
  }

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Conversas</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Buscar conversas..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxfy-purple"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {sortedChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
              selectedChatId === chat.id && "bg-luxfy-purple/10 border-luxfy-purple/20"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.user.avatar} />
                  <AvatarFallback className="bg-luxfy-purple/20 text-luxfy-purple">
                    {chat.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {chat.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {getDisplayName(chat)}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(chat.lastMessage.timestamp, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.user.phone}
                </p>
                
                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chat.lastMessage.content}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  {chat.user.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs bg-luxfy-purple/10 text-luxfy-purple"
                    >
                      {tag}
                    </Badge>
                  ))}
                  
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-green-500 text-white text-xs">
                      {chat.unreadCount}
                    </Badge>
                  )}
                  
                  {chat.aiEnabled && (
                    <Badge variant="outline" className="text-xs border-luxfy-purple text-luxfy-purple">
                      IA
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
