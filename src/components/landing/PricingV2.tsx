import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, X, Infinity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface PlanDef {
  key: "start" | "pro" | "teams";
  monthly: number;
  annual: number; // total annual billed
  agents: number;
  highlight?: boolean;
  checkoutUrl: string;
}

const PLANS: PlanDef[] = [
  { key: "start", monthly: 22, annual: 184, agents: 1, checkoutUrl: "" },
  {
    key: "pro",
    monthly: 43,
    annual: 361.2,
    agents: 3,
    highlight: true,
    checkoutUrl: "",
  },
  {
    key: "teams",
    monthly: 79,
    annual: 663.6,
    agents: 6,
    checkoutUrl: "",
  },
];

async function checkoutUrlStripe(plano) {
  const token = localStorage.getItem("jwt-token");

  const response = await api.post(
    "v1/user/create-checkout-session",
    { planValue: plano },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.checkoutUrl;
}

export default function PricingV2() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [annual, setAnnual] = useState(false);

  const currency = useMemo(() => {
    // Keep dollar symbol as in brief
    return "$";
  }, [i18n.language]);

  const getFeatures = (planKey: string) => {
    const baseFeatures = [
      t("pricingV2.features.crm"),
      t("pricingV2.features.ai"),
      t("pricingV2.features.unlimited"),
      t("pricingV2.features.calendar"),
      t("pricingV2.features.campaigns"),
    ];

    if (planKey === "start") {
      return baseFeatures; // Start plan without support
    }

    return [...baseFeatures, t("pricingV2.features.support")];
  };

  return (
    <section id="pricing" className="relative py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/40 border border-accent px-4 py-1.5 rounded-full text-sm">
            <span>{t("pricingV2.badgeDiscount")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">{t("pricingV2.title")}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t("pricingV2.subtitle")}</p>

          <div className="mt-6 inline-flex items-center rounded-full border border-border bg-card p-1">
            <Button
              variant={annual ? "ghost" : "secondary"}
              size="sm"
              className="rounded-full"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
            >
              {t("pricingV2.toggle.monthly")}
            </Button>
            <Button
              variant={annual ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
            >
              {t("pricingV2.toggle.annual")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            const per = annual ? t("pricingV2.perYear") : t("pricingV2.perMonth");
            const monthlyEquiv = annual ? plan.annual / 12 : plan.monthly;
            const savings = Math.max(0, plan.monthly * 12 - plan.annual);

            return (
              <Card
                key={plan.key}
                className={`relative overflow-hidden ${plan.highlight ? "border-primary shadow-[0_10px_30px_-10px_hsl(var(--ring)/0.3)]" : ""}`}
              >
                {plan.highlight && (
                  <Badge className="w-max absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 pb-2 pt-3 text-sm font-bold shadow-lg animate-pulse">
                    ⭐ {t("pricingV2.bestSeller")} ⭐
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{t(`pricingV2.plans.${plan.key}.name`)}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">
                      {currency}
                      {price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">{per}</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-green-600 mt-1">
                      {t("pricingV2.savings", { amount: `${currency}${savings.toFixed(2)}` })}
                      <span className="ml-2 text-muted-foreground">
                        ({t("pricingV2.equivalentPerMonth", { amount: `${currency}${monthlyEquiv.toFixed(2)}` })})
                      </span>
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm mt-2">{t(`pricingV2.plans.${plan.key}.desc`)}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {plan.agents} {t("pricingV2.features.agents")}
                    </li>
                    {plan.key === "start" ? (
                      <li className="flex items-center gap-2">
                        <X className="h-4 w-4 text-orange-500" />
                        {t("pricingV2.features.aiTokensLimited")}
                      </li>
                    ) : (
                      <li className="flex items-center gap-2">
                        <Infinity className="h-4 w-4 text-green-500" />
                        {t("pricingV2.features.aiTokensUnlimited")}
                      </li>
                    )}
                    {getFeatures(plan.key).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <a
                    href="#"
                    target="_blank"
                    onClick={async (e) => {
                      e.preventDefault();
                      const url = await checkoutUrlStripe(plan.key);
                      window.location.href = url;
                    }}
                  >
                   <Zap className="h-4 w-4 mr-2" />
                      {t("pricingV2.cta")}
                  </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
