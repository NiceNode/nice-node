import i18n from 'i18next';
import I18nextCLILanguageDetector from 'i18next-cli-language-detector';

import { getSettings, setLanguage } from './state/settings';
import { getMenuBuilder } from './main';

import enTranslations from '../../assets/locales/en/translation.json';
import enNotifications from '../../assets/locales/en/notifications.json';
import enWindowMenu from '../../assets/locales/en/windowMenu.json';

import esTranslations from '../../assets/locales/es/translation.json';
import esNotifications from '../../assets/locales/es/notifications.json';
import esWindowMenu from '../../assets/locales/es/windowMenu.json';

import zhTranslations from '../../assets/locales/zh/translation.json';
import zhNotifications from '../../assets/locales/zh/notifications.json';
import zhWindowMenu from '../../assets/locales/zh/windowMenu.json';

import frTranslations from '../../assets/locales/fr/translation.json';
import frNotifications from '../../assets/locales/fr/notifications.json';
import frWindowMenu from '../../assets/locales/fr/windowMenu.json';

import jaTranslations from '../../assets/locales/ja/translation.json';
import jaNotifications from '../../assets/locales/ja/notifications.json';
import jaWindowMenu from '../../assets/locales/ja/windowMenu.json';

import deTranslations from '../../assets/locales/de/translation.json';
import deNotifications from '../../assets/locales/de/notifications.json';
import deWindowMenu from '../../assets/locales/de/windowMenu.json';

import ruTranslations from '../../assets/locales/ru/translation.json';
import ruNotifications from '../../assets/locales/ru/notifications.json';
import ruWindowMenu from '../../assets/locales/ru/windowMenu.json';

import viTranslations from '../../assets/locales/vi/translation.json';
import viNotifications from '../../assets/locales/vi/notifications.json';
import viWindowMenu from '../../assets/locales/vi/windowMenu.json';

// Default app language is english
const ENGLISH_LANGUAGE_CODE = 'en';

i18n.use(I18nextCLILanguageDetector).init({
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: enTranslations,
      notifications: enNotifications,
      windowMenu: enWindowMenu,
    },
    es: {
      translation: esTranslations,
      notifications: esNotifications,
      windowMenu: esWindowMenu,
    },
    zh: {
      translation: zhTranslations,
      notifications: zhNotifications,
      windowMenu: zhWindowMenu,
    },
    fr: {
      translation: frTranslations,
      notifications: frNotifications,
      windowMenu: frWindowMenu,
    },
    ja: {
      translation: jaTranslations,
      notifications: jaNotifications,
      windowMenu: jaWindowMenu,
    },
    de: {
      translation: deTranslations,
      notifications: deNotifications,
      windowMenu: deWindowMenu,
    },
    ru: {
      translation: ruTranslations,
      notifications: ruNotifications,
      windowMenu: ruWindowMenu,
    },
    vi: {
      translation: viTranslations,
      notifications: viNotifications,
      windowMenu: viWindowMenu,
    },

    // ... other languages ...
  },
});

// If the user has not selected a language, match OS language

// watch settings
export const onUserChangedLanguage = (languageCode: string) => {
  setLanguage(languageCode);
  i18n.changeLanguage(languageCode);
  // Builds menu again with new translations and sets it on the
  //  main window (app view)
  getMenuBuilder()?.buildMenu();
};

// get value on load
const updateCurrentLanguage = (
  osLanguage?: string,
  userLanguage?: string,
): string => {
  let appLanguage = ENGLISH_LANGUAGE_CODE;
  if (userLanguage) {
    appLanguage = userLanguage;
  } else if (osLanguage) {
    // Only 2-letter language codes supported right now
    //   OS's can return 4+ letter language codes
    appLanguage = osLanguage.substring(0, 2);
  }
  // This will set the language when the app loads.
  if (appLanguage !== i18n.language) {
    i18n.changeLanguage(appLanguage);
  }
  return appLanguage;
};

export const initialize = () => {
  const settings = getSettings();
  updateCurrentLanguage(settings.osLanguage, settings.appLanguage);
};

export const i18nMain = i18n;
