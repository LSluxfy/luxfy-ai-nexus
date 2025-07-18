
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useChat } from '@/hooks/use-chat';
import ChatList from '@/components/chat/ChatList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ChatPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
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
  } = useChat();

  // Verificar se veio do CRM com um lead específico
  useEffect(() => {
    if (location.state?.selectedUserId) {
      setSelectedChatId(location.state.selectedUserId);
    }
  }, [location.state, setSelectedChatId]);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title={t('chat.title')} />
      
      <main className="flex-1 flex bg-gray-50">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <ChatHeader
              user={selectedChat.user}
              aiEnabled={selectedChat.aiEnabled}
            />
            
            <ChatMessages
              messages={messages}
              userName={selectedChat.user.name}
              userAvatar={selectedChat.user.avatar}
            />
            
            <ChatInput
              onSendMessage={(content, type) => sendMessage(selectedChatId!, content, type)}
              onToggleAI={() => toggleAI(selectedChatId!)}
              onAddTag={(tag) => addTag(selectedChatId!, tag)}
              onRemoveTag={(tag) => removeTag(selectedChatId!, tag)}
              aiEnabled={selectedChat.aiEnabled}
              userTags={selectedChat.user.tags}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">{t('chat.selectConversation')}</h3>
              <p>{t('chat.selectConversationDesc')}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
