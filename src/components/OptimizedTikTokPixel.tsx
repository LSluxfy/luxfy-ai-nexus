import { useEffect } from 'react';

const OptimizedTikTokPixel = () => {
  useEffect(() => {
    const loadTikTokPixel = () => {
      // Check if TikTok pixel is already loaded
      if (typeof window !== 'undefined' && window.ttq) {
        console.log('[TikTok Pixel] Already loaded');
        return;
      }

      try {
        // TikTok Pixel implementation
        (function (w: any, d: any, t: any) {
          w.TiktokAnalyticsObject = t;
          var ttq = w[t] = w[t] || [];
          ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
          ttq.setAndDefer = function(t: any, e: any) {
            t[e] = function() {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
            }
          };
          for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
          ttq.instance = function(t: any) {
            for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
            return e
          };
          ttq.load = function(e: any, n: any) {
            var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner;
            ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
            n = document.createElement("script");
            n.type = "text/javascript", n.async = !0, n.src = r + "?sdkid=" + e + "&lib=" + t;
            e = document.getElementsByTagName("script")[0];
            e.parentNode.insertBefore(n, e)
          };

          // Load the pixel with your ID
          ttq.load('D34MR73C77U2RJTP8EB0');
          ttq.page();

          console.log('[TikTok Pixel] Loaded successfully');
        })(window, document, 'ttq');

      } catch (error) {
        console.error('[TikTok Pixel] Error loading:', error);
      }
    };

    const loadPixelOptimized = () => {
      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadTikTokPixel, { timeout: 2000 });
      } else {
        setTimeout(loadTikTokPixel, 1000);
      }
    };

    // Load pixel on user interaction or after timeout
    const events = ['mousedown', 'touchstart', 'scroll'];
    let timeoutId: NodeJS.Timeout;
    let loaded = false;

    const handleUserInteraction = () => {
      if (!loaded) {
        loaded = true;
        loadPixelOptimized();
        
        // Remove event listeners after loading
        events.forEach(event => {
          document.removeEventListener(event, handleUserInteraction);
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        console.log('[TikTok Pixel] Loading triggered by user interaction');
      }
    };

    // Add event listeners for user interaction
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Fallback: load after 5 seconds if no interaction
    timeoutId = setTimeout(() => {
      if (!loaded) {
        loaded = true;
        loadPixelOptimized();
        console.log('[TikTok Pixel] Loading triggered by timeout');
      }
    }, 5000);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default OptimizedTikTokPixel;