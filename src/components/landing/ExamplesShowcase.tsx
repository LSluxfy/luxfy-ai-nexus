import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function ExamplesShowcase() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4 bg-muted/20" id="examples">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">{t("examples.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">{t("examples.subtitle")}</p>

        <Tabs defaultValue="chat" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="chat">{t("examples.tabs.chat")}</TabsTrigger>
            <TabsTrigger value="campaigns">{t("examples.tabs.campaigns")}</TabsTrigger>
            <TabsTrigger value="crm">{t("examples.tabs.crm")}</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="bg-card border rounded-xl p-6">
              <p className="text-sm text-muted-foreground">{t("examples.chat.desc")}</p>
              <div className="mt-4 h-56 rounded-lg border bg-muted" aria-label="WhatsApp chat mock" />
            </div>
          </TabsContent>
          <TabsContent value="campaigns">
            <div className="bg-card border rounded-xl p-6">
              <p className="text-sm text-muted-foreground">{t("examples.campaigns.desc")}</p>
              <div className="mt-4 h-56 rounded-lg border bg-muted" aria-label="Campaigns mock" />
            </div>
          </TabsContent>
          <TabsContent value="crm">
            <div className="bg-card border rounded-xl p-6">
              <p className="text-sm text-muted-foreground">{t("examples.crm.desc")}</p>
              <div className="mt-4 h-56 rounded-lg border bg-muted" aria-label="CRM Kanban mock" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
