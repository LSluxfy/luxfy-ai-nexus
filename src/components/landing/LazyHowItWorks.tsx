import React, { Suspense, lazy } from 'react';
import { useInView } from '@/hooks/useInView';

const HowItWorks = lazy(() => import('./HowItWorks'));

const LazyHowItWorks = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-16">
                <div className="h-8 bg-slate-200 rounded w-72 mx-auto animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-96 mx-auto animate-pulse"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }>
          <HowItWorks />
        </Suspense>
      ) : (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="h-8 bg-slate-200 rounded w-72 mx-auto"></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LazyHowItWorks;