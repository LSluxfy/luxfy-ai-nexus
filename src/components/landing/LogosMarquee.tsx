import React from "react";
import { useInView } from "@/hooks/useInView";

const placeholders = ["FintechX", "EduPro", "HealthCare+", "RetailHub", "AutoMax", "RealtyOne"];

export default function LogosMarquee() {
  const { ref, inView } = useInView({ rootMargin: "-10% 0px", once: true });
  return (
    <section className="py-10 px-4" aria-label="Client logos">
      <div ref={ref} className={`container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center animate-${inView ? "fade-in" : "none"}`}>
        {placeholders.map((name) => (
          <div
            key={name}
            className="h-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground hover:scale-105 transition-transform"
            aria-label={`Logo ${name}`}
          >
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}
