// eslint must be confusing i18n with main/i18n and errors
// eslint-disable-next-line import/order
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../../assets/locales/en/translation.json';
import enSystemRequirements from '../../assets/locales/en/systemRequirements.json';
import enGenericComponents from '../../assets/locales/en/genericComponents.json';

import esTranslations from '../../assets/locales/es/translation.json';
import esSystemRequirements from '../../assets/locales/es/systemRequirements.json';
import esGenericComponents from '../../assets/locales/es/genericComponents.json';

import deTranslations from '../../assets/locales/de/translation.json';
import deSystemRequirements from '../../assets/locales/de/systemRequirements.json';
import deGenericComponents from '../../assets/locales/de/genericComponents.json';

import frTranslations from '../../assets/locales/fr/translation.json';
import frSystemRequirements from '../../assets/locales/fr/systemRequirements.json';
import frGenericComponents from '../../assets/locales/fr/genericComponents.json';

import jaTranslations from '../../assets/locales/ja/translation.json';
import jaSystemRequirements from '../../assets/locales/ja/systemRequirements.json';
import jaGenericComponents from '../../assets/locales/ja/genericComponents.json';

import ruTranslations from '../../assets/locales/ru/translation.json';
import ruSystemRequirements from '../../assets/locales/ru/systemRequirements.json';
import ruGenericComponents from '../../assets/locales/ru/genericComponents.json';

import viTranslations from '../../assets/locales/vi/translation.json';
import viSystemRequirements from '../../assets/locales/vi/systemRequirements.json';
import viGenericComponents from '../../assets/locales/vi/genericComponents.json';

import zhTranslations from '../../assets/locales/zh/translation.json';
import zhSystemRequirements from '../../assets/locales/zh/systemRequirements.json';
import zhGenericComponents from '../../assets/locales/zh/genericComponents.json';

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
      // language list, useful for inputting to auto-translators
      // "es", "de", "fr", "ja", "ru", "vi", "zh"
      en: {
        translation: enTranslations,
        systemRequirements: enSystemRequirements,
        genericComponents: enGenericComponents,
      },
      es: {
        translation: esTranslations,
        systemRequirements: esSystemRequirements,
        genericComponents: esGenericComponents,
      },
      de: {
        translation: deTranslations,
        systemRequirements: deSystemRequirements,
        genericComponents: deGenericComponents,
      },
      fr: {
        translation: frTranslations,
        systemRequirements: frSystemRequirements,
        genericComponents: frGenericComponents,
      },
      ja: {
        translation: jaTranslations,
        systemRequirements: jaSystemRequirements,
        genericComponents: jaGenericComponents,
      },
      ru: {
        translation: ruTranslations,
        systemRequirements: ruSystemRequirements,
        genericComponents: ruGenericComponents,
      },
      vi: {
        translation: viTranslations,
        systemRequirements: viSystemRequirements,
        genericComponents: viGenericComponents,
      },
      zh: {
        translation: zhTranslations,
        systemRequirements: zhSystemRequirements,
        genericComponents: zhGenericComponents,
      },
    },
  });

export default i18n;
