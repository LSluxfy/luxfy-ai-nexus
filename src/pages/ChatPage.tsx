
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useChat } from '@/hooks/use-chat';
import ChatList from '@/components/chat/ChatList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const ChatPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { agentId } = useParams<{ agentId?: string }>();
  
  // Get agentId from URL params or location state
  const currentAgentId = agentId || location.state?.agentId || '1';

  const {
    chats,
    selectedChat,
    selectedChatId,
    setSelectedChatId,
    messages,
    sendMessage,
    toggleAI,
    addTag,
    removeTag,
    isLoading,
    error,
    isSendingMessage,
    isUpdatingSettings,
    refetch,
  } = useChat({
    agentId: currentAgentId,
    enabled: !!currentAgentId
  });

  // Check if coming from CRM with a specific lead
  useEffect(() => {
    if (location.state?.selectedUserId) {
      setSelectedChatId(location.state.selectedUserId);
    }
  }, [location.state, setSelectedChatId]);

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title={t('chat.title')} />
        
        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <p className="font-medium">Erro ao carregar chats</p>
                  <p className="text-sm">
                    {error instanceof Error ? error.message : 'Erro desconhecido'}
                  </p>
                  <Button 
                    onClick={() => refetch()} 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                  >
                    Tentar novamente
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title={`${t('chat.title')} ${currentAgentId ? `- Agente ${currentAgentId}` : ''}`} 
      />
      
      <main className="flex-1 flex bg-gray-50">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          isLoading={isLoading}
        />
        
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <ChatHeader
              user={selectedChat.user}
              aiEnabled={selectedChat.aiEnabled}
              isUpdating={isUpdatingSettings}
            />
            
            <ChatMessages
              messages={messages}
              userName={selectedChat.user.name}
              userAvatar={selectedChat.user.avatar}
            />
            
            <ChatInput
              onSendMessage={(content, type, attachmentUrl) => 
                sendMessage(selectedChatId!, content, type, attachmentUrl)
              }
              onToggleAI={() => toggleAI(selectedChatId!)}
              onAddTag={(tag) => addTag(selectedChatId!, tag)}
              onRemoveTag={(tag) => removeTag(selectedChatId!, tag)}
              aiEnabled={selectedChat.aiEnabled}
              userTags={selectedChat.user.tags}
              disabled={isSendingMessage || isUpdatingSettings}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {isLoading ? 'Carregando conversas...' : t('chat.selectConversation')}
              </h3>
              <p>
                {isLoading 
                  ? 'Aguarde enquanto buscamos suas conversas'
                  : t('chat.selectConversationDesc')
                }
              </p>
              {chats.length === 0 && !isLoading && (
                <div className="mt-4">
                  <Button 
                    onClick={() => refetch()} 
                    variant="outline"
                  >
                    Atualizar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
