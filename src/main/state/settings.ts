import { app, nativeTheme } from 'electron';
// eslint-disable-next-line import/no-cycle
import { ThemeSetting } from '../../renderer/Presentational/PreferencesModal/Preferences';
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
const APP_HAS_SEEN_SPLASHSCREEN_KEY = 'appHasSeenSplashscreen';
const APP_THEME_SETTING = 'appThemeSetting';
const APP_IS_OPEN_ON_STARTUP = 'appIsOpenOnStartup';

export type Settings = {
  [OS_PLATFORM_KEY]?: string;
  [OS_ARCHITECTURE]?: string;
  [OS_LANGUAGE_KEY]?: string;
  [OS_COUNTRY_KEY]?: string;
  [APP_LANGUAGE_KEY]?: string;
  [OS_IS_DARK_MODE_KEY]?: boolean;
  [APP_THEME_SETTING]?: ThemeSetting;
  [APP_IS_OPEN_ON_STARTUP]?: boolean;
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

export const getSetHasSeenSplashscreen = (hasSeen?: boolean): boolean => {
  if (hasSeen !== undefined) {
    store.set(`${SETTINGS_KEY}.${APP_HAS_SEEN_SPLASHSCREEN_KEY}`, hasSeen);
  }
  const savedHasSeenValue: boolean = store.get(
    `${SETTINGS_KEY}.${APP_HAS_SEEN_SPLASHSCREEN_KEY}`
  );
  return savedHasSeenValue;
};

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

export const setThemeSetting = (theme: ThemeSetting) => {
  logger.info(`Setting theme to ${theme}`);
  store.set(`${SETTINGS_KEY}.${APP_THEME_SETTING}`, theme);
  logger.info(`App theme is ${store.get(SETTINGS_KEY, APP_THEME_SETTING)}`);
};

export const setIsOpenOnStartup = (isOpenOnStartup: boolean) => {
  logger.info(`Setting isOpenOnStartup to ${isOpenOnStartup}`);
  store.set(`${SETTINGS_KEY}.${APP_IS_OPEN_ON_STARTUP}`, isOpenOnStartup);
  logger.info(
    `App isOpenOnStartup is ${store.get(SETTINGS_KEY, APP_IS_OPEN_ON_STARTUP)}`
  );
};
