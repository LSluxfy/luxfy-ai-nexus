
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslation from '../locales/pt.json';
import enTranslation from '../locales/en.json';
import esTranslation from '../locales/es.json';

const resources = {
  pt: {
    translation: ptTranslation
  },
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

// Get the saved language from localStorage first
const savedLanguage = localStorage.getItem('luxfy-language');
console.log('i18n config - savedLanguage from localStorage:', savedLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: false,
    lng: savedLanguage || undefined, // Use saved language if available, otherwise let detector decide
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'luxfy-language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

// Add logging to track language changes
i18n.on('languageChanged', (lng) => {
  console.log('i18n language changed to:', lng);
});

i18n.on('initialized', () => {
  console.log('i18n initialized with language:', i18n.language);
});

export default i18n;
