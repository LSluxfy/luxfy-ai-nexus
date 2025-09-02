
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

// Normalize language codes (pt-BR -> pt, en-US -> en, es-ES -> es)
const normalizeLanguage = (lang: string): string => {
  if (!lang) return 'es';
  
  const langCode = lang.toLowerCase().split('-')[0];
  const supportedLanguages = ['pt', 'en', 'es'];
  
  return supportedLanguages.includes(langCode) ? langCode : 'es';
};

// Force Spanish as default language
// Clear any existing language setting to ensure Spanish is always default
if (typeof window !== 'undefined') {
  const currentSaved = localStorage.getItem('luxfy-language');
  if (!currentSaved) {
    localStorage.setItem('luxfy-language', 'es');
  }
}

// Always default to Spanish unless manually changed
const savedLanguage = localStorage.getItem('luxfy-language');
const initialLanguage = savedLanguage || 'es';

console.log('i18n config - savedLanguage:', savedLanguage, 'initialLanguage:', initialLanguage);

// Save normalized language to localStorage if it wasn't saved before
if (!savedLanguage) {
  localStorage.setItem('luxfy-language', initialLanguage);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    lng: initialLanguage,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'luxfy-language',
      caches: ['localStorage'],
      convertDetectedLanguage: normalizeLanguage, // Normalize detected languages
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
