
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, getTranslation, locales } from '@/utils/locales';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof locales.en) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Get saved locale from localStorage or detect browser language
    const savedLocale = localStorage.getItem('diary-locale') as Locale;
    if (savedLocale && locales[savedLocale]) {
      setLocaleState(savedLocale);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'de') {
        setLocaleState('de');
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('diary-locale', newLocale);
  };

  const t = (key: keyof typeof locales.en) => {
    return getTranslation(locale, key);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
