import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import mg from './locales/mg.json';

const savedLang = localStorage.getItem('fosaride_lang') || 'fr';

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en }, mg: { translation: mg } },
  lng: savedLang,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

export default i18n;
