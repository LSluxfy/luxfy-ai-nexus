
import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n/config';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Normalize language codes for consistency
const normalizeLanguage = (lang: string): string => {
  if (!lang) return 'es';
  
  const langCode = lang.toLowerCase().split('-')[0];
  const supportedLanguages = ['pt', 'en', 'es'];
  
  return supportedLanguages.includes(langCode) ? langCode : 'es';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Always default to Spanish unless manually changed
    const savedLanguage = localStorage.getItem('luxfy-language');
    const initialLang = savedLanguage ? normalizeLanguage(savedLanguage) : 'es';
    
    console.log('LanguageProvider init - savedLanguage:', savedLanguage, 'initialLang:', initialLang);
    
    // Save Spanish as default if not saved before
    if (!savedLanguage) {
      localStorage.setItem('luxfy-language', 'es');
    }
    
    return initialLang;
  });

  const availableLanguages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const changeLanguage = (language: string) => {
    const normalizedLanguage = normalizeLanguage(language);
    console.log('LanguageProvider changeLanguage called:', language, 'normalized:', normalizedLanguage);
    
    i18n.changeLanguage(normalizedLanguage);
    setCurrentLanguage(normalizedLanguage);
    localStorage.setItem('luxfy-language', normalizedLanguage);
  };

  useEffect(() => {
    // Force sync with localStorage on mount and whenever currentLanguage changes
    const ensureLanguageSync = () => {
      const savedLanguage = localStorage.getItem('luxfy-language');
      console.log('ensureLanguageSync - savedLanguage:', savedLanguage, 'currentLanguage:', currentLanguage, 'i18n.language:', i18n.language);
      
      if (savedLanguage && savedLanguage !== currentLanguage) {
        console.log('Language mismatch detected, syncing to:', savedLanguage);
        setCurrentLanguage(savedLanguage);
        if (i18n.language !== savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
      } else if (savedLanguage && i18n.language !== savedLanguage) {
        console.log('i18n language mismatch, syncing i18n to:', savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    };

    // Initial sync
    ensureLanguageSync();

    // Listen to i18n language changes
    const handleLanguageChange = (lng: string) => {
      const normalizedLng = normalizeLanguage(lng);
      console.log('i18n languageChanged event:', lng, 'normalized:', normalizedLng);
      
      const savedLanguage = localStorage.getItem('luxfy-language');
      const normalizedSaved = savedLanguage ? normalizeLanguage(savedLanguage) : null;
      
      // Only update if the change is legitimate (matches localStorage or is a user-initiated change)
      if (normalizedLng === normalizedSaved || !normalizedSaved) {
        setCurrentLanguage(normalizedLng);
        if (savedLanguage !== normalizedLng) {
          localStorage.setItem('luxfy-language', normalizedLng);
        }
      } else {
        // If i18n changed but doesn't match localStorage, restore from localStorage
        console.log('i18n change conflicts with localStorage, restoring:', normalizedSaved);
        i18n.changeLanguage(normalizedSaved);
      }
    };

    // Listen to i18n initialization
    const handleI18nInitialized = () => {
      console.log('i18n initialized event');
      ensureLanguageSync();
    };

    i18n.on('languageChanged', handleLanguageChange);
    i18n.on('initialized', handleI18nInitialized);

    // Also listen to storage changes (in case language is changed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'luxfy-language' && e.newValue) {
        const normalizedValue = normalizeLanguage(e.newValue);
        console.log('localStorage changed externally:', e.newValue, 'normalized:', normalizedValue);
        setCurrentLanguage(normalizedValue);
        i18n.changeLanguage(normalizedValue);
        // Ensure localStorage has normalized value
        if (e.newValue !== normalizedValue) {
          localStorage.setItem('luxfy-language', normalizedValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      i18n.off('initialized', handleI18nInitialized);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLanguage]);

  // Additional effect to watch for route changes and ensure language persistence
  useEffect(() => {
    const checkLanguageOnRouteChange = () => {
      const savedLanguage = localStorage.getItem('luxfy-language');
      const normalizedSaved = savedLanguage ? normalizeLanguage(savedLanguage) : null;
      
      if (normalizedSaved && normalizedSaved !== currentLanguage) {
        console.log('Route change detected, ensuring language sync:', savedLanguage, 'normalized:', normalizedSaved);
        setCurrentLanguage(normalizedSaved);
        i18n.changeLanguage(normalizedSaved);
        // Ensure localStorage has normalized value
        if (savedLanguage !== normalizedSaved) {
          localStorage.setItem('luxfy-language', normalizedSaved);
        }
      }
    };

    // Small delay to ensure route change is complete
    const timeoutId = setTimeout(checkLanguageOnRouteChange, 100);
    
    return () => clearTimeout(timeoutId);
  }, [window.location.pathname, currentLanguage]);

  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('useLanguage called outside LanguageProvider');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
