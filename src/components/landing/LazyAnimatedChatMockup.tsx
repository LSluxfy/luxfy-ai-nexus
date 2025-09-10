import React, { Suspense, lazy } from 'react';
import { useInView } from '@/hooks/useInView';

// Lazy load o componente pesado apenas quando necessário
const AnimatedChatMockup = lazy(() => import('./AnimatedChatMockup'));

const LazyAnimatedChatMockup = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div ref={ref} className="flex justify-center md:justify-end">
      {inView ? (
        <Suspense fallback={
          <div className="w-[300px] h-[500px] bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <AnimatedChatMockup />
        </Suspense>
      ) : (
        <div className="w-[300px] h-[500px] bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
          <div className="text-slate-400 text-sm">Chat AI</div>
        </div>
      )}
    </div>
  );
};

export default LazyAnimatedChatMockup;