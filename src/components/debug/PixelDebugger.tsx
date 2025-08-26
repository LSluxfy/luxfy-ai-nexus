import { useEffect } from 'react';
import { trackEvent, FacebookEvents } from '../../lib/facebook-pixel';

const PixelDebugger = () => {
  useEffect(() => {
    // Add debug info to console
    console.log('[PixelDebugger] Component mounted');
    
    // Test tracking after a delay to ensure pixel is loaded
    const timer = setTimeout(() => {
      console.log('[PixelDebugger] Testing pixel tracking...');
      
      // Check if pixel utility is working
      if (typeof window !== 'undefined') {
        console.log('[PixelDebugger] Window fbq available:', !!window.fbq);
        
        if (window.fbq) {
          try {
            // Test direct fbq call
            window.fbq('track', 'PageView');
            console.log('[PixelDebugger] Direct fbq call successful');
          } catch (error) {
            console.error('[PixelDebugger] Direct fbq call failed:', error);
          }
          
          // Test utility function
          try {
            trackEvent(FacebookEvents.VIEW_CONTENT, {
              content_name: 'Landing Page',
              content_category: 'homepage'
            });
            console.log('[PixelDebugger] Utility trackEvent call successful');
          } catch (error) {
            console.error('[PixelDebugger] Utility trackEvent call failed:', error);
          }
        }
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>🔍 Facebook Pixel Debug</div>
      <div>ID: 1062729962007816</div>
      <div>Check console for detailed logs</div>
      <button 
        onClick={() => {
          if (window.fbq) {
            window.fbq('track', 'Lead', { content_name: 'Test Button' });
            console.log('[PixelDebugger] Manual test event sent');
          } else {
            console.error('[PixelDebugger] fbq not available for manual test');
          }
        }}
        style={{
          background: '#1877f2',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          marginTop: '5px',
          cursor: 'pointer'
        }}
      >
        Test Event
      </button>
    </div>
  );
};

export default PixelDebugger;