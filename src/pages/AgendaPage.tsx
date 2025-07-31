import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Plus, Edit, Trash2, User, MapPin, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  title: string;
  client: string;
  date: Date;
  time: string;
  duration: number;
  type: 'reunião' | 'ligação' | 'demonstração' | 'follow-up';
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluído';
  notes?: string;
  location?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Demonstração do Produto',
    client: 'João Silva',
    date: new Date(2024, 11, 15, 14, 0),
    time: '14:00',
    duration: 60,
    type: 'demonstração',
    status: 'confirmado',
    notes: 'Cliente interessado no plano Pro',
    location: 'Online - Google Meet'
  },
  {
    id: '2',
    title: 'Follow-up Comercial',
    client: 'Maria Santos',
    date: new Date(2024, 11, 16, 10, 30),
    time: '10:30',
    duration: 30,
    type: 'follow-up',
    status: 'agendado',
    notes: 'Verificar interesse após proposta',
    location: 'Telefone'
  }
];

const AgendaPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    duration: 60,
    type: 'reunião' as const,
    notes: '',
    location: ''
  });
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [showBlockDateDialog, setShowBlockDateDialog] = useState(false);
  const [dateToBlock, setDateToBlock] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const getWeekAppointments = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return appointments.filter(apt => 
      apt.date >= startOfWeek && apt.date <= endOfWeek
    ).length;
  };

  const getMonthAppointments = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return appointments.filter(apt => 
      apt.date >= startOfMonth && apt.date <= endOfMonth
    ).length;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'concluído': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'reunião': return 'bg-purple-100 text-purple-800';
      case 'ligação': return 'bg-blue-100 text-blue-800';
      case 'demonstração': return 'bg-orange-100 text-orange-800';
      case 'follow-up': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addAppointment = () => {
    if (newAppointment.title && newAppointment.client && newAppointment.date && newAppointment.time) {
      const appointment: Appointment = {
        id: Date.now().toString(),
        ...newAppointment,
        date: new Date(`${newAppointment.date}T${newAppointment.time}`),
        status: 'agendado'
      };
      
      setAppointments([...appointments, appointment]);
      setNewAppointment({
        title: '',
        client: '',
        date: '',
        time: '',
        duration: 60,
        type: 'reunião',
        notes: '',
        location: ''
      });
      setShowAddForm(false);
    }
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const blockDate = () => {
    if (dateToBlock) {
      const date = new Date(dateToBlock);
      setBlockedDates([...blockedDates, date]);
      setDateToBlock('');
      setBlockReason('');
      setShowBlockDateDialog(false);
    }
  };

  const unblockDate = (dateToUnblock: Date) => {
    setBlockedDates(blockedDates.filter(date => 
      date.toDateString() !== dateToUnblock.toDateString()
    ));
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => 
      blockedDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Agenda Inteligente" />
      
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Agenda Inteligente</h2>
              <p className="text-gray-600 dark:text-gray-300">Gerencie compromissos automaticamente com IA</p>
            </div>
            
            <div className="flex gap-2">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={view === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('calendar')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendário
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  Lista
                </Button>
              </div>
              
              <Dialog open={showBlockDateDialog} onOpenChange={setShowBlockDateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    Bloquear Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bloquear Data na Agenda</DialogTitle>
                    <DialogDescription>
                      Selecione uma data para bloquear agendamentos
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Data</label>
                      <Input
                        type="date"
                        value={dateToBlock}
                        onChange={(e) => setDateToBlock(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Motivo (opcional)</label>
                      <Input
                        placeholder="Ex: Feriado, viagem, etc."
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={blockDate} className="flex-1">
                        Bloquear Data
                      </Button>
                      <Button variant="outline" onClick={() => setShowBlockDateDialog(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Compromisso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo Compromisso</DialogTitle>
                    <DialogDescription>
                      Agende um novo compromisso manualmente
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Título</label>
                      <Input
                        placeholder="Ex: Reunião comercial"
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Cliente</label>
                      <Input
                        placeholder="Nome do cliente"
                        value={newAppointment.client}
                        onChange={(e) => setNewAppointment({...newAppointment, client: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Data</label>
                        <Input
                          type="date"
                          value={newAppointment.date}
                          onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Horário</label>
                        <Input
                          type="time"
                          value={newAppointment.time}
                          onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <select 
                          className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800"
                          value={newAppointment.type}
                          onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as any})}
                        >
                          <option value="reunião">Reunião</option>
                          <option value="ligação">Ligação</option>
                          <option value="demonstração">Demonstração</option>
                          <option value="follow-up">Follow-up</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duração (min)</label>
                        <Input
                          type="number"
                          value={newAppointment.duration}
                          onChange={(e) => setNewAppointment({...newAppointment, duration: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Local/Link</label>
                      <Input
                        placeholder="Ex: Google Meet, Escritório..."
                        value={newAppointment.location}
                        onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Observações</label>
                      <Textarea
                        placeholder="Observações sobre o compromisso..."
                        value={newAppointment.notes}
                        onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={addAppointment} className="flex-1">
                        Agendar
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
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
                  className="rounded-md border dark:border-gray-700"
                  locale={ptBR}
                  modifiers={{
                    blocked: blockedDates
                  }}
                  modifiersStyles={{
                    blocked: {
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      textDecoration: 'line-through'
                    }
                  }}
                />
                
                {/* Legenda */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span>Datas bloqueadas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blocked Dates Management */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Datas Bloqueadas</CardTitle>
                <CardDescription>
                  Gerencie as datas indisponíveis para agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blockedDates.length > 0 ? (
                  <div className="space-y-2">
                    {blockedDates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border">
                        <div className="flex items-center gap-2">
                          <Lock size={14} className="text-red-600" />
                          <span className="text-sm font-medium">
                            {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-600 hover:text-red-700"
                          onClick={() => unblockDate(date)}
                        >
                          <Unlock size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma data bloqueada</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hoje</span>
                  <span className="font-medium">
                    {selectedDate && isDateBlocked(selectedDate) ? 
                      'Data bloqueada' : 
                      `${getAppointmentsForDate(new Date()).length} compromissos`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Esta semana</span>
                  <span className="font-medium">{getWeekAppointments()} compromissos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Este mês</span>
                  <span className="font-medium">{getMonthAppointments()} compromissos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Datas bloqueadas</span>
                  <span className="font-medium">{blockedDates.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List/Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? (
                    <>
                      {`Compromissos - ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}`}
                      {isDateBlocked(selectedDate) && (
                        <Badge variant="destructive" className="ml-2">
                          <Lock size={12} className="mr-1" />
                          Data Bloqueada
                        </Badge>
                      )}
                    </>
                  ) : (
                    'Próximos Compromissos'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && isDateBlocked(selectedDate) ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lock className="h-12 w-12 text-red-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Data Bloqueada</h3>
                    <p>Esta data está indisponível para agendamentos</p>
                  </div>
                ) : view === 'calendar' ? (
                  <div className="space-y-3">
                    {selectedDate && getAppointmentsForDate(selectedDate).length > 0 ? (
                      getAppointmentsForDate(selectedDate).map(appointment => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{appointment.title}</h4>
                              <Badge className={getTypeColor(appointment.type)}>
                                {appointment.type}
                              </Badge>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User size={14} />
                                {appointment.client}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {appointment.time} ({appointment.duration}min)
                              </div>
                              {appointment.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {appointment.location}
                                </div>
                              )}
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => deleteAppointment(appointment.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p>Nenhum compromisso para esta data</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Compromisso</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map(appointment => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.title}</div>
                              <Badge className={getTypeColor(appointment.type)}>
                                {appointment.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.client}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(appointment.date, 'dd/MM/yyyy')}</div>
                              <div className="text-gray-500">{appointment.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500"
                                onClick={() => deleteAppointment(appointment.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* AI Learning Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Aprendizagem da IA</CardTitle>
                <CardDescription>
                  Configure regras de horário e preferências para agendamento automático
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Horário de Funcionamento</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input type="time" defaultValue="09:00" />
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Duração Padrão (minutos)</label>
                  <Input type="number" defaultValue="60" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Regras de Agendamento</label>
                  <Textarea 
                    placeholder="Ex: Não agendar reuniões nas sextas após 16h, sempre perguntar se prefere manhã ou tarde..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <Button className="w-full">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgendaPage;
