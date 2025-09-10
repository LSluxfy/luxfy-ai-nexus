import { useEffect } from 'react';

const CriticalResourceLoader = () => {
  useEffect(() => {
    // Prefetch next sections after initial load
    const prefetchResources = () => {
      // Prefetch pricing section images
      const prefetchImages = [
        '/src/assets/hero-chat-webp.webp',
      ];

      prefetchImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Prefetch next route chunks
      const prefetchRoutes = [
        '/dashboard',
        '/login'
      ];

      prefetchRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Use requestIdleCallback for non-critical prefetching
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchResources, { timeout: 2000 });
    } else {
      setTimeout(prefetchResources, 2000);
    }

    // Critical resource hints
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: '//hook.us1.make.com' },
        { rel: 'dns-prefetch', href: '//api.stripe.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ];

      hints.forEach(hint => {
        if (!document.querySelector(`link[href="${hint.href}"]`)) {
          const link = document.createElement('link');
          link.rel = hint.rel;
          link.href = hint.href;
          if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
          document.head.appendChild(link);
        }
      });
    };

    addResourceHints();
  }, []);

  return null;
};

export default CriticalResourceLoader;