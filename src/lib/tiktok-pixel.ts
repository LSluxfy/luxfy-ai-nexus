// TikTok Pixel utility functions
// Similar to Facebook Pixel but for TikTok analytics

declare global {
  interface Window {
    ttq: any;
    TiktokAnalyticsObject: string;
  }
}

// Debug mode for development
const debugMode = import.meta.env.DEV;
const log = (message: string, data?: any) => {
  if (debugMode) {
    console.log(`[TikTok Pixel] ${message}`, data || '');
  }
};

// Track standard TikTok events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    log('Skipping TikTok event (server-side)', { eventName, parameters });
    return;
  }

  // Check if TikTok pixel is loaded
  if (typeof window.ttq === 'undefined') {
    log('TikTok pixel not loaded yet, queuing event', { eventName, parameters });
    return;
  }

  try {
    if (parameters) {
      window.ttq.track(eventName, parameters);
      log(`Tracked TikTok event: ${eventName}`, parameters);
    } else {
      window.ttq.track(eventName);
      log(`Tracked TikTok event: ${eventName}`);
    }
  } catch (error) {
    console.error('Error tracking TikTok event:', error);
  }
};

// Track custom TikTok events
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    log('Skipping custom TikTok event (server-side)', { eventName, parameters });
    return;
  }

  // Check if TikTok pixel is loaded
  if (typeof window.ttq === 'undefined') {
    log('TikTok pixel not loaded yet, queuing custom event', { eventName, parameters });
    return;
  }

  try {
    if (parameters) {
      window.ttq.track(eventName, parameters);
      log(`Tracked custom TikTok event: ${eventName}`, parameters);
    } else {
      window.ttq.track(eventName);
      log(`Tracked custom TikTok event: ${eventName}`);
    }
  } catch (error) {
    console.error('Error tracking custom TikTok event:', error);
  }
};

// Get TikTok pixel status
export const getPixelStatus = () => {
  if (typeof window === 'undefined') {
    return { loaded: false, pixelId: null };
  }
  
  return {
    loaded: typeof window.ttq !== 'undefined',
    pixelId: 'D34MR73C77U2RJTP8EB0'
  };
};

// Debug TikTok pixel
export const debugPixel = () => {
  if (typeof window === 'undefined') {
    console.log('[TikTok Pixel Debug] Running in server environment');
    return;
  }

  const status = getPixelStatus();
  console.log('[TikTok Pixel Debug] Status:', status);
  
  if (status.loaded) {
    console.log('[TikTok Pixel Debug] TTQ object:', window.ttq);
  }
};

// Common TikTok events enum
export enum TikTokEvents {
  PAGE_VIEW = 'page',
  VIEW_CONTENT = 'ViewContent',
  ADD_TO_CART = 'AddToCart',
  PURCHASE = 'Purchase',
  COMPLETE_REGISTRATION = 'CompleteRegistration',
  CONTACT = 'Contact',
  DOWNLOAD = 'Download',
  SUBMIT_FORM = 'SubmitForm',
  CLICK_BUTTON = 'ClickButton'
}

// Export functions and events
export default {
  trackEvent,
  trackCustomEvent,
  getPixelStatus,
  debugPixel,
  TikTokEvents
};