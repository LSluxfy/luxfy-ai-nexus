
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiAppointment } from "@/types/appointment";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DeleteAppointmentDialogProps {
  appointment: ApiAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteAppointmentDialog({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: DeleteAppointmentDialogProps) {
  if (!appointment) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.</p>
            
            <div className="p-3 bg-muted rounded-lg mt-3">
              <p className="font-medium">{appointment.title}</p>
              <p className="text-sm text-muted-foreground">
                Cliente: {appointment.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                Data: {format(new Date(appointment.dateTime), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                Local: {appointment.local}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
