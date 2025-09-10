import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
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

    // Load scripts after initial render
    const timer = setTimeout(() => {
      deferredScripts.forEach(loadDeferredScript);
    }, 2000);

    return () => clearTimeout(timer);
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