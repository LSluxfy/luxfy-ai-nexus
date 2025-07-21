
// Tipos específicos para a API externa de agentes

export type PlanType = 'BASICO' | 'PRO' | 'PREMIUM';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type StyleResponse = 'CONCISE' | 'BALANCED' | 'DETAILED';
export type MessageSender = 'agent' | 'attendant' | 'user';
export type CampaignFrequency = 'HOUR' | 'MINUTE' | 'DAY' | 'WEEK' | 'MONTH';
export type CampaignSendBy = 'PREFER_EMAIL' | 'PREFER_WHATSAPP' | 'ONLY_EMAIL' | 'ONLY_WHATSAPP' | 'EMAIL_AND_WHATSAPP';
export type ConversationStatus = 'active' | 'completed' | 'transferred' | 'waiting_user';
export type MessageType = 'text' | 'audio';

// Interface de aprendizado Q&A
export interface Apprenticeship {
  question: string;
  response: string;
  files: string[];
  exact: boolean;
  id: string;
}

// Interface de etapa de fluxo
export interface FlowStep {
  objective: string;
  condition: string;
  files: string[];
  possibleAudio: boolean;
  id: string;
}

// Interface de fluxo conversacional
export interface ConversationFlow {
  name: string;
  keywords: string[];
  steps: FlowStep[];
}

// Interface de métricas mensais
export interface MonthlyMetrics {
  initChats: number;
  clients: number;
  finishChats: number;
  timeResponse: number;
  satisfaction: number;
}

// Interface de mensagem de chat
export interface ChatMessage {
  text?: string;
  audio?: string;
  attachments?: string[];
  sendAt: string;
  by: MessageSender;
}

// Interface de chat
export interface Chat {
  id: number;
  agentId: number;
  number: string;
  tags: string[];
  messages: ChatMessage[];
  messagesCount: number;
  createdAt: string;
  updatedAt: string;
}

// Interface de agendamento
export interface Appointment {
  id: number;
  agentId: number;
  title: string;
  clientName: string;
  dateTime: string;
  local: string;
  observations?: string;
  type: string;
  duration: number;
  createAt: string;
  updateAt: string;
}

// Interface de campanha
export interface Campaign {
  id: number;
  agentId: number;
  name: string;
  tags: string[];
  dispatchesPer: CampaignFrequency;
  attachments: string[];
  startDate: string;
  endDate?: string;
  sendBy: CampaignSendBy;
  message?: string;
  subject?: string;
  body?: string;
  active: boolean;
  createAt: string;
  updateAt: string;
  lastSentAt?: string;
}

// Interface completa do agente da API externa
export interface ApiAgent {
  id: number;
  userId: number;
  oficialMetaWhatsappPhoneNumber?: string;
  hostEmail?: string;
  portEmail?: string;
  secureEmail?: boolean;
  userEmail?: string;
  name: string;
  description: string;
  language: string;
  model: string;
  appointmentsBlocked?: string[];
  appointmentsRules: string;
  appointmentsDefaultDuration: number;
  appointmentsStartTime: string;
  appointmentsEndTime: string;
  delayResponse: number;
  styleResponse: StyleResponse;
  ElevenLabsApiKey?: string;
  ElevenLabsVoice?: string;
  transferInDistrust: boolean;
  apprenticeship: Apprenticeship[];
  flow: ConversationFlow[];
  metrics: Record<string, Record<string, MonthlyMetrics>>;
  chats: Chat[];
  tags: string[];
  Faq: string;
  appointments: Appointment[];
  ProductsServices: string;
  AboutCompany: string;
  active: boolean;
  initializedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Requests
export interface CreateAgentRequest {
  name: string;
  description?: string;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  language?: string;
  model?: string;
  appointmentsRules?: string;
  appointmentsDefaultDuration?: number;
  appointmentsStartTime?: string;
  appointmentsEndTime?: string;
  delayResponse?: number;
  styleResponse?: StyleResponse;
  ElevenLabsApiKey?: string;
  ElevenLabsVoice?: string;
  transferInDistrust?: boolean;
  apprenticeship?: Apprenticeship[];
  flow?: ConversationFlow[];
  tags?: string[];
  Faq?: string;
  ProductsServices?: string;
  AboutCompany?: string;
  active?: boolean;
  oficialMetaWhatsappPhoneNumber?: string;
  hostEmail?: string;
  portEmail?: string;
  secureEmail?: boolean;
  userEmail?: string;
}

export interface CreateCampaignRequest {
  name: string;
  tags?: string[];
  dispatchesPer?: CampaignFrequency;
  attachments?: string[];
  startDate: string;
  endDate?: string;
  sendBy?: CampaignSendBy;
  message?: string;
  subject?: string;
  body?: string;
  active?: boolean;
}

export interface SimulatorContext {
  role: 'user' | 'assistant';
  content: string;
}

export interface SimulatorRequest {
  context: SimulatorContext[];
  message: string;
}

export interface SimulatorResponse {
  currentFlowId: string | null;
  currentStepId: string | null;
  nextStepId: string | null;
  message: string;
  messageType: MessageType;
  files: string[];
  acceptAudio: boolean;
  conversationStatus: ConversationStatus;
  transferReason?: string;
  appointment?: {
    date: string;
    time: string;
    name: string;
    reason: string;
    duration?: number;
  };
  confidence: number;
  suggestedActions?: string[];
  collectedData?: Record<string, any>;
  shouldDelay: boolean;
  delayMs?: number;
}

// Responses
export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface CreateAgentResponse extends ApiResponse<ApiAgent> {
  agent: ApiAgent;
}

export interface UpdateAgentResponse extends ApiResponse<ApiAgent> {
  agent: ApiAgent;
}

export interface ConnectAgentResponse extends ApiResponse<any> {
  agent: {
    id: number;
    name: string;
    qr_string: string;
    generated: boolean;
  };
}

export interface AgentStatusResponse extends ApiResponse<any> {
  isOnline: boolean;
}

export interface CreateCampaignResponse extends ApiResponse<Campaign> {
  campaign: Campaign;
}

export interface GetCampaignsResponse extends ApiResponse<Campaign[]> {
  campaigns: Campaign[];
}

export interface SimulatorApiResponse extends ApiResponse<SimulatorResponse> {
  response: SimulatorResponse;
}
