import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, X, Infinity, AlertTriangle, Pin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type FeatureItem = {
  text: string;
  icon: "check" | "infinity" | "warning" | "x" | "pin";
};

export default function PricingV2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  const planFeatures: Record<string, FeatureItem[]> = {
    start: [
      { text: t("pricingV2.features.ai"), icon: "check" },
      { text: t("pricingV2.features.crm"), icon: "check" },
      { text: t("pricingV2.features.aiTokensLimited"), icon: "warning" },
      { text: t("pricingV2.features.noPrioritySupport"), icon: "x" },
      { text: t("pricingV2.features.noFixedCosts"), icon: "x" },
    ],
    pro: [
      { text: t("pricingV2.features.aiTokensUnlimited"), icon: "infinity" },
      { text: t("pricingV2.features.crm"), icon: "check" },
      { text: t("pricingV2.features.calendar"), icon: "check" },
      { text: t("pricingV2.features.understandsImages"), icon: "check" },
      { text: t("pricingV2.features.understandsVoice"), icon: "check" },
      { text: t("pricingV2.features.support"), icon: "check" },
    ],
    teams: [
      { text: t("pricingV2.features.allFromPro"), icon: "check" },
      { text: t("pricingV2.features.aiTokensUnlimited"), icon: "infinity" },
      { text: t("pricingV2.features.officialWhatsApp"), icon: "check" },
      { text: t("pricingV2.features.advancedManagement"), icon: "check" },
      { text: t("pricingV2.features.support"), icon: "check" },
      { text: t("pricingV2.features.initialOptimization"), icon: "check" },
    ],
  };

  const iconMap = {
    check: <Check className="h-4 w-4 text-primary shrink-0" />,
    infinity: <Infinity className="h-4 w-4 text-green-500 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />,
    x: <X className="h-4 w-4 text-red-500 shrink-0" />,
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          {Object.entries(
            t("pricingV2.plans", { returnObjects: true })
          ).map(([key, plan]) => {
            const priceText = annual ? plan.annual : plan.monthly;
            const per = annual ? t("pricingV2.perYear") : t("pricingV2.perMonth");
            const isPro = key === "pro";
            const features = planFeatures[key] || [];

            return (
              <Card
                key={key}
                className={`relative overflow-hidden transition-transform ${
                  isPro
                    ? "border-primary ring-2 ring-primary shadow-[0_10px_40px_-10px_hsl(var(--ring)/0.4)] scale-105 md:scale-110 z-10"
                    : ""
                }`}
              >
                {isPro && (
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
                    <p className="text-xs text-green-600 mt-1">{plan.savingLabel}</p>
                  )}

                  <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                    <Pin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{plan.desc}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {plan.agents} {plan.agents > 1 ? t("pricingV2.features.agentsPlural") : t("pricingV2.features.agents")}
                    </li>

                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {iconMap[feature.icon]}
                        <span
                          className={
                            feature.icon === "x"
                              ? "text-muted-foreground"
                              : feature.icon === "warning"
                              ? "text-orange-600"
                              : ""
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" onClick={() => navigate("/register")}>
                    <Zap className="h-4 w-4 mr-2" />
                    {t("pricingV2.cta")}
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
