import { useEffect } from 'react';

const OptimizedFacebookPixel = () => {
  useEffect(() => {
    const loadFacebookPixel = () => {
      // Check if already loaded
      if ((window as any).fbq) {
        return;
      }

      // Load Facebook Pixel after delay to not block critical rendering
      const loadPixel = () => {
        (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        (window as any).fbq('init', '2373170249763986');
        (window as any).fbq('track', 'PageView');
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadPixel, { timeout: 3000 });
      } else {
        setTimeout(loadPixel, 3000);
      }
    };

    // Only load if user has interacted or after 5 seconds
    let hasInteracted = false;
    
    const handleInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        loadFacebookPixel();
        // Remove listeners after first interaction
        ['mousedown', 'touchstart', 'scroll'].forEach(event => {
          document.removeEventListener(event, handleInteraction, { passive: true } as any);
        });
      }
    };

    // Add interaction listeners
    ['mousedown', 'touchstart', 'scroll'].forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true } as any);
    });

    // Fallback: load after 5 seconds regardless
    const fallbackTimer = setTimeout(() => {
      if (!hasInteracted) {
        loadFacebookPixel();
      }
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
      ['mousedown', 'touchstart', 'scroll'].forEach(event => {
        document.removeEventListener(event, handleInteraction, { passive: true } as any);
      });
    };
  }, []);

  return null;
};

export default OptimizedFacebookPixel;