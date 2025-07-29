
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, children }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
      <div className="flex-1 flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        {children}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar..."
            className="pl-10 w-[200px]"
          />
        </div>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-auto">
              <DropdownMenuItem className="cursor-pointer py-3">
                <div>
                  <p className="font-medium">Nova mensagem</p>
                  <p className="text-sm text-gray-500">Você tem uma nova mensagem do cliente Carlos</p>
                  <p className="text-xs text-gray-400 mt-1">há 5 minutos</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div>
                  <p className="font-medium">Reunião agendada</p>
                  <p className="text-sm text-gray-500">Consulta com Maria às 15h</p>
                  <p className="text-xs text-gray-400 mt-1">há 30 minutos</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div>
                  <p className="font-medium">Campanha finalizada</p>
                  <p className="text-sm text-gray-500">A campanha "Promoção de Julho" foi concluída</p>
                  <p className="text-xs text-gray-400 mt-1">há 2 horas</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-luxfy-purple font-medium">
              Ver todas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Configurações</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Plano (Pro)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
