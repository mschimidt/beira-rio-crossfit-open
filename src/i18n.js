import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      pt: pt,
    },
    lng: 'pt', // default language
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
