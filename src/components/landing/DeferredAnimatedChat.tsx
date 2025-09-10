import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';

// Ultra-deferred loading - only after user interaction or 3s timeout
const AnimatedChatMockup = lazy(() => import('./AnimatedChatMockup'));

const DeferredAnimatedChat = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let interactionHandler: () => void;

    const startLoading = () => {
      setShouldLoad(true);
      cleanup();
    };

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (interactionHandler) {
        ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
          window.removeEventListener(event as keyof WindowEventMap, interactionHandler);
        });
      }
    };

    // Load after user interaction OR 3 seconds (whichever comes first)
    interactionHandler = startLoading;
    ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
      window.addEventListener(event as keyof WindowEventMap, interactionHandler, { once: true });
    });

    // Fallback timeout - ultra-deferred
    timeoutId = setTimeout(startLoading, 3000);

    return cleanup;
  }, []);

  return (
    <div ref={ref} className="flex justify-center md:justify-end">
      {shouldLoad && inView ? (
        <Suspense fallback={
          <div className="hero-skeleton">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <AnimatedChatMockup />
        </Suspense>
      ) : (
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
      )}
    </div>
  );
};

export default DeferredAnimatedChat;