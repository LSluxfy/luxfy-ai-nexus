import { useEffect } from 'react';

export default function WebVitalsTracker() {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVital = (metric: any) => {
      // Send to Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'WebVital', {
          name: metric.name,
          value: metric.value,
          id: metric.id
        });
      }

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value);
      }
    };

    // Load and track web vitals
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(trackWebVital);
      onFCP(trackWebVital);
      onINP(trackWebVital);
      onLCP(trackWebVital);
      onTTFB(trackWebVital);
    }).catch(() => {
      // Silently fail if web-vitals is not available
    });

    // Track connect rate
    const startTime = performance.now();
    
    const trackConnectRate = () => {
      const loadTime = performance.now() - startTime;
      
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'PageLoadTime', {
          load_time: Math.round(loadTime),
          page: 'landing'
        });
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Connect Rate] Page loaded in ${loadTime}ms`);
      }
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackConnectRate();
    } else {
      window.addEventListener('load', trackConnectRate);
      return () => window.removeEventListener('load', trackConnectRate);
    }
  }, []);

  return null;
}