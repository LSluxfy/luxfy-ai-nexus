import { useCallback } from 'react';
import { trackEvent, trackCustomEvent, getPixelStatus, debugPixel, TikTokEvents } from '@/lib/tiktok-pixel';

export const useTikTokPixel = () => {
  // Track standard TikTok events
  const track = useCallback((eventName: string, parameters?: Record<string, any>) => {
    trackEvent(eventName, parameters);
  }, []);

  // Track custom events
  const trackCustom = useCallback((eventName: string, parameters?: Record<string, any>) => {
    trackCustomEvent(eventName, parameters);
  }, []);

  // Track specific TikTok events with convenience methods
  const trackPageView = useCallback(() => {
    trackEvent(TikTokEvents.PAGE_VIEW);
  }, []);

  const trackViewContent = useCallback((contentData?: Record<string, any>) => {
    trackEvent(TikTokEvents.VIEW_CONTENT, contentData);
  }, []);

  const trackContact = useCallback((contactData?: Record<string, any>) => {
    trackEvent(TikTokEvents.CONTACT, contactData);
  }, []);

  const trackPurchase = useCallback((purchaseData?: Record<string, any>) => {
    trackEvent(TikTokEvents.PURCHASE, purchaseData);
  }, []);

  const trackCompleteRegistration = useCallback((registrationData?: Record<string, any>) => {
    trackEvent(TikTokEvents.COMPLETE_REGISTRATION, registrationData);
  }, []);

  const trackSubmitForm = useCallback((formData?: Record<string, any>) => {
    trackEvent(TikTokEvents.SUBMIT_FORM, formData);
  }, []);

  const trackClickButton = useCallback((buttonData?: Record<string, any>) => {
    trackEvent(TikTokEvents.CLICK_BUTTON, buttonData);
  }, []);

  // Get pixel status
  const getStatus = useCallback(() => {
    return getPixelStatus();
  }, []);

  // Debug pixel
  const debug = useCallback(() => {
    debugPixel();
  }, []);

  return {
    // General tracking methods
    track,
    trackCustom,
    
    // Specific event methods
    trackPageView,
    trackViewContent,
    trackContact,
    trackPurchase,
    trackCompleteRegistration,
    trackSubmitForm,
    trackClickButton,
    
    // Utility methods
    getStatus,
    debug,
    
    // Events enum for reference
    events: TikTokEvents
  };
};

export default useTikTokPixel;