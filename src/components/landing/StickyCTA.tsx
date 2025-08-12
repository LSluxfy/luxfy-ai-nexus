import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function StickyCTA() {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden z-40">
      <div className="mx-3 mb-3 rounded-xl border bg-card/95 backdrop-blur p-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{t("stickyCta.title")}</p>
            <p className="text-xs text-muted-foreground">{t("stickyCta.subtitle")}</p>
          </div>
          <Button asChild>
            <Link to="/register" aria-label={t("pricingV2.ctaAria")}>{t("hero.startFree")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
