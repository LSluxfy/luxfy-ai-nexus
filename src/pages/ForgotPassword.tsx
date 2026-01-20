import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const forgotSchema = z.object({
    email: z.string().email('Email inválido'),
  });

  type ForgotFormValues = z.infer<typeof forgotSchema>;

  const { requestPasswordReset } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-900/3 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-800 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <img src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png" alt="Luxfy Logo" className="w-7 h-7" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">Luxfy</span>
            </Link>
          </div>
          
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-800/5">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-slate-900">{t("forgotPassword.successTitle")}</CardTitle>
              <CardDescription className="text-slate-600">
                {t("forgotPassword.successMessage")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-900/3 rounded-full blur-3xl"></div>
        
        {/* Circuit grid */}
        <div className="absolute inset-0 opacity-3">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(30, 58, 138, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl overflow-hidden">
              <img
                src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png"
                alt="Luxfy Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">Luxfy</span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-800" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{t("forgotPassword.title")}</h2>
          <p className="mt-2 text-slate-600">
            {t("forgotPassword.subtitle")}
          </p>
        </div>
        
        <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-800/5">
          <CardHeader>
            <CardTitle className="text-slate-900">{t("forgotPassword.cardTitle")}</CardTitle>
            <CardDescription className="text-slate-600">
              {t("forgotPassword.cardSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">{t("forgotPassword.emailLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("forgotPassword.emailPlaceholder")} type="email" {...field} className="border-slate-300 focus:border-blue-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? t("forgotPassword.loading") : t("forgotPassword.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-slate-600 mt-4">
              {t("forgotPassword.backToLogin")}{' '}
              <Link to="/login" className="text-blue-800 hover:underline font-medium">
                {t("forgotPassword.backToLoginLink")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;