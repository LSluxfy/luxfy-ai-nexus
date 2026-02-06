
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Chat, ChatMessage, ChatSettingsRequest } from '@/types/chat';
import { ChatService } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';

interface UseChatOptions {
  agentId?: string;
  enabled?: boolean;
}

export const useChat = (options: UseChatOptions = {}) => {
  const { agentId, enabled = true } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Query para buscar chats
  const {
    data: chats = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['chats', agentId],
    queryFn: () => agentId ? ChatService.getChats(agentId) : Promise.resolve([]),
    enabled: enabled && !!agentId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });

  // Mutation para enviar mensagem
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      chatId, 
      content, 
      type, 
      attachmentUrl 
    }: { 
      chatId: string; 
      content: string; 
      type: ChatMessage['type'];
      attachmentUrl?: string;
    }) => {
      if (!agentId) throw new Error('Agent ID is required');
      
      const messageData = ChatService.convertMessageToApiFormat(content, type, attachmentUrl);
      return ChatService.sendMessage(agentId, chatId, messageData);
    },
    onSuccess: (newMessage) => {
      // Update the cache with the new message
      queryClient.setQueryData(['chats', agentId], (oldChats: Chat[] = []) => {
        return oldChats.map(chat => {
          if (chat.id === newMessage.chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
              updatedAt: new Date(),
            };
          }
          return chat;
        });
      });

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar configurações do chat
  const updateSettingsMutation = useMutation({
    mutationFn: async ({ 
      chatId, 
      settings 
    }: { 
      chatId: string; 
      settings: ChatSettingsRequest;
    }) => {
      if (!agentId) throw new Error('Agent ID is required');
      return ChatService.updateChatSettings(agentId, chatId, settings);
    },
    onSuccess: (_, { chatId, settings }) => {
      // Update the cache with new settings
      queryClient.setQueryData(['chats', agentId], (oldChats: Chat[] = []) => {
        return oldChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              user: {
                ...chat.user,
                tags: settings.tags,
              },
              aiEnabled: settings.activeIa,
              updatedAt: new Date(),
            };
          }
          return chat;
        });
      });

      toast({
        title: "Configurações atualizadas",
        description: "As configurações do chat foram salvas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Get selected chat
  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const messages = selectedChat?.messages || [];

  // Functions
  const sendMessage = useCallback((
    chatId: string, 
    content: string, 
    type: ChatMessage['type'] = 'text',
    attachmentUrl?: string
  ) => {
    sendMessageMutation.mutate({ chatId, content, type, attachmentUrl });
  }, [sendMessageMutation]);

  const setAIEnabled = useCallback(
    (chatId: string, enabled: boolean) => {
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return;

      // evita chamada desnecessária
      if (chat.aiEnabled === enabled) return;

      const settings: ChatSettingsRequest = {
        tags: chat.user.tags,
        activeIa: enabled,
      };

      updateSettingsMutation.mutate({ chatId, settings });
    },
    [chats, updateSettingsMutation]
  );

  const addTag = useCallback((chatId: string, tag: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat || chat.user.tags.includes(tag)) return;

    const settings: ChatSettingsRequest = {
      tags: [...chat.user.tags, tag],
      activeIa: chat.aiEnabled,
    };

    updateSettingsMutation.mutate({ chatId, settings });
  }, [chats, updateSettingsMutation]);

  const removeTag = useCallback((chatId: string, tag: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const settings: ChatSettingsRequest = {
      tags: chat.user.tags.filter(t => t !== tag),
      activeIa: chat.aiEnabled,
    };

    updateSettingsMutation.mutate({ chatId, settings });
  }, [chats, updateSettingsMutation]);

  return {
    // Data
    chats,
    selectedChat,
    selectedChatId,
    messages,
    
    // States
    isLoading,
    error,
    isSendingMessage: sendMessageMutation.isPending,
    isUpdatingSettings: updateSettingsMutation.isPending,
    
    // Actions
    setSelectedChatId,
    sendMessage,
    setAIEnabled,
    addTag,
    removeTag,
    refetch,
  };
};
