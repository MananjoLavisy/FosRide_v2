import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'mg', label: 'MG' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-switcher">
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`lang-btn ${language === l.code ? 'active' : ''}`}
          onClick={() => setLanguage(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
