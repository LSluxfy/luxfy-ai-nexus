import React, { Suspense, lazy } from 'react';
import { useInView } from '@/hooks/useInView';

// Lazy load the heavy component
const LazyAnimatedChatMockup = lazy(() => import('./LazyAnimatedChatMockup'));

interface UltraLightSkeletonProps {
  showReal?: boolean;
}

const UltraLightSkeleton: React.FC<UltraLightSkeletonProps> = ({ showReal = false }) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1, once: true });

  return (
    <div ref={ref} className="flex justify-center md:justify-end">
      {showReal && inView ? (
        <Suspense fallback={<SkeletonFallback />}>
          <LazyAnimatedChatMockup />
        </Suspense>
      ) : (
        <SkeletonFallback />
      )}
    </div>
  );
};

const SkeletonFallback = () => (
  <div className="hero-skeleton">
    <svg 
      className="w-12 h-12 text-slate-600" 
      fill="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  </div>
);

export default UltraLightSkeleton;