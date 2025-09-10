import React, { Suspense, lazy } from 'react';
import { useInView } from '@/hooks/useInView';

const BeforeAfter = lazy(() => import('./BeforeAfter'));

const LazyBeforeAfter = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={
          <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-16">
                <div className="h-8 bg-slate-200 rounded w-80 mx-auto animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-96 mx-auto animate-pulse"></div>
              </div>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="h-6 bg-red-100 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 bg-green-100 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }>
          <BeforeAfter />
        </Suspense>
      ) : (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="h-8 bg-slate-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LazyBeforeAfter;