
import api from '@/lib/api';
import {
  ApiAppointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  CreateAppointmentResponse,
  UpdateAppointmentResponse,
  DeleteAppointmentResponse,
  AppointmentError
} from '@/types/appointment';

export class AppointmentService {
  // Create new appointment for an agent
  static async createAppointment(
    agentId: string, 
    data: CreateAppointmentRequest
  ): Promise<CreateAppointmentResponse> {
    try {
      const response = await api.post(`/v1/appointments/create/${agentId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar agendamento');
    }
  }

  // Update existing appointment
  static async updateAppointment(
    appointmentId: string, 
    data: UpdateAppointmentRequest
  ): Promise<UpdateAppointmentResponse> {
    try {
      const response = await api.put(`/v1/appointments/edit/${appointmentId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar agendamento');
    }
  }

  // Delete appointment
  static async deleteAppointment(appointmentId: string): Promise<DeleteAppointmentResponse> {
    try {
      const response = await api.delete(`/v1/appointments/delete/${appointmentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar agendamento');
    }
  }

  // Format appointment data for API
  static formatAppointmentData(formData: any): CreateAppointmentRequest | UpdateAppointmentRequest {
    return {
      title: formData.title,
      clientName: formData.clientName,
      dateTime: formData.dateTime,
      local: formData.local,
      observations: formData.observations || undefined,
      type: formData.type,
      duration: parseInt(formData.duration.toString())
    };
  }

  // Validate appointment conflicts (client-side)
  static validateAppointmentTime(dateTime: string, duration: number, existingAppointments: ApiAppointment[]): boolean {
    const newStart = new Date(dateTime);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    return !existingAppointments.some(apt => {
      const existingStart = new Date(apt.dateTime);
      const existingEnd = new Date(existingStart.getTime() + apt.duration * 60000);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }
}
