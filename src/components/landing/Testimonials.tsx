import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";

const testimonialImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format"
];

export default function Testimonials() {
  const { t } = useTranslation();
  const items = [0, 1, 2];

  return (
    <section className="py-20 px-4 bg-slate-50/50" aria-label="Testimonials">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">{t("testimonials.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">{t("testimonials.subtitle")}</p>
        
        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {items.map((i) => (
                <CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-sm text-foreground mb-6 italic">
                      "{t(`testimonials.items.${i}.text`)}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonialImages[i]} 
                        alt={t(`testimonials.items.${i}.author`)}
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <p className="text-sm font-medium">{t(`testimonials.items.${i}.author`)}</p>
                        <p className="text-xs text-muted-foreground">{t(`testimonials.items.${i}.role`)}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
