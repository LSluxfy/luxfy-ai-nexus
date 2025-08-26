// Simplified Facebook Pixel utility - assumes pixel is loaded via HTML
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Simple utility to track Facebook Pixel events
// Pixel is loaded and initialized in index.html

const debugMode = process.env.NODE_ENV === 'development';

const log = (message: string, type: 'log' | 'error' | 'warn' = 'log') => {
  if (debugMode) {
    console[type](`[Facebook Pixel 1062729962007816]`, message);
  }
};

const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') {
    log('Server-side rendering detected, skipping event');
    return;
  }

  if (!window.fbq) {
    log(`Facebook Pixel not loaded, cannot track: ${eventName}`, 'warn');
    return;
  }

  try {
    if (parameters) {
      window.fbq('track', eventName, parameters);
      log(`Event tracked: ${eventName} with parameters:`, 'log');
      log(JSON.stringify(parameters));
    } else {
      window.fbq('track', eventName);
      log(`Event tracked: ${eventName}`);
    }
  } catch (error) {
    log(`Error tracking event ${eventName}: ${error}`, 'error');
  }
};

const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') {
    log('Server-side rendering detected, skipping custom event');
    return;
  }

  if (!window.fbq) {
    log(`Facebook Pixel not loaded, cannot track custom event: ${eventName}`, 'warn');
    return;
  }

  try {
    if (parameters) {
      window.fbq('trackCustom', eventName, parameters);
      log(`Custom event tracked: ${eventName} with parameters:`);
      log(JSON.stringify(parameters));
    } else {
      window.fbq('trackCustom', eventName);
      log(`Custom event tracked: ${eventName}`);
    }
  } catch (error) {
    log(`Error tracking custom event ${eventName}: ${error}`, 'error');
  }
};

const getPixelStatus = () => {
  return {
    pixelLoaded: typeof window !== 'undefined' && !!window.fbq,
    pixelId: '1062729962007816'
  };
};

const debugPixel = () => {
  const status = getPixelStatus();
  console.table(status);
  
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('Facebook Pixel object:', window.fbq);
  }
  
  return status;
};

// Export functions
export { trackEvent, trackCustomEvent, getPixelStatus, debugPixel };

// Predefined events for easy use
export const FacebookEvents = {
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  CONTACT: 'Contact',
  VIEW_CONTENT: 'ViewContent',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  LEAD: 'Lead',
  PURCHASE: 'Purchase',
  ADD_TO_CART: 'AddToCart',
  ADD_TO_WISHLIST: 'AddToWishlist',
  SEARCH: 'Search'
} as const;

export default { trackEvent, trackCustomEvent, getPixelStatus, debugPixel };