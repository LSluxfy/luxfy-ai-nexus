import React from "react";
import { useTranslation } from "react-i18next";

const items = [0,1,2];

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4" aria-label="Testimonials">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">{t("testimonials.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">{t("testimonials.subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((i) => (
            <div key={i} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-foreground">{t(`testimonials.items.${i}.text`)}</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-10 w-10 rounded-full bg-muted" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{t(`testimonials.items.${i}.author`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`testimonials.items.${i}.role`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
