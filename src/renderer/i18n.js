// eslint must be confusing i18n with main/i18n and errors
// eslint-disable-next-line import/order
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// import Backend from 'i18next-http-backend';
import zhTranslations from '../../assets/locales/zh/translation.json';
import deTranslations from '../../assets/locales/de/translation.json';
import enTranslations from '../../assets/locales/en/translation.json';
import enSystemRequirements from '../../assets/locales/en/systemRequirements.json';
import enGenericComponents from '../../assets/locales/en/genericComponents.json';
import esTranslations from '../../assets/locales/es/translation.json';
import esGenericComponents from '../../assets/locales/es/genericComponents.json';
import frTranslations from '../../assets/locales/fr/translation.json';
import jaTranslations from '../../assets/locales/ja/translation.json';
import viTranslations from '../../assets/locales/vi/translation.json';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    returnNull: false,
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      zh: {
        translation: zhTranslations,
      },
      de: {
        translation: deTranslations,
      },
      en: {
        translation: enTranslations,
        systemRequirements: enSystemRequirements,
        genericComponents: enGenericComponents,
      },
      es: {
        translation: esTranslations,
        genericComponents: esGenericComponents,
      },
      fr: {
        translation: frTranslations,
      },
      ja: {
        translation: jaTranslations,
      },
      vi: {
        translation: viTranslations,
      },
    },
  });

export default i18n;
