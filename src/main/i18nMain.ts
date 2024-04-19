import i18n from 'i18next';
import I18nextCLILanguageDetector from 'i18next-cli-language-detector';

import { getSettings, setLanguage } from './state/settings';
import { getMenuBuilder } from './main';

import enTranslations from '../../assets/locales/en/translation.json';
import enNotifications from '../../assets/locales/en/notifications.json';
import enWindowMenu from '../../assets/locales/en/windowMenu.json';
import enUpdater from '../../assets/locales/en/updater.json';
import enDialog from '../../assets/locales/en/dialog.json';

import csTranslations from '../../assets/locales/cs/translation.json';
import csNotifications from '../../assets/locales/cs/notifications.json';
import csWindowMenu from '../../assets/locales/cs/windowMenu.json';
import csUpdater from '../../assets/locales/cs/updater.json';
import csDialog from '../../assets/locales/cs/dialog.json';

import esTranslations from '../../assets/locales/es/translation.json';
import esNotifications from '../../assets/locales/es/notifications.json';
import esWindowMenu from '../../assets/locales/es/windowMenu.json';
import esUpdater from '../../assets/locales/es/updater.json';
import esDialog from '../../assets/locales/es/dialog.json';

import zhTranslations from '../../assets/locales/zh/translation.json';
import zhNotifications from '../../assets/locales/zh/notifications.json';
import zhWindowMenu from '../../assets/locales/zh/windowMenu.json';
import zhUpdater from '../../assets/locales/zh/updater.json';
import zhDialog from '../../assets/locales/zh/dialog.json';

import frTranslations from '../../assets/locales/fr/translation.json';
import frNotifications from '../../assets/locales/fr/notifications.json';
import frWindowMenu from '../../assets/locales/fr/windowMenu.json';
import frUpdater from '../../assets/locales/fr/updater.json';
import frDialog from '../../assets/locales/fr/dialog.json';

import jaTranslations from '../../assets/locales/ja/translation.json';
import jaNotifications from '../../assets/locales/ja/notifications.json';
import jaWindowMenu from '../../assets/locales/ja/windowMenu.json';
import jaUpdater from '../../assets/locales/ja/updater.json';
import jaDialog from '../../assets/locales/ja/dialog.json';

import deTranslations from '../../assets/locales/de/translation.json';
import deNotifications from '../../assets/locales/de/notifications.json';
import deWindowMenu from '../../assets/locales/de/windowMenu.json';
import deUpdater from '../../assets/locales/de/updater.json';
import deDialog from '../../assets/locales/de/dialog.json';

import ruTranslations from '../../assets/locales/ru/translation.json';
import ruNotifications from '../../assets/locales/ru/notifications.json';
import ruWindowMenu from '../../assets/locales/ru/windowMenu.json';
import ruUpdater from '../../assets/locales/ru/updater.json';
import ruDialog from '../../assets/locales/ru/dialog.json';

import viTranslations from '../../assets/locales/vi/translation.json';
import viNotifications from '../../assets/locales/vi/notifications.json';
import viWindowMenu from '../../assets/locales/vi/windowMenu.json';
import viUpdater from '../../assets/locales/vi/updater.json';
import viDialog from '../../assets/locales/vi/dialog.json';

// Default app language is english
const ENGLISH_LANGUAGE_CODE = 'en';

i18n.use(I18nextCLILanguageDetector).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: enTranslations,
      notifications: enNotifications,
      windowMenu: enWindowMenu,
      updater: enUpdater,
      dialog: enDialog,
    },
    cs: {
      translation: csTranslations,
      notifications: csNotifications,
      windowMenu: csWindowMenu,
      updater: csUpdater,
      dialog: csDialog,
    },
    es: {
      translation: esTranslations,
      notifications: esNotifications,
      windowMenu: esWindowMenu,
      updater: esUpdater,
      dialog: esDialog,
    },
    zh: {
      translation: zhTranslations,
      notifications: zhNotifications,
      windowMenu: zhWindowMenu,
      updater: zhUpdater,
      dialog: zhDialog,
    },
    fr: {
      translation: frTranslations,
      notifications: frNotifications,
      windowMenu: frWindowMenu,
      updater: frUpdater,
      dialog: frDialog,
    },
    ja: {
      translation: jaTranslations,
      notifications: jaNotifications,
      windowMenu: jaWindowMenu,
      updater: jaUpdater,
      dialog: jaDialog,
    },
    de: {
      translation: deTranslations,
      notifications: deNotifications,
      windowMenu: deWindowMenu,
      updater: deUpdater,
      dialog: deDialog,
    },
    ru: {
      translation: ruTranslations,
      notifications: ruNotifications,
      windowMenu: ruWindowMenu,
      updater: ruUpdater,
      dialog: ruDialog,
    },
    vi: {
      translation: viTranslations,
      notifications: viNotifications,
      windowMenu: viWindowMenu,
      updater: viUpdater,
      dialog: viDialog,
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
