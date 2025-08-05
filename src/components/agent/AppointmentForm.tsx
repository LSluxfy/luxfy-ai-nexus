
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments } from '@/hooks/use-appointments';
import { ApiAppointment, APPOINTMENT_TYPES } from '@/types/appointment';

interface AppointmentFormProps {
  agentId: string;
  appointment?: ApiAppointment | null;
  onSuccess: () => void;
  existingAppointments?: ApiAppointment[];
}

export function AppointmentForm({ 
  agentId, 
  appointment, 
  onSuccess, 
  existingAppointments = [] 
}: AppointmentFormProps) {
  const { loading, createAppointment, updateAppointment, validateAppointmentTime } = useAppointments();
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    dateTime: '',
    local: '',
    observations: '',
    type: 'reuniao_presencial',
    duration: 60
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        clientName: appointment.clientName,
        dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16),
        local: appointment.local,
        observations: appointment.observations || '',
        type: appointment.type,
        duration: appointment.duration
      });
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation for appointment conflicts
    if (formData.dateTime && formData.duration) {
      const conflictingAppointments = existingAppointments.filter(apt => 
        appointment ? apt.id !== appointment.id : true
      );
      
      if (!validateAppointmentTime(formData.dateTime, formData.duration, conflictingAppointments)) {
        return; // Toast will be shown by the hook
      }
    }

    try {
      if (appointment) {
        await updateAppointment(appointment.id.toString(), formData, () => {
          onSuccess();
        });
      } else {
        await createAppointment(agentId, formData, () => {
          onSuccess();
        });
      }
    } catch (error) {
      // Error handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Reunião com cliente..."
            required
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientName">Nome do Cliente</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
            placeholder="João Silva"
            required
            maxLength={255}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateTime">Data e Hora</Label>
          <Input
            id="dateTime"
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Agendamento</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APPOINTMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local</Label>
          <Input
            id="local"
            value={formData.local}
            onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
            placeholder="Sala de reuniões 01"
            required
            maxLength={255}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
          placeholder="Observações adicionais sobre o agendamento..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : appointment ? 'Atualizar Agendamento' : 'Criar Agendamento'}
        </Button>
      </div>
    </form>
  );
}
