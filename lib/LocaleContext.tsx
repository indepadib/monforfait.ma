'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKeys } from './translations';

type Locale = 'fr' | 'ar';

interface LocaleContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKeys, fallback?: string) => string;
  isRtl: boolean;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    // Detect preferred locale from localStorage or default to French
    const savedLocale = localStorage.getItem('monforfait_locale') as Locale;
    if (savedLocale === 'fr' || savedLocale === 'ar') {
      setLocaleState(savedLocale);
      updateDocumentDirection(savedLocale);
    } else {
      // Optional: check browser language preferences
      const lang = navigator.language.substring(0, 2);
      if (lang === 'ar') {
        setLocaleState('ar');
        updateDocumentDirection('ar');
      } else {
        updateDocumentDirection('fr');
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('monforfait_locale', newLocale);
    updateDocumentDirection(newLocale);
  };

  const updateDocumentDirection = (lang: Locale) => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.lang = lang;
      if (lang === 'ar') {
        html.dir = 'rtl';
        document.body.classList.add('rtl');
      } else {
        html.dir = 'ltr';
        document.body.classList.remove('rtl');
      }
    }
  };

  const t = (key: TranslationKeys, fallback?: string): string => {
    const translation = translations[locale]?.[key];
    if (translation !== undefined) return translation;
    
    // If not found in current locale, try French fallback
    const fallbackTranslation = translations['fr']?.[key];
    if (fallbackTranslation !== undefined) return fallbackTranslation;

    return fallback || String(key);
  };

  const isRtl = locale === 'ar';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isRtl }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocaleProvider');
  }
  return context;
}
