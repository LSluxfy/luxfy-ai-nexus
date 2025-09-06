
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

const SecuritySettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erro",
        description: t("settings.security.changePassword.passwordsDoNotMatch"),
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: t("settings.security.changePassword.passwordTooShort"),
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.put('/v1/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      toast({
        title: t("settings.security.changePassword.passwordChanged"),
        description: t("settings.security.changePassword.passwordChanged"),
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: t("settings.security.changePassword.passwordChangeError"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("settings.security.changePassword.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.changePassword.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">{t("settings.security.changePassword.currentPassword")}</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder={t("settings.security.changePassword.currentPasswordPlaceholder")}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">{t("settings.security.changePassword.newPassword")}</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder={t("settings.security.changePassword.newPasswordPlaceholder")}
                minLength={6}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("settings.security.changePassword.confirmPassword")}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder={t("settings.security.changePassword.confirmPasswordPlaceholder")}
                minLength={6}
                required
              />
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? t("settings.security.changePassword.changingButton") : t("settings.security.changePassword.changeButton")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.security.securitySettings.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.securitySettings.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <h4 className="font-medium">{t("settings.security.securitySettings.twoFactor")}</h4>
              <p className="text-sm text-gray-600">{t("settings.security.securitySettings.twoFactorDesc")}</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              {t("settings.security.securitySettings.comingSoon")}
            </Button>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <h4 className="font-medium">{t("settings.security.securitySettings.activeSessions")}</h4>
              <p className="text-sm text-gray-600">{t("settings.security.securitySettings.activeSessionsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {t("settings.security.securitySettings.viewSessions")}
            </Button>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <h4 className="font-medium">{t("settings.security.securitySettings.activityLogs")}</h4>
              <p className="text-sm text-gray-600">{t("settings.security.securitySettings.activityLogsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {t("settings.security.securitySettings.viewLogs")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {t("settings.security.dangerZone.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.dangerZone.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">{t("settings.security.dangerZone.deleteAccount")}</h4>
              <p className="text-sm text-red-700 mb-4">
                {t("settings.security.dangerZone.deleteAccountDesc")}
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    {t("settings.security.dangerZone.deleteAccountButton")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("settings.security.dangerZone.confirmTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("settings.security.dangerZone.confirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("settings.security.dangerZone.cancel")}</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      {t("settings.security.dangerZone.confirmDelete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
