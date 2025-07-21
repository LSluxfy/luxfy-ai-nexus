
import React from 'react';
import { ChatUser } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, MoreVertical, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatHeaderProps {
  user: ChatUser;
  aiEnabled: boolean;
  isUpdating?: boolean;
}

const ChatHeader = ({ user, aiEnabled }: ChatHeaderProps) => {
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
                    locale: ptBR 
                  })}`
              }
            </p>
            <p className="text-xs text-gray-400">{user.phone}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-luxfy-purple">
            <Phone size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-luxfy-purple">
            <Video size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-luxfy-purple">
            <Settings size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-luxfy-purple">
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
