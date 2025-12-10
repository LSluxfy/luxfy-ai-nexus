import React, { useEffect, useState } from "react";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowUpRight, Calendar, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceList } from "@/components/financial/InvoiceList";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

async function cancelSubscription() {
  const token = localStorage.getItem("jwt-token");
  const response = await api.post(
    "v1/user/cancel-subscription",
    {},
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
  return response;
}

const FinanceiroPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const currentPlan = {
    name:
      user?.plan === "BASICO"
        ? t("financial.plans.basic")
        : user?.plan === "PRO"
          ? t("financial.plans.pro")
          : t("financial.plans.premium"),
    price: user?.plan === "BASICO" ? "$ 22" : user?.plan === "PRO" ? "$ 43" : "$ 79",
    period: "mensal",
    features:
      user?.plan === "BASICO"
        ? [
            "1 Agente",
            "CRM avanzado",
            "IA gratis incluida",
            "Respuestas ilimitadas",
            "Agenda con sincronización",
            "Campañas de WhatsApp",
            "Soporte prioritario",
          ]
        : user?.plan === "PRO"
          ? [
              "3 Agentes",
              "CRM avanzado",
              "IA gratis incluida",
              "Respuestas ilimitadas",
              "Agenda con sincronización",
              "Campañas de WhatsApp",
              "Soporte prioritario",
            ]
          : [
              "6 Agentes",
              "CRM avanzado",
              "IA gratis incluida",
              "Respuestas ilimitadas",
              "Agenda con sincronización",
              "Campañas de WhatsApp",
              "Soporte prioritario",
            ],
  };

  const [availablePlans] = useState([
    {
      name: t("financial.plans.basic"),
      price: "$22",
      period: "/mês",
      current: user?.plan === "BASICO",
      features: [
        "1 Agente",
        "CRM avanzado",
        "IA gratis incluida",
        "Respuestas ilimitadas",
        "Agenda con sincronización",
        "Campañas de WhatsApp",
        "Soporte prioritario",
      ],
    },
    {
      name: t("financial.plans.pro"),
      price: "$43",
      period: "/mês",
      current: user?.plan === "PRO",
      popular: true,
      features: [
        "3 Agentes",
        "CRM avanzado",
        "IA gratis incluida",
        "Respuestas ilimitadas",
        "Agenda con sincronización",
        "Campañas de WhatsApp",
        "Soporte prioritario",
      ],
    },
    {
      name: t("financial.plans.premium"),
      price: "$79",
      period: "/mês",
      current: user?.plan === "PREMIUM",
      features: [
        "6 Agentes",
        "CRM avanzado",
        "IA gratis incluida",
        "Respuestas ilimitadas",
        "Agenda con sincronización",
        "Campañas de WhatsApp",
        "Soporte prioritario",
      ],
    },
  ]);


  let newPlan
  function namePlan(namePlano) {
    switch (namePlano) {
      case 'Premium':
        newPlan = 'teams'
        break;
      case 'Pro':
        newPlan = 'pro'
        break;
      default:
        newPlan = 'start'
        break;
    }
    return newPlan
  }

 async function updateCheckoutUrlStripe(plano, annual) {
    const token = localStorage.getItem("jwt-token");
  
    const response = await api.post(
      "v1/user/update-subscription",
      { planValue: plano, isAnnual: annual },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  
    return response.data.checkoutUrl;
  }

  async function collectBilling() {
  const token = localStorage.getItem("jwt-token");

  const response = await api.get("v1/invoices/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


  const [billing, setBilling] = useState([]);
  const [activeTab, setActiveTab] = useState("plan");

   useEffect(() => {
    async function loadInvoices() {
      try {
        const raw = await collectBilling();
        const invoices = raw.flat();
        setBilling(invoices);
      } catch (err) {
        console.error("Erro ao buscar faturas:", err);
      }
    }

    loadInvoices();
  }, []);

  const handleWhatsAppContact = () => {
    const phoneNumber = "+5511967136762";
    const message = encodeURIComponent(t('whatsapp.message'));
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{t("financial.subtitle")}</h2>
          <p className="text-gray-600">{t("financial.description")}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="plan">{t("financial.tabs.currentPlan")}</TabsTrigger>
            <TabsTrigger value="upgrade">{t("financial.tabs.upgrade")}</TabsTrigger>
            <TabsTrigger value="invoices">{t("financial.tabs.invoices")}</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t("financial.currentPlan.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{user.plan}</h3>
                        <p className="text-gray-600">{t("financial.currentPlan.autoRenewal")}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-luxfy-purple">{currentPlan.price}</div>
                        <div className="text-sm text-gray-500">{t("financial.currentPlan.perMonth")}</div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">{t("financial.currentPlan.includedFeatures")}</h4>
                      <ul className="space-y-1">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            {t("financial.currentPlan.cancelPlan")}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("financial.currentPlan.cancelPlan")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("financial.plans.confirmCancelUpgrade")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("financial.plans.cancelUpgrade")}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={handleWhatsAppContact}>
                              {t("financial.plans.confirmCancel")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                          onClick={() => setActiveTab("upgrade")}>
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                          {t("financial.currentPlan.makeUpgrade")}
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t("financial.nextBilling.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500">
                        {billing.length === 0 && (<p>{t("financial.nextBilling.noPending")}</p>)}
                        {billing.map((inv, index) => (
                          <div key={index}
                            className="p-4 border rounded-lg shadow-sm bg-gray-50">
                            <p><strong>{t("financial.nextBilling.description")}</strong> {inv.description}</p>
                            <p><strong>{t("financial.nextBilling.status")}</strong> {inv.status}</p>
                            <p>
                              <strong>{t("financial.nextBilling.amount")}</strong> {inv.amount_formatted}
                              {inv.currency.toUpperCase()}
                            </p>
                            <p><strong>{t("financial.nextBilling.startBilling")}</strong> {inv.start_date}</p>
                            <p><strong>{t("financial.nextBilling.endBilling")}</strong> {inv.end_date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upgrade" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.current ? "border-luxfy-purple" : ""} ${plan.popular ? "border-2 border-yellow-400" : ""}`}
                >
                  {plan.current !== plan.popular && plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900">
                      {t("financial.plans.mostPopular")}
                    </Badge>
                  )}
                  {plan.current && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-luxfy-purple">
                      {t("financial.tabs.currentPlan")}
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-500">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className={`w-full ${plan.current ? 'bg-gray-400' : 'bg-luxfy-purple hover:bg-luxfy-darkPurple'}`}
                          disabled={plan.current}
                        >
                          {plan.current ? t("financial.currentPlan.title") : t("financial.currentPlan.makeUpgrade")}
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("financial.plans.confirmUpgrade")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("financial.plans.firstConfirmUpgrade")} <strong>{plan.name}</strong>?<br/>
                            {t("financial.plans.lastConfirmUpgrade")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("financial.plans.cancelUpgrade")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              const url = await updateCheckoutUrlStripe(namePlan(plan.name), false);
                              window.location.href = url;
                            }}
                          >
                            {t("financial.plans.confirmUpgrade")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FinanceiroPage;
