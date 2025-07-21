import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/types/agent-api';

interface AppointmentFormProps {
  agentId: string;
  appointment?: Appointment | null;
  onSuccess: () => void;
}

export function AppointmentForm({ agentId, appointment, onSuccess }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: appointment?.title || '',
    clientName: appointment?.clientName || '',
    dateTime: appointment?.dateTime ? new Date(appointment.dateTime).toISOString().slice(0, 16) : '',
    local: appointment?.local || '',
    observations: appointment?.observations || '',
    type: appointment?.type || 'reuniao_presencial',
    duration: appointment?.duration || 60
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui seria feita a chamada para a API para criar/atualizar o agendamento
      // Como a API não tem endpoints específicos para agendamentos, simulamos o sucesso
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API
      
      toast({
        title: "Sucesso",
        description: appointment ? "Agendamento atualizado com sucesso!" : "Agendamento criado com sucesso!",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar agendamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            min="15"
            max="480"
            step="15"
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
              <SelectItem value="reuniao_presencial">Reunião Presencial</SelectItem>
              <SelectItem value="videochamada">Videochamada</SelectItem>
              <SelectItem value="ligacao">Ligação</SelectItem>
              <SelectItem value="consulta">Consulta</SelectItem>
              <SelectItem value="apresentacao">Apresentação</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
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