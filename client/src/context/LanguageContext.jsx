import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(i18n.language || 'fr');

  useEffect(() => {
    const saved = localStorage.getItem('fosaride_lang');
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
      setLanguageState(saved);
    }
  }, [i18n]);

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('fosaride_lang', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
