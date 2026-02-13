
import { api } from '@/lib/api';
import type { 
  ApiChat, 
  ApiChatMessage, 
  Chat, 
  ChatMessage, 
  ChatUser,
  GetChatsResponse, 
  SendMessageRequest, 
  SendMessageResponse,
  ChatSettingsRequest,
  ChatSettingsResponse,
  ChatCollectionData
} from '@/types/chat';

export class ChatService {
  /**
   * Get chats for a specific agent
   */
  static async getChats(agentId: string): Promise<Chat[]> {
    try {
      const response = await api.get<GetChatsResponse>(`/v1/chats/${agentId}`);
      const apiChats = response.data.chats;
      
      return apiChats.map(apiChat => this.convertApiChatToChat(apiChat));
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      throw error;
    }
  }

  /**
   * Send a message to a chat
   */
  static async sendMessage(
    agentId: string, 
    chatId: string, 
    messageData: SendMessageRequest
  ): Promise<ChatMessage> {
    try {
      const response = await api.post<SendMessageResponse>(
        `/v1/chats/${agentId}/${chatId}/send`,
        messageData
      );
      
      return this.convertApiMessageToMessage(response.data.response, chatId);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Update chat settings (tags and AI status)
   */
  static async updateChatSettings(
    agentId: string,
    chatId: string,
    settings: ChatSettingsRequest
  ): Promise<void> {
    try {
      await api.post<ChatSettingsResponse>(
        `/v1/chats/${agentId}/${chatId}/settings`,
        settings
      );
    } catch (error) {
      console.error('Erro ao atualizar configurações do chat:', error);
      throw error;
    }
  }

  /**
   * Convert API chat to internal chat structure
   */
  private static convertApiChatToChat(apiChat: ApiChat): Chat {
    // Parse messages from JSON string
    
    let parsedMessages: ApiChatMessage[] = [];
    try {
      parsedMessages = JSON.parse(apiChat.messages || '[]');
    } catch (error) {
      console.error('Erro ao fazer parse das mensagens:', error);
      parsedMessages = [];
    }
    // Parse collection data
    let collectionData: ChatCollectionData = {};

    console.log('[convertApiChatToChat]', {
  apiName: apiChat.name,
  number: apiChat.number,
  collectionNome: collectionData?.nome,
});
    try {
      collectionData = JSON.parse(apiChat.collectionData || '{}');
    } catch (error) {
      console.error('Erro ao fazer parse dos dados coletados:', error);
    }

    // Convert messages
    const messages = parsedMessages.map(apiMessage => 
      this.convertApiMessageToMessage(apiMessage, apiChat.id.toString())
    );

    const safeName =
  (collectionData?.nome && String(collectionData.nome).trim()) ||
  (apiChat.name && String(apiChat.name).trim()) ||
  apiChat.number;

    // Create user from chat data
    const user: ChatUser = {
      id: apiChat.id.toString(),
      name:  safeName,
      phone: apiChat.number,
      tags: apiChat.tags,
      lastSeen: new Date(apiChat.updateAt),
      isOnline: false, // Could be determined from recent activity
    };

    return {
      id: apiChat.id.toString(),
      userId: apiChat.agentId.toString(),
      user,
      messages,
      lastMessage: messages[messages.length - 1],
      unreadCount: 0, // Could be calculated based on read status
      aiEnabled: true, // Default, will be managed per chat
      agentId: apiChat.agentId.toString(),
      createdAt: new Date(apiChat.createAt),
      updatedAt: new Date(apiChat.updateAt),
      collectionData,
    };
  }

  /**
   * Convert API message to internal message structure
   */
  private static convertApiMessageToMessage(apiMessage: ApiChatMessage, chatId: string): ChatMessage {
    let content = '';
    let type: ChatMessage['type'] = 'text';
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (apiMessage.text) {
      content = apiMessage.text;
      type = 'text';
    } else if (apiMessage.image) {
      content = 'Imagem enviada';
      type = 'image';
      fileUrl = apiMessage.image;
    } else if (apiMessage.document) {
      content = 'Documento enviado';
      type = 'file';
      fileUrl = apiMessage.document;
      fileName = apiMessage.document.split('/').pop();
    } else if (apiMessage.audio) {
      content = 'Áudio enviado';
      type = 'audio';
      fileUrl = apiMessage.audio;
    }

    return {
      id: `${chatId}-${Date.now()}-${Math.random()}`,
      chatId,
      senderId: apiMessage.by === 'user' ? 'user' : apiMessage.by,
      content,
      type,
      timestamp: new Date(apiMessage.sendAt),
      isFromUser: apiMessage.by === 'user',
      fileUrl,
      fileName,
      senderName: apiMessage.name,
    };
  }

  /**
   * Convert internal message to API format for sending
   */
  static convertMessageToApiFormat(
    content: string, 
    type: ChatMessage['type'],
    attachmentUrl?: string
  ): SendMessageRequest {
    const request: SendMessageRequest = {};

    if (type === 'text') {
      request.text = content;
    } else if (type === 'image' && attachmentUrl) {
      request.attachment = {
        type: 'image',
        url: attachmentUrl
      };
    } else if (type === 'file' && attachmentUrl) {
      request.attachment = {
        type: 'document',
        url: attachmentUrl
      };
    }

    return request;
  }
}
