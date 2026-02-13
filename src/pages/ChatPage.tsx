
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useChat } from '@/hooks/use-chat';
import ChatList from '@/components/chat/ChatList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ChatPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId?: string }>();
  const { user } = useAuth();
  
  // Estado para o agente selecionado
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    agentId || location.state?.agentId || 
    (user?.agents && user.agents.length > 0 ? user.agents[0].id.toString() : null)
  );

  // Get current agent ID from URL params or selected agent
  const currentAgentId = agentId || selectedAgentId;

  // Handler para mudança de agente
  const handleAgentChange = (newAgentId: string) => {
    setSelectedAgentId(newAgentId);
    navigate(`/dashboard/chat`, { replace: true });
  };

  const {
    chats,
    selectedChat,
    selectedChatId,
    setSelectedChatId,
    messages,
    sendMessage,
    setAIEnabled,
    addTag,
    removeTag,
    isLoading,
    error,
    isSendingMessage,
    isUpdatingSettings,
    refetch,
  } = useChat({
    agentId: currentAgentId || '',
    enabled: !!currentAgentId
  });

  // Check if coming from CRM with a specific lead
  useEffect(() => {
    if (location.state?.selectedUserId) {
      setSelectedChatId(location.state.selectedUserId);
    }
  }, [location.state, setSelectedChatId]);
  useEffect(() => {
    console.log("[useChat] chats payload:", chats);
  }, [chats]);

  useEffect(() => {
    console.log("[useChat] selectedChat:", selectedChat);
    console.log("[useChat] messages:", messages);
  }, [selectedChat, messages]);

  // Mostrar erro se não há agente selecionado
  if (!currentAgentId && user?.agents && user.agents.length > 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title={t('chat.title')}>
          <AgentSelector
            selectedAgentId={currentAgentId}
            onAgentChange={handleAgentChange}
          />
        </DashboardHeader>
        
        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full text-center">
            <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Selecione um agente</h3>
            <p className="text-gray-600">
              Escolha um agente acima para visualizar as conversas
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
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
                    onClick={() => {
                      console.log('Tentando novamente carregar chats para agente:', currentAgentId);
                      refetch();
                    }} 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Carregando...' : 'Tentar novamente'}
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
    <div className="flex flex-col h-screen">
      <DashboardHeader title={t('chat.title')}>
        <AgentSelector
          selectedAgentId={currentAgentId}
          onAgentChange={handleAgentChange}
        />
      </DashboardHeader>
      
      <main className="flex-1 flex bg-background min-h-0">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          isLoading={isLoading}
        />
        
        {selectedChat ? (
          <div className="flex-1 flex flex-col h-full">
            <ChatHeader
              user={selectedChat.user}
              aiEnabled={selectedChat.aiEnabled}
              isUpdating={isUpdatingSettings}
            />
            
            <div className="flex-1 overflow-hidden">
              <ChatMessages
                messages={messages}
                userName={selectedChat.user.name}
                userAvatar={selectedChat.user.avatar}
              />
            </div>
            
            <div className="flex-shrink-0">
              <ChatInput
                 onSendMessage={async (content, type, attachmentUrl) => {
                  const raw = content.trim();

                  if (raw === "/stop") {
                    await setAIEnabled(selectedChatId!, false); // novo: recebe boolean
                    // opcional: enviar mensagem local/toast
                    return;
                  }

                  if (raw === "/start") {
                    await setAIEnabled(selectedChatId!, true);
                    return;
                  }

                  // segue fluxo normal
                  return sendMessage(selectedChatId!, content, type, attachmentUrl);
                }}
                onToggleAI={() => setAIEnabled(selectedChatId!, !selectedChat.aiEnabled)}
                onAddTag={(tag) => addTag(selectedChatId!, tag)}
                onRemoveTag={(tag) => removeTag(selectedChatId!, tag)}
                aiEnabled={selectedChat.aiEnabled}
                userTags={selectedChat.user.tags}
                disabled={isSendingMessage || isUpdatingSettings}
                agentId={currentAgentId}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-card">
            <div className="text-center text-muted-foreground">
              <MessageSquare size={64} className="mx-auto mb-4 text-muted-foreground/50" />
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
                    onClick={() => {
                      console.log('Atualizando chats para agente:', currentAgentId);
                      refetch();
                    }} 
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Atualizando...' : 'Atualizar'}
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
