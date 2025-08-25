import React from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const { t } = useTranslation();
  const items = [
    { q: t("faq.q1.q"), a: t("faq.q1.a") },
    { q: t("faq.q2.q"), a: t("faq.q2.a") },
    { q: t("faq.q3.q"), a: t("faq.q3.a") },
    { q: t("faq.q4.q"), a: t("faq.q4.a") },
    { q: t("faq.q5.q"), a: t("faq.q5.a") },
  ];
  return (
    <section id="faq" className="py-20 px-4 bg-gradient-to-br from-blue-50/50 to-slate-100/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 rounded-full px-6 py-2 mb-6">
            <span className="text-blue-800 font-medium">Perguntas Frequentes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t("faq.title")}</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t("faq.subtitle")}</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg shadow-blue-500/5 overflow-hidden">
          <Accordion type="single" collapsible className="p-2">
            {items.map((it, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="border-b border-blue-100/50 last:border-b-0 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left py-6 px-4 text-slate-900 font-semibold hover:text-blue-800 transition-colors">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-6 text-slate-600 leading-relaxed">
                  {it.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
