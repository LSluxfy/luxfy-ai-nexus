
// Real API appointment types based on the documentation

export interface ApiAppointment {
  id: number;
  title: string;
  clientName: string;
  dateTime: string;
  local: string;
  observations?: string | null;
  type: string;
  duration: number;
  agentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  title: string;
  clientName: string;
  dateTime: string;
  local: string;
  observations?: string;
  type: string;
  duration: number;
}

export interface UpdateAppointmentRequest {
  title: string;
  clientName: string;
  dateTime: string;
  local: string;
  observations?: string;
  type: string;
  duration: number;
}

export interface CreateAppointmentResponse {
  message: string;
  appointment: ApiAppointment;
}

export interface UpdateAppointmentResponse {
  message: string;
  appointment: ApiAppointment;
}

export interface DeleteAppointmentResponse {
  message: string;
}

export interface AppointmentError {
  error: string;
}

export type AppointmentType = 
  | 'reuniao_presencial'
  | 'videochamada'
  | 'ligacao'
  | 'consulta'
  | 'apresentacao'
  | 'outro';

export const APPOINTMENT_TYPES: { value: AppointmentType; label: string }[] = [
  { value: 'reuniao_presencial', label: 'Reunião Presencial' },
  { value: 'videochamada', label: 'Videochamada' },
  { value: 'ligacao', label: 'Ligação' },
  { value: 'consulta', label: 'Consulta' },
  { value: 'apresentacao', label: 'Apresentação' },
  { value: 'outro', label: 'Outro' }
];
