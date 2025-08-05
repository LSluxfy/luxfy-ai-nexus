import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, User, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '@/hooks/use-appointments';
import { AppointmentForm } from '@/components/agent/AppointmentForm';
import { DeleteAppointmentDialog } from '@/components/agent/DeleteAppointmentDialog';
import { AgentSelector } from '@/components/crm/AgentSelector';
import { AppointmentService } from '@/services/appointmentService';
import { ApiAppointment } from '@/types/appointment';
import { useAuth } from '@/contexts/AuthContext';

const AgendaPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ApiAppointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<ApiAppointment | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const { deleting, deleteAppointment, getAppointmentsForAgent } = useAppointments();

  // Get appointments from user context for selected agent
  const appointments = selectedAgentId ? getAppointmentsForAgent(selectedAgentId) : [];

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.dateTime);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => new Date(apt.dateTime) > now);
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => new Date(apt.dateTime) <= now);
  };

  const getAppointmentTypeColor = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (type) {
      case 'reuniao_presencial': return 'default';
      case 'videochamada': return 'secondary';
      case 'ligacao': return 'outline';
      default: return 'outline';
    }
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  const handleEdit = (appointment: ApiAppointment) => {
    setSelectedAppointment(appointment);
    setShowAddForm(true);
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setShowAddForm(true);
  };

  const handleClose = () => {
    setShowAddForm(false);
    setSelectedAppointment(null);
    // Appointments are automatically updated via user context
  };

  const handleDeleteClick = (appointment: ApiAppointment) => {
    setAppointmentToDelete(appointment);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete.id.toString(), () => {
          setAppointmentToDelete(null);
        });
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  // Handle agent selection
  const handleAgentChange = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const selectedAgent = user?.agents?.find(a => a.id.toString() === selectedAgentId);

  if (!user?.agents || user.agents.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title="Agenda" />
        <main className="flex-1 p-6 bg-background">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                Nenhum agente disponível
              </h3>
              <p className="text-muted-foreground">
                Você precisa ter pelo menos um agente para acessar a agenda.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  const todayAppointments = getAppointmentsForDate(new Date());

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Agenda" />
      
      <main className="flex-1 p-6 bg-background">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Agenda</h2>
              <p className="text-muted-foreground">
                {selectedAgent ? `Gerencie os agendamentos do agente ${selectedAgent.name}` : 'Selecione um agente para visualizar a agenda'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <AgentSelector 
                selectedAgentId={selectedAgentId}
                onAgentChange={handleAgentChange}
              />
              
              {selectedAgentId && (
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              )}
            </div>
          </div>
        </div>

        {!selectedAgentId ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                Selecione um agente
              </h3>
              <p className="text-muted-foreground">
                Escolha um agente no menu acima para visualizar sua agenda.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {todayAppointments.length}
              </div>
              <p className="text-sm text-muted-foreground">agendamentos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Próximos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {upcomingAppointments.length}
              </div>
              <p className="text-sm text-muted-foreground">agendamentos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pastAppointments.length}
              </div>
              <p className="text-sm text-muted-foreground">agendamentos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  locale={ptBR}
                />
                
                {selectedDate && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">
                      {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </h4>
                    <div className="space-y-2">
                      {getAppointmentsForDate(selectedDate).map((appointment) => (
                        <div key={appointment.id} className="p-2 bg-muted rounded text-sm">
                          <div className="font-medium">{appointment.title}</div>
                          <div className="text-muted-foreground">
                            {format(new Date(appointment.dateTime), 'HH:mm')} - {appointment.clientName}
                          </div>
                        </div>
                      ))}
                      {getAppointmentsForDate(selectedDate).length === 0 && (
                        <p className="text-sm text-muted-foreground">Nenhum agendamento neste dia</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
                <CardDescription>
                  {upcomingAppointments.length} agendamentos programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum agendamento próximo</p>
                )}
              </CardContent>
            </Card>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Agendamentos Realizados</CardTitle>
                  <CardDescription>
                    {pastAppointments.length} agendamentos concluídos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAppointments.slice(0, 5).map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        isPast={true}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Add/Edit Appointment Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription>
                {selectedAppointment 
                  ? 'Atualize as informações do agendamento'
                  : 'Preencha os dados para criar um novo agendamento'
                }
              </DialogDescription>
            </DialogHeader>
            
            <AppointmentForm
              agentId={selectedAgentId || ''}
              appointment={selectedAppointment}
              onSuccess={handleClose}
              existingAppointments={appointments}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Appointment Dialog */}
        <DeleteAppointmentDialog
          appointment={appointmentToDelete}
          isOpen={!!appointmentToDelete}
          onClose={() => setAppointmentToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={deleting === appointmentToDelete?.id.toString()}
        />
          </>
        )}
      </main>
    </div>
  );
};

// Appointment Card Component
interface AppointmentCardProps {
  appointment: ApiAppointment;
  isPast?: boolean;
  onEdit?: (appointment: ApiAppointment) => void;
  onDelete?: (appointment: ApiAppointment) => void;
}

function AppointmentCard({ appointment, isPast = false, onEdit, onDelete }: AppointmentCardProps) {
  const getAppointmentTypeColor = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (type) {
      case 'reuniao_presencial': return 'default';
      case 'videochamada': return 'secondary';
      case 'ligacao': return 'outline';
      default: return 'outline';
    }
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  return (
    <div className={`p-4 border rounded-lg ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{appointment.title}</h4>
            <Badge variant={getAppointmentTypeColor(appointment.type)}>
              {appointment.type.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{appointment.clientName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {format(new Date(appointment.dateTime), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(appointment.duration)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{appointment.local}</span>
            </div>
            
            {appointment.observations && (
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                {appointment.observations}
              </div>
            )}
          </div>
        </div>
        
        {!isPast && (
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(appointment)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(appointment)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgendaPage;
