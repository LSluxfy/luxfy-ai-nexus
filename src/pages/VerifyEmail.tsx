import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const { t } = useTranslation();

  const verifySchema = z.object({
    email: z.string().email("Email inválido"),
    verificationCode: z.string().min(1, "Código de verificação é obrigatório"),
  });

  type VerifyFormValues = z.infer<typeof verifySchema>;

  const { verifyUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: email,
      verificationCode: "",
    },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    try {
      await verifyUser(data.email, data.verificationCode);
    } catch (error) {
      console.error("Verification error:", error);
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
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-800" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{t("confirmAccount.title")}</h2>
          <p className="mt-2 text-slate-600">{t("confirmAccount.description")}</p>
        </div>

        <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-800/5">
          <CardHeader>
            <CardTitle className="text-slate-900">{t("confirmAccount.confirmTitle")}</CardTitle>
            <CardDescription className="text-slate-600">
              {t("confirmAccount.instruction")} <br /> {email || "seu@email.com"}
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
                      <FormLabel className="text-slate-700">{t("confirmAccount.emailLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("confirmAccount.emailLabel")}
                          type="email"
                          {...field}
                          disabled
                          className="border-slate-300 focus:border-blue-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">{t("confirmAccount.codeLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("confirmAccount.codePlaceholder")}
                          {...field}
                          className="border-slate-300 focus:border-blue-800"
                        />
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
                  {isLoading ? t("confirmAccount.verifying") : t("confirmAccount.verifyButton")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-slate-600 mt-4">
              {t("confirmAccount.alreadyVerified")}&nbsp;
              <Link to="/login" className="text-blue-800 hover:underline font-medium">
                {t("confirmAccount.login")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
