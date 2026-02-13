
export interface ChatUser {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  tags: string[];
  lastSeen: Date;
  isOnline: boolean;
}

// API Message structure (what comes from the API)
export interface ApiChatMessage {
  text?: string;
  image?: string;
  document?: string;
  audio?: string;
  sendAt: string;
  name: string;
  by: 'agent' | 'attendant' | 'user';
}

// Internal Message structure (what we use in the app)
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'audio' | 'file' | 'image';
  timestamp: Date;
  isFromUser: boolean;
  fileUrl?: string;
  fileName?: string;
  audioUrl?: string;
  audioDuration?: number;
  senderName?: string;
}

// API Chat structure (what comes from the API)
export interface ApiChat {
  id: number;
  agentId: number;
  number: string;
  name: string;
  tags: string[];
  messages: string; // JSON string
  messagesCount: number;
  collectionData: string; // JSON string
  createAt: string;
  updateAt: string;
}

// Internal Chat structure (what we use in the app)
export interface Chat {
  id: string;
  userId: string;
  user: ChatUser;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  aiEnabled: boolean;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
  collectionData?: Record<string, any>;
}

// API Request/Response types
export interface SendMessageRequest {
  text?: string;
  attachment?: {
    type: 'image' | 'document';
    url: string;
  };
}

export interface SendMessageResponse {
  message: string;
  response: ApiChatMessage;
}

export interface ChatSettingsRequest {
  tags: string[];
  activeIa: boolean;
}

export interface ChatSettingsResponse {
  message: string;
}

export interface GetChatsResponse {
  message: string;
  chats: ApiChat[];
}

// Collection data structure
export interface ChatCollectionData {
  nome?: string;
  email?: string;
  telefone?: string;
  interesse?: string;
  [key: string]: any;
}
