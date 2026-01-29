import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, X, Infinity, AlertTriangle, Pin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";

async function checkoutUrlStripe(plano, annual) {
  const token = localStorage.getItem("jwt-token");

  const response = await api.post(
    "v1/user/create-checkout-session",
    { planValue: plano, isAnnual: annual },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.checkoutUrl;
}

export default function PricingV2() {
  const { t } = useTranslation();
  const [annual, setAnnual] = useState(false);

  const getStartFeatures = () => [
    { text: t("pricingV2.features.crm"), included: true },
    { text: t("pricingV2.features.ai"), included: true },
    { text: t("pricingV2.features.aiTokensLimited"), included: false, isWarning: true },
    { text: t("pricingV2.features.noPrioritySupport"), included: false },
    { text: t("pricingV2.features.noFixedCosts"), included: false },
    { text: t("pricingV2.features.idealForStart"), included: true, isNote: true },
  ];

  const getProTeamsFeatures = () => [
    t("pricingV2.features.crm"),
    t("pricingV2.features.ai"),
    t("pricingV2.features.aiTokensUnlimited"),
    t("pricingV2.features.unlimited"),
    t("pricingV2.features.calendar"),
    t("pricingV2.features.campaigns"),
    t("pricingV2.features.support"),
  ];

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
          {Object.entries(
            t("pricingV2.plans", { returnObjects: true })
          ).map(([key, plan]) => {
            const priceText = annual ? plan.annual : plan.monthly;
            const per = annual ? t("pricingV2.perYear") : t("pricingV2.perMonth");

            return (
              <Card
                key={key}
                className={`relative overflow-hidden ${
                  plan.highlight ? "border-primary shadow-[0_10px_30px_-10px_hsl(var(--ring)/0.3)]" : ""
                }`}
              >
                {plan.highlight && (
                  <Badge className="w-max absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 pb-2 pt-3 text-sm font-bold shadow-lg animate-pulse">
                    ⭐ {t("pricingV2.bestSeller")} ⭐
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>

                  <div className="mt-2">
                    <span className="text-4xl font-bold">{priceText}</span>
                    <span className="text-sm text-muted-foreground ml-1">{per}</span>
                  </div>
                  {annual && plan.savingLabel && (
                      <p className="text-xs text-green-600 mt-1">
                        {plan.savingLabel}
                      </p>
                    )}

                  <p className="text-muted-foreground text-sm mt-2">{plan.desc}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {plan.agents} {t("pricingV2.features.agents")}
                    </li>

                    {key === "start" ? (
                      <>
                        {getStartFeatures().map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {feature.isWarning ? (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            ) : feature.isNote ? (
                              <Pin className="h-4 w-4 text-blue-500" />
                            ) : feature.included ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span className={feature.included ? "" : feature.isWarning ? "text-orange-600" : "text-muted-foreground"}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </>
                    ) : (
                      <>
                        {getProTeamsFeatures().map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {f === t("pricingV2.features.aiTokensUnlimited") ? (
                              <Infinity className="h-4 w-4 text-green-500" />
                            ) : (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            {f}
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  <Button asChild className="w-full">
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        const url = await checkoutUrlStripe(key, annual);
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
