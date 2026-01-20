import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const Login = () => {
  const { t } = useTranslation();

  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    remember: z.boolean().optional(),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-900/3 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-3">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(30, 58, 138, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
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
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              Luxfy
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900">{t("auth.login.title")}</h2>
          <p className="mt-2 text-slate-600">{t("auth.login.subtitle")}</p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>

        <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-800/5">
          <CardHeader>
            <CardTitle className="text-slate-900">{t("auth.login.cardTitle")}</CardTitle>
            <CardDescription className="text-slate-600">{t("auth.login.cardDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">{t("auth.login.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("auth.login.emailPlaceholder")}
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-slate-700">{t("auth.login.password")}</FormLabel>
                        <Link to="/forgot-password" className="text-sm text-blue-800 hover:underline">
                          {t("auth.login.forgotPassword")}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("auth.login.passwordPlaceholder")}
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
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-2" />
                      </FormControl>
                      <FormLabel className="text-sm font-medium leading-none cursor-pointer text-slate-700">
                        {t("auth.login.rememberMe")}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.login.loginButtonLoading") : t("auth.login.loginButton")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => (window.location.href = "/migrate-user")}
                  disabled={isLoading}
                >
                  Migrar conta
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-slate-600">
              {t("auth.login.noAccount")} 
              <Link to="/register" className="text-blue-800 hover:underline font-medium">
                {t("auth.login.registerLink")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
