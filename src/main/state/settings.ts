import { app, nativeTheme } from 'electron';
import { getArch } from '../arch';
import logger from '../logger';
import { getPlatform } from '../platform';

import store from './store';

// export type Settings = Record<string, string | object | boolean>;
const SETTINGS_KEY = 'settings';
const OS_PLATFORM_KEY = 'osPlatform';
const OS_ARCHITECTURE = 'osArchitecture';
const OS_LANGUAGE_KEY = 'osLanguage';
const OS_COUNTRY_KEY = 'osCountry';
const OS_IS_DARK_MODE_KEY = 'osIsDarkMode';
const APP_LANGUAGE_KEY = 'appLanguage';

export type Settings = {
  [OS_PLATFORM_KEY]?: string;
  [OS_ARCHITECTURE]?: string;
  [OS_LANGUAGE_KEY]?: string;
  [OS_COUNTRY_KEY]?: string;
  [APP_LANGUAGE_KEY]?: string;
  [OS_IS_DARK_MODE_KEY]?: boolean;
};

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  logger.info('Intializing store settings key');
  let nodes = store.get(SETTINGS_KEY);
  if (!nodes || typeof nodes !== 'object') {
    nodes = {};
    store.set(SETTINGS_KEY, {});
  }
};
initialize();

export const getSettings = (): Settings => {
  const settings: Settings = store.get(SETTINGS_KEY);
  settings[OS_PLATFORM_KEY] = getPlatform();
  settings[OS_ARCHITECTURE] = getArch();
  settings[OS_COUNTRY_KEY] = app.getLocaleCountryCode();
  settings[OS_LANGUAGE_KEY] = app.getLocale();
  settings[OS_IS_DARK_MODE_KEY] = nativeTheme.shouldUseDarkColors;
  return settings;
};

export const setLanguage = (languageCode: string) => {
  logger.info(`Setting language to ${languageCode}`);
  store.set(`${SETTINGS_KEY}.${APP_LANGUAGE_KEY}`, languageCode);
  logger.info(`App language is ${store.get(SETTINGS_KEY, APP_LANGUAGE_KEY)}`);
};
