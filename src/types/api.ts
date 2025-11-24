// Tipos de planos
export type PlanType = "BASICO" | "PRO" | "PREMIUM";

// Tipos de status
export type InvoiceStatus = "PENDING" | "PAID" | "CANCELLED";
export type StyleResponse = "CONCISE" | "BALANCED" | "DETAILED";
export type MessageSender = "agent" | "attendant" | "user";

// Interface do usuário da API
export interface ApiUser {
  id: number;
  email: string;
  userName: string;
  name: string;
  lastName: string;
  loginMethod: string;
  verificationCode: string;
  numberAgentes: number;
  plan: PlanType;
  profileExpire: string | null;
  createAt: string;
  lastLogin: string | null;
  updateAt: string | null;
  agents: Agent[];
  invoices: Invoice[];
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

// Interface de fatura
export interface Invoice {
  id: number;
  publicId: string;
  amount: number;
  status: InvoiceStatus;
  action: string;
  description: string;
  dueDate?: string;
  paymentDate?: string;
  paidWith?: string;
  paidValue?: number;
  createdAt: string;
  updatedAt: string;
}

// Interface de aprendizado
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

// Interface de fluxo
export interface Flow {
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

// Interface do agente
export interface Agent {
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
  selectVoiceId?: string;
  transferInDistrust: boolean;
  apprenticeship: Apprenticeship[];
  flow: Flow[];
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

// Tipos para requests
export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  plan: PlanType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyUserRequest {
  email: string;
  verificationCode: string;
}

export interface RedeemPasswordRequest {
  email: string;
}

export interface RedeemPasswordCodeRequest {
  token: string;
  newPassword: string;
}

// Tipos para responses
export interface AuthResponse {
  message: string;
  user: ApiUser;
}

export interface LoginResponse {
  message: string;
  jwt: string;
}

export interface DefaultResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

// Tipos para upload de arquivos
export interface UploadRequest {
  files: File[];
  expireAt: string;
  identificator?: string;
}

export interface UploadResponse {
  message: string;
  urls: string[];
}

export interface UploadProgress {
  fileIndex: number;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  url?: string;
  error?: string;
}

export interface FileValidation {
  isValid: boolean;
  errors: string[];
}

export interface UploadConfig {
  maxFiles: number;
  maxSizePerFile: number; // em bytes
  allowedTypes?: string[];
}
