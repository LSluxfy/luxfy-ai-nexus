
import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n/config';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Always prioritize localStorage first
    const savedLanguage = localStorage.getItem('luxfy-language');
    console.log('LanguageProvider init - savedLanguage:', savedLanguage, 'i18n.language:', i18n.language);
    return savedLanguage || 'pt';
  });

  const availableLanguages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const changeLanguage = (language: string) => {
    console.log('LanguageProvider changeLanguage called:', language);
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('luxfy-language', language);
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
      console.log('i18n languageChanged event:', lng);
      const savedLanguage = localStorage.getItem('luxfy-language');
      
      // Only update if the change is legitimate (matches localStorage or is a user-initiated change)
      if (lng === savedLanguage || !savedLanguage) {
        setCurrentLanguage(lng);
      } else {
        // If i18n changed but doesn't match localStorage, restore from localStorage
        console.log('i18n change conflicts with localStorage, restoring:', savedLanguage);
        i18n.changeLanguage(savedLanguage);
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
        console.log('localStorage changed externally:', e.newValue);
        setCurrentLanguage(e.newValue);
        i18n.changeLanguage(e.newValue);
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
      if (savedLanguage && savedLanguage !== currentLanguage) {
        console.log('Route change detected, ensuring language sync:', savedLanguage);
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
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
