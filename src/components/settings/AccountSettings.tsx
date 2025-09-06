
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("settings.account.profileEditMessage.title"),
      description: t("settings.account.profileEditMessage.description"),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("settings.account.personalInfo.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.account.personalInfo.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("settings.account.personalInfo.name")}</Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("settings.account.personalInfo.lastName")}</Label>
                <Input
                  id="lastName"
                  value={user?.lastName || ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("settings.account.personalInfo.email")}</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <p className="text-sm text-gray-500">
                {t("settings.account.personalInfo.emailNote")}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {t("settings.account.personalInfo.editingNote")}
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("settings.account.accountInfo.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{t("settings.account.accountInfo.email")}</span>
              <span className="text-gray-600">
                {user?.email || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{t("settings.account.accountInfo.userId")}</span>
              <span className="text-gray-600 font-mono text-sm">
                {user?.id || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{t("settings.account.accountInfo.plan")}</span>
              <span className="text-blue-600 font-medium">{user?.plan || 'BASICO'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{t("settings.account.accountInfo.agentsNumber")}</span>
              <span className="text-gray-600">{user?.numberAgentes || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">{t("settings.account.accountInfo.creationDate")}</span>
              <span className="text-gray-600">
                {user?.createAt ? new Date(user.createAt).toLocaleDateString('pt-BR') : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
