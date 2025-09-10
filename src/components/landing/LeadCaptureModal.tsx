import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

const leadSchema = z.object({
  name: z.string().min(2, 'leadCapture.validation.nameMinLength'),
  email: z.string().min(1, 'leadCapture.validation.emailRequired').email('leadCapture.validation.emailInvalid'),
  phone: z.string().min(1, 'leadCapture.validation.phoneRequired').regex(phoneRegex, 'leadCapture.validation.phoneInvalid'),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      await axios.post('https://hook.us1.make.com/9ufs3zh57vkqo089lj0kev26p9ubcft8', {
        name: data.name,
        email: data.email,
        phone: data.phone,
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsSuccess(true);
      
      toast({
        title: t('leadCapture.success.title'),
        description: t('leadCapture.success.description'),
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setIsSuccess(false);
        form.reset();
      }, 2000);

    } catch (error) {
      console.error('Error submitting lead:', error);
      
      toast({
        title: t('leadCapture.error.title'),
        description: t('leadCapture.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      setIsSuccess(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('leadCapture.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
            {t('leadCapture.description')}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t('leadCapture.success.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center">
              {t('leadCapture.success.message')}
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-white">
                      {t('leadCapture.fields.name')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          placeholder={t('leadCapture.placeholders.name')}
                          className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-white">
                      {t('leadCapture.fields.email')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder={t('leadCapture.placeholders.email')}
                          className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-white">
                      {t('leadCapture.fields.phone')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          type="tel"
                          placeholder={t('leadCapture.placeholders.phone')}
                          className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('leadCapture.submitting')}
                    </>
                  ) : (
                    t('leadCapture.submit')
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {t('leadCapture.cancel')}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;