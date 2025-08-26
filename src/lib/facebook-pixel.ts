// Facebook Pixel utility with robust error handling and debugging
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

interface FacebookPixelEvent {
  event: string;
  parameters?: Record<string, any>;
}

class FacebookPixelManager {
  private pixelId: string;
  private isInitialized: boolean = false;
  private eventQueue: FacebookPixelEvent[] = [];
  private debugMode: boolean = process.env.NODE_ENV === 'development';

  constructor(pixelId: string) {
    this.pixelId = pixelId;
    this.init();
  }

  private init() {
    // Check if pixel is already loaded
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        this.isInitialized = true;
        this.processQueue();
        this.log('Facebook Pixel already loaded');
      } else {
        // Wait for pixel to load
        this.waitForPixel();
      }
    }
  }

  private waitForPixel(maxAttempts: number = 50) {
    let attempts = 0;
    
    const checkPixel = () => {
      attempts++;
      
      if (window.fbq) {
        this.isInitialized = true;
        this.processQueue();
        this.log('Facebook Pixel loaded successfully');
      } else if (attempts < maxAttempts) {
        setTimeout(checkPixel, 100);
      } else {
        this.log('Facebook Pixel failed to load after maximum attempts', 'error');
      }
    };

    checkPixel();
  }

  private processQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.trackEvent(event.event, event.parameters);
      }
    }
  }

  private log(message: string, type: 'log' | 'error' | 'warn' = 'log') {
    if (this.debugMode) {
      console[type](`[Facebook Pixel ${this.pixelId}]`, message);
    }
  }

  public trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (typeof window === 'undefined') {
      this.log('Server-side rendering detected, skipping event');
      return;
    }

    if (!this.isInitialized || !window.fbq) {
      this.log(`Queuing event: ${eventName}`, 'warn');
      this.eventQueue.push({ event: eventName, parameters });
      return;
    }

    try {
      if (parameters) {
        window.fbq('track', eventName, parameters);
        this.log(`Event tracked: ${eventName}`, 'log');
        this.log(`Parameters: ${JSON.stringify(parameters)}`);
      } else {
        window.fbq('track', eventName);
        this.log(`Event tracked: ${eventName}`);
      }
    } catch (error) {
      this.log(`Error tracking event ${eventName}:`, error);
    }
  }

  public trackCustomEvent(eventName: string, parameters?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    if (!this.isInitialized || !window.fbq) {
      this.log(`Queuing custom event: ${eventName}`, 'warn');
      this.eventQueue.push({ event: eventName, parameters });
      return;
    }

    try {
      if (parameters) {
        window.fbq('trackCustom', eventName, parameters);
        this.log(`Custom event tracked: ${eventName}`);
        this.log(`Parameters: ${JSON.stringify(parameters)}`);
      } else {
        window.fbq('trackCustom', eventName);
        this.log(`Custom event tracked: ${eventName}`);
      }
    } catch (error) {
      this.log(`Error tracking custom event ${eventName}:`, error);
    }
  }

  public getStatus() {
    return {
      isInitialized: this.isInitialized,
      pixelLoaded: typeof window !== 'undefined' && !!window.fbq,
      queuedEvents: this.eventQueue.length,
      pixelId: this.pixelId
    };
  }

  public debugInfo() {
    const status = this.getStatus();
    console.table(status);
    
    if (typeof window !== 'undefined' && window.fbq) {
      console.log('Facebook Pixel object:', window.fbq);
    }
    
    return status;
  }
}

// Create singleton instance
const facebookPixel = new FacebookPixelManager('1062729962007816');

// Export convenience functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  facebookPixel.trackEvent(eventName, parameters);
};

export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  facebookPixel.trackCustomEvent(eventName, parameters);
};

export const getPixelStatus = () => facebookPixel.getStatus();

export const debugPixel = () => facebookPixel.debugInfo();

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

export default facebookPixel;