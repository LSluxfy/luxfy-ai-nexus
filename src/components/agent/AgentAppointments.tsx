import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2 } from 'lucide-react';
import { ApiAgent, Appointment } from '@/types/agent-api';
import { AppointmentForm } from './AppointmentForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgentAppointmentsProps {
  agent: ApiAgent;
}

export function AgentAppointments({ agent }: AgentAppointmentsProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const appointments = agent.appointments || [];
  const upcomingAppointments = appointments.filter(apt => new Date(apt.dateTime) >= new Date());
  const pastAppointments = appointments.filter(apt => new Date(apt.dateTime) < new Date());

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const getAppointmentTypeColor = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    const typeColors: { [key: string]: "default" | "destructive" | "outline" | "secondary" } = {
      'reuniao_presencial': 'default',
      'videochamada': 'secondary',
      'ligacao': 'outline',
      'consulta': 'default',
    };
    return typeColors[type] || 'outline';
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  const AppointmentCard = ({ appointment, isPast = false }: { appointment: Appointment, isPast?: boolean }) => (
    <Card key={appointment.id} className={`${isPast ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{appointment.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getAppointmentTypeColor(appointment.type)}>
                {appointment.type.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(appointment.duration)}
              </Badge>
            </div>
          </div>
          
          {!isPast && (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(appointment)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.clientName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(appointment.dateTime), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(appointment.dateTime), 'HH:mm', { locale: ptBR })}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.local}</span>
        </div>
        
        {appointment.observations && (
          <div className="text-sm text-muted-foreground">
            <p className="line-clamp-2">{appointment.observations}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Agendado em: {format(new Date(appointment.createAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Sistema de Agendamentos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie a agenda e compromissos do agente
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
            </DialogHeader>
            <AppointmentForm
              agentId={agent.id.toString()}
              appointment={selectedAppointment}
              onSuccess={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-sm text-muted-foreground">Próximos Agendamentos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{pastAppointments.length}</div>
              <p className="text-sm text-muted-foreground">Agendamentos Passados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{agent.appointmentsDefaultDuration}min</div>
              <p className="text-sm text-muted-foreground">Duração Padrão</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Horário de Funcionamento:</span>
              <p>{agent.appointmentsStartTime} - {agent.appointmentsEndTime}</p>
            </div>
            <div>
              <span className="font-medium">Duração Padrão:</span>
              <p>{agent.appointmentsDefaultDuration} minutos</p>
            </div>
            <div>
              <span className="font-medium">Horários Bloqueados:</span>
              <p>{agent.appointmentsBlocked?.length || 0} períodos</p>
            </div>
          </div>
          
          {agent.appointmentsRules && (
            <div>
              <span className="font-medium text-sm">Regras:</span>
              <p className="text-sm text-muted-foreground mt-1">{agent.appointmentsRules}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {upcomingAppointments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Próximos Agendamentos ({upcomingAppointments.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAppointments
                .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                .map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              }
            </div>
          </div>
        )}

        {pastAppointments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Histórico de Agendamentos ({pastAppointments.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastAppointments
                .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                .slice(0, 6)
                .map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} isPast />
                ))
              }
            </div>
            
            {pastAppointments.length > 6 && (
              <div className="text-center">
                <Button variant="outline">Ver Todos os Agendamentos Passados</Button>
              </div>
            )}
          </div>
        )}

        {appointments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie seu primeiro agendamento para começar a organizar a agenda
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Agendamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}