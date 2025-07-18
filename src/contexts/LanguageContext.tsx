
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
    // Let i18n handle the detection from localStorage
    const savedLanguage = localStorage.getItem('luxfy-language');
    return savedLanguage || i18n.language || 'pt';
  });

  const availableLanguages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('luxfy-language', language);
  };

  useEffect(() => {
    // Sync with i18n when it's ready
    const syncLanguage = () => {
      const savedLanguage = localStorage.getItem('luxfy-language');
      const detectedLanguage = savedLanguage || i18n.language || 'pt';
      
      if (detectedLanguage !== currentLanguage) {
        setCurrentLanguage(detectedLanguage);
        if (i18n.language !== detectedLanguage) {
          i18n.changeLanguage(detectedLanguage);
        }
      }
    };

    // Initial sync
    syncLanguage();

    // Listen to i18n language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Also listen to i18n initialization
    i18n.on('initialized', syncLanguage);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      i18n.off('initialized', syncLanguage);
    };
  }, [currentLanguage]);

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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
