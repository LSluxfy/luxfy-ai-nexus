import React from "react";
import { useInView } from "@/hooks/useInView";

const bubbleBase = "max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm";

export default function HeroWhatsAppMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "-10% 0px", once: true });

  return (
    <div
      ref={ref}
      aria-label="iPhone WhatsApp AI conversation mockup"
      className={`mx-auto md:mx-0 w-[280px] sm:w-[320px] rounded-[2.5rem] border border-border bg-card/90 backdrop-blur p-3 relative shadow-xl animate-${inView ? "enter" : "none"}`}
    >
      {/* Notch */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-0.5 h-6 w-32 bg-muted rounded-b-2xl" />

      {/* Screen */}
      <div className="mt-4 rounded-[1.8rem] bg-background border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
          <div className="h-8 w-8 rounded-full bg-accent" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">WhatsApp • 24/7</p>
            <p className="text-sm font-medium">IA Luxfy</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
        </div>

        {/* Chat */}
        <div className="p-3 space-y-2 bg-[hsl(var(--muted))]">
          {/* Incoming */}
          <div className={`${bubbleBase} bg-card text-foreground`}>Hola 👋 ¿Puedo ayudarte con horarios y precios?</div>
          {/* Outgoing */}
          <div className="flex justify-end">
            <div className={`${bubbleBase} bg-primary text-primary-foreground`}>Sí, quiero agendar una demo para mañana.</div>
          </div>
          {/* Incoming */}
          <div className={`${bubbleBase} bg-card text-foreground`}>Perfecto, te propongo 10:30 o 15:00. Confirmo por aquí ✅</div>
          {/* Typing */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            IA escribiendo
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-pulse"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:120ms]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:240ms]"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
