
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AppointmentService } from '@/services/appointmentService';
import {
  ApiAppointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest
} from '@/types/appointment';

export function useAppointments() {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get appointments from user context for specific agent
  const getAppointmentsForAgent = useCallback((agentId: string): ApiAppointment[] => {
    if (!user?.appointments) return [];
    return user.appointments.filter((apt: ApiAppointment) => apt.agentId.toString() === agentId);
  }, [user?.appointments]);

  const createAppointment = useCallback(async (
    agentId: string,
    formData: any,
    onSuccess?: (appointment: ApiAppointment) => void
  ) => {
    setLoading(true);
    try {
      const appointmentData = AppointmentService.formatCreateAppointmentData({ ...formData, agentId });
      const response = await AppointmentService.createAppointment(appointmentData);
      
      toast({
        title: "Sucesso",
        description: response.message,
      });

      if (onSuccess) {
        onSuccess(response.appointment);
      }

      return response.appointment;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateAppointment = useCallback(async (
    appointmentId: string,
    formData: any,
    onSuccess?: (appointment: ApiAppointment) => void
  ) => {
    setLoading(true);
    try {
      const appointmentData = AppointmentService.formatUpdateAppointmentData(formData);
      const response = await AppointmentService.updateAppointment(appointmentId, appointmentData);
      
      toast({
        title: "Sucesso",
        description: response.message,
      });

      if (onSuccess) {
        onSuccess(response.appointment);
      }

      return response.appointment;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteAppointment = useCallback(async (
    appointmentId: string,
    onSuccess?: () => void
  ) => {
    setDeleting(appointmentId);
    try {
      const response = await AppointmentService.deleteAppointment(appointmentId);
      
      toast({
        title: "Sucesso",
        description: response.message,
      });

      if (onSuccess) {
        onSuccess();
      }

      return response;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setDeleting(null);
    }
  }, [toast]);

  const validateAppointmentTime = useCallback((
    dateTime: string,
    duration: number,
    existingAppointments: ApiAppointment[]
  ) => {
    return AppointmentService.validateAppointmentTime(dateTime, duration, existingAppointments);
  }, []);

  return {
    loading,
    deleting,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    validateAppointmentTime,
    getAppointmentsForAgent
  };
}
