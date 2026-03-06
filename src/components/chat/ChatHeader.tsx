
import React from 'react';
import { ChatUser } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from "date-fns/locale";
import { useTranslation } from 'react-i18next';

interface ChatHeaderProps {
  user: ChatUser;
  aiEnabled: boolean;
  isUpdating?: boolean;
}

const ChatHeader = ({ user, aiEnabled }: ChatHeaderProps) => {
  const { i18n } = useTranslation();

  const dateLocaleMap = {
    pt: ptBR,
    "pt-BR": ptBR,
    en: enUS,
    "en-US": enUS,
    es: es,
    "es-ES": es,
  };
  
  const currentLocale = dateLocaleMap[i18n.language] || enUS;
  return (
    <div className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-luxfy-purple/20 text-luxfy-purple">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              {aiEnabled && (
                <Badge variant="outline" className="text-xs border-luxfy-purple text-luxfy-purple">
                  IA Ativa
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {user.isOnline 
                ? 'Online' 
                : `Visto por último ${formatDistanceToNow(user.lastSeen, { 
                    addSuffix: true, 
                    locale: currentLocale 
                  })}`
              }
            </p>
            <p className="text-xs text-gray-400">{user.phone.replace(/@.+$/, '')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
