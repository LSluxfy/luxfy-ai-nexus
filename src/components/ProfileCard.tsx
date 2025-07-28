
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ProfileCard = () => {
  const { user } = useAuth();
  const getInitials = () => {
    if (user?.name && user?.lastName) {
      return `${user.name[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg bg-blue-800/20 text-blue-800">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {user ? `${user.name} ${user.lastName}` : 'Usuário'}
          </CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome</h3>
            <p>{user?.name || 'Não informado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sobrenome</h3>
            <p>{user?.lastName || 'Não informado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p>{user?.email || 'Não informado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Plano</h3>
            <p className="font-medium">{user?.plan || 'BASICO'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Agentes Disponíveis</h3>
            <p>{user?.numberAgentes || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
