import { useEffect } from 'react';
import { trackEvent, getPixelStatus, debugPixel } from '../lib/facebook-pixel';

export const useFacebookPixel = () => {
  useEffect(() => {
    // Check pixel status on mount
    const status = getPixelStatus();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[useFacebookPixel] Pixel status:', status);
      
      // Add debug command to window for easy testing
      (window as any).debugFacebookPixel = debugPixel;
      console.log('[useFacebookPixel] Debug function available: debugFacebookPixel()');
    }
  }, []);

  return {
    trackEvent,
    getStatus: getPixelStatus,
    debug: debugPixel
  };
};