
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProfileCard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
            <h3 className="text-sm font-medium text-gray-500">{t('profileCard.name')}</h3>
            <p>{user?.name || 'Não informado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('profileCard.lastName')}</h3>
            <p>{user?.lastName || 'Não informado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p>{user?.email || 'Não informado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('profileCard.plan')}</h3>
            <p className="font-medium">{user?.plan || 'BASICO'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('profileCard.agentsAvalible')}</h3>
            <p>{user?.numberAgentes || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
