import React, { useMemo, useState } from 'react';
import { Chat } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from "date-fns/locale";
import { useTranslation } from 'react-i18next';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isLoading?: boolean;
}

const ChatList = ({ chats, selectedChatId, onSelectChat }: ChatListProps) => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const dateLocaleMap = {
    pt: ptBR,
    "pt-BR": ptBR,
    en: enUS,
    "en-US": enUS,
    es: es,
    "es-ES": es,
  };

  const currentLocale = dateLocaleMap[i18n.language] || enUS;

  const filteredAndSortedChats = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = chats.filter((chat) =>
      (chat.user?.phone || '').endsWith('@s.whatsapp.net')
    );

    const filtered = !q
      ? base
      : base.filter((chat) => {
          const name = (chat.user.name || '').toLowerCase();
          const phone = (chat.user.phone || '').replace(/@.+$/, '').toLowerCase();
          const lastMsg = (chat.lastMessage?.content || '').toLowerCase();
          const tags = (chat.user.tags || []).join(' ').toLowerCase();

          return (
            name.includes(q) ||
            phone.includes(q) ||
            lastMsg.includes(q) ||
            tags.includes(q)
          );
        });

    return [...filtered].sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || a.updatedAt;
      const bTime = b.lastMessage?.timestamp || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [chats, search]);

  return (
    <div className="w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">{t('chatList.title')}</h2>
        <div className="mt-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('chatList.searchPlaceholder')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-luxfy-purple"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
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
                  <h3 className="font-medium truncate">
                    {chat.user.name}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(chat.lastMessage.timestamp, {
                        addSuffix: true,
                        locale: currentLocale,
                      })}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.user.phone.replace(/@.+$/, '')}
                </p>

                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chat.lastMessage.content}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  {chat.user.tags.map((tag) => (
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

        {filteredAndSortedChats.length === 0 && (
          <div className="p-6 text-sm">
            {t('chatList.noResults') ?? 'Nenhuma conversa encontrada.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;