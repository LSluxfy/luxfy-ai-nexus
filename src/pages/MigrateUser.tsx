import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const MigrateUser = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const migrateSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'A senha é obrigatória'),
  });

  type MigrateFormValues = z.infer<typeof migrateSchema>;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MigrateFormValues>({
    resolver: zodResolver(migrateSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: MigrateFormValues) => {
    setIsLoading(true);
    
    try {
      const timestamp = new Date().toISOString();
      console.log(`🚀 [USER MIGRATION] ${timestamp} - Iniciando migração do usuário ${data.email}`);
      console.log(`📦 [MIGRATION DATA] ${timestamp}`, { email: data.email });

      // Configurar fetch com anti-cache
      const url = `https://api.luxfy.app/v1/user/migrate-user?_t=${Date.now()}&_r=${Math.random().toString(36).substring(7)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-None-Match': '',
          'If-Modified-Since': '',
        },
        cache: 'no-store',
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      console.log(`📡 [MIGRATION RESPONSE STATUS] ${timestamp} - Status: ${response.status}, OK: ${response.ok}`);

      // Verificar se a resposta é válida
      if (!response.ok) {
        let errorMessage = `Erro HTTP ${response.status}`;
        
        try {
          const responseData = await response.json();
          console.log(`📦 [MIGRATION ERROR DATA] ${timestamp}`, responseData);
          
          // Usar a mensagem específica do servidor
          errorMessage = responseData.error || responseData.message || errorMessage;
        } catch (parseError) {
          console.error(`❌ [MIGRATION PARSE ERROR] ${timestamp}`, parseError);
          const textResponse = await response.text();
          console.log(`📄 [MIGRATION RAW RESPONSE] ${timestamp}`, textResponse);
          errorMessage = textResponse || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log(`✅ [MIGRATION SUCCESS DATA] ${timestamp}`, responseData);

      if (response.status === 402) {
        console.log(`✅ [MIGRATION SUCCESS] ${timestamp} - Usuário migrado com sucesso`);
        
        const successMessage = responseData.message || "Usuário migrado com sucesso! Redirecionando para o login...";
        
        toast({
          title: "Sucesso",
          description: successMessage,
        });
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Caso o status não seja 402, mas a requisição foi bem-sucedida
        const errorMessage = responseData.error || responseData.message || `Status inesperado: ${response.status}`;
        throw new Error(errorMessage);
      }
      
    } catch (error: any) {
      const timestamp = new Date().toISOString();
      console.error(`❌ [MIGRATION CATCH ERROR] ${timestamp}`, error);
      console.error(`🔍 [MIGRATION ERROR DETAILS] ${timestamp}`, {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      let errorMessage = "Erro desconhecido";
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "Erro de conexão com o servidor. Verifique sua internet e tente novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <img src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png" alt="Luxfy Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">Luxfy</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900">Migrar Conta</h2>
          <p className="mt-2 text-slate-600">
            Migre sua conta existente para o novo sistema
          </p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>
        
        <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-800/5">
          <CardHeader>
            <CardTitle className="text-slate-900">Migração de Usuário</CardTitle>
            <CardDescription className="text-slate-600">
              Digite suas credenciais para migrar sua conta
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
                      <FormLabel className="text-slate-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite seu email" 
                          type="email" 
                          {...field} 
                          className="border-slate-300 focus:border-blue-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Digite sua senha"
                          {...field}
                          className="border-slate-300 focus:border-blue-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Migrando..." : "Migrar Conta"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                  >
                    Voltar ao Login
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MigrateUser;