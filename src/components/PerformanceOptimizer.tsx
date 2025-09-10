import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimize critical rendering path
    const optimizeRendering = () => {
      // Remove unnecessary animations during initial load
      document.documentElement.style.setProperty('--animation-duration', '0s');
      
      // Re-enable animations after critical content loads
      const enableAnimations = () => {
        document.documentElement.style.removeProperty('--animation-duration');
      };
      
      // Use requestIdleCallback if available
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(enableAnimations, { timeout: 1000 });
      } else {
        setTimeout(enableAnimations, 1000);
      }
    };

    optimizeRendering();

    // Defer non-critical scripts
    const deferredScripts = [
      'https://player.pandavideo.com.br/api.v2.js'
    ];

    const loadDeferredScript = (src: string) => {
      // Only load if not already loaded
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };

    // Load scripts after user interaction or 3 seconds
    let scriptsLoaded = false;
    
    const loadScripts = () => {
      if (!scriptsLoaded) {
        scriptsLoaded = true;
        deferredScripts.forEach(loadDeferredScript);
      }
    };

    const handleInteraction = () => {
      loadScripts();
      ['click', 'scroll', 'touchstart'].forEach(event => {
        document.removeEventListener(event, handleInteraction, { passive: true } as any);
      });
    };

    // Load on interaction
    ['click', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true } as any);
    });

    // Fallback: load after 3 seconds
    const timer = setTimeout(loadScripts, 3000);

    return () => {
      clearTimeout(timer);
      ['click', 'scroll', 'touchstart'].forEach(event => {
        document.removeEventListener(event, handleInteraction, { passive: true } as any);
      });
    };
  }, []);

  useEffect(() => {
    // Optimize images with Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));

      return () => imageObserver.disconnect();
    }
  }, []);

  return null;
};

export default PerformanceOptimizer;