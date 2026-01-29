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

const Register = () => {
  const { t } = useTranslation();

  const registerSchema = z
    .object({
      firstName: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
      lastName: z
        .string()
        .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
        .max(100, "Sobrenome deve ter no máximo 100 caracteres"),
      email: z.string().email("Email inválido"),
      password: z
        .string()
        .min(6, "Senha deve ter pelo menos 6 caracteres")
        .max(100, "Senha deve ter no máximo 100 caracteres"),
      confirmPassword: z.string().min(6, "Confirmação de senha obrigatória"),
      plan: z.enum(["BASICO", "PRO", "PREMIUM"]).default("BASICO"),
      terms: z.boolean().refine((value) => value === true, {
        message: "Você deve aceitar os termos e condições",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      plan: "BASICO" as const,
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.firstName, data.lastName, data.plan);
    } catch (error) {
      console.error("Registration error:", error);
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
            <div className="h-12 w-12 rounded-xl flex items-center justify-center">
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
          <h2 className="text-3xl font-bold text-slate-900">{t("auth.register.title")}</h2>
          <p className="mt-2 text-slate-600">{t("auth.register.subtitle")}</p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>

        <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-800/5">
          <CardHeader>
            <CardTitle className="text-slate-900">{t("auth.register.cardTitle")}</CardTitle>
            <CardDescription className="text-slate-600">{t("auth.register.cardDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">{t("auth.register.firstName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("auth.register.firstNamePlaceholder")}
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">{t("auth.register.lastName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("auth.register.lastNamePlaceholder")}
                            {...field}
                            className="border-slate-300 focus:border-blue-800"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">{t("auth.register.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("auth.register.emailPlaceholder")}
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
                      <FormLabel className="text-slate-700">{t("auth.register.password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("auth.register.passwordPlaceholder")}
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">{t("auth.register.confirmPassword")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("auth.register.confirmPasswordPlaceholder")}
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
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-2" />
                      </FormControl>
                      <div className="leading-none mt-0 pt-0">
                        <FormLabel className="text-sm leading-none text-slate-700">
                          {t("auth.register.agreeToTerms")}&nbsp;
                          <Link to="/terms" target="_blank" className="text-blue-800 hover:underline">
                            {t("auth.register.termsOfService")}.
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.register.createAccountButtonLoading") : t("auth.register.createAccountButton")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-slate-600 mt-4">
              {t("auth.register.hasAccount")}&nbsp;
              <Link to="/login" className="text-blue-800 hover:underline font-medium">
                {t("auth.register.loginLink")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
