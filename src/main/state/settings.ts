import { app, nativeTheme } from 'electron';
import { getArch } from '../arch';
import { sendMessageOnThemeChange } from '../docker/messageFrontEnd';
import logger from '../logger';
import { getPlatform, isLinux } from '../platform';

import { setAllowPrerelease } from '../updater';
import { setOpenAtLoginLinux } from '../util/linuxAutostartFile';
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
const APP_HAS_SEEN_ALPHA_MODAL = 'appHasSeenAlphaModal';
const APP_THEME_SETTING = 'appThemeSetting';
const APP_IS_OPEN_ON_STARTUP = 'appIsOpenOnStartup';
const APP_IS_NOTIFICATIONS_ENABLED = 'appIsNotificationsEnabled';
const APP_IS_EVENT_REPORTING_ENABLED = 'appIsEventReportingEnabled';
const APP_IS_PRE_RELEASE_UPDATES_ENABLED = 'appIsPreReleaseUpdatesEnabled';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Settings = {
  [OS_PLATFORM_KEY]?: string;
  [OS_ARCHITECTURE]?: string;
  [OS_LANGUAGE_KEY]?: string;
  [OS_COUNTRY_KEY]?: string;
  [APP_LANGUAGE_KEY]?: string;
  [OS_IS_DARK_MODE_KEY]?: boolean;
  [APP_THEME_SETTING]?: ThemeSetting;
  [APP_IS_OPEN_ON_STARTUP]?: boolean;
  [APP_IS_NOTIFICATIONS_ENABLED]?: boolean;
  [APP_IS_EVENT_REPORTING_ENABLED]?: boolean;
  [APP_IS_PRE_RELEASE_UPDATES_ENABLED]?: boolean;
};

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  logger.info('Intializing store settings key');
  let settings = store.get(SETTINGS_KEY);
  if (!settings || typeof settings !== 'object') {
    // set the default settings if no settings are saved yet
    settings = {
      appThemeSetting: 'auto',
      appIsNotificationsEnabled: true,
      appIsEventReportingEnabled: true,
    };
    store.set(SETTINGS_KEY, settings);
  }
};
initialize();

export const getSetHasSeenSplashscreen = (hasSeen?: boolean): boolean => {
  if (hasSeen !== undefined) {
    store.set(`${SETTINGS_KEY}.${APP_HAS_SEEN_SPLASHSCREEN_KEY}`, hasSeen);
  }
  const savedHasSeenValue: boolean = store.get(
    `${SETTINGS_KEY}.${APP_HAS_SEEN_SPLASHSCREEN_KEY}`,
  );
  return savedHasSeenValue;
};

export const getSetHasSeenAlphaModal = (hasSeen?: boolean): boolean => {
  if (hasSeen !== undefined) {
    store.set(`${SETTINGS_KEY}.${APP_HAS_SEEN_ALPHA_MODAL}`, hasSeen);
  }
  const savedHasSeenValue: boolean = store.get(
    `${SETTINGS_KEY}.${APP_HAS_SEEN_ALPHA_MODAL}`,
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
  logger.info(
    `App language is ${JSON.stringify(
      store.get(SETTINGS_KEY, APP_LANGUAGE_KEY),
    )}`,
  );
};

export const setNativeThemeSetting = (theme: ThemeSetting) => {
  if (theme === 'auto') {
    nativeTheme.themeSource = 'system';
  } else if (theme === 'dark') {
    nativeTheme.themeSource = 'dark';
  } else if (theme === 'light') {
    nativeTheme.themeSource = 'light';
  }
};

export const setThemeSetting = (theme: ThemeSetting) => {
  logger.info(`Setting theme to ${theme}`);
  store.set(`${SETTINGS_KEY}.${APP_THEME_SETTING}`, theme);
  logger.info(`App theme is ${store.get(SETTINGS_KEY, APP_THEME_SETTING)}`);
  setNativeThemeSetting(theme);
  sendMessageOnThemeChange();
};

export const setIsOpenOnStartup = async (isOpenOnStartup: boolean) => {
  logger.info(`Setting isOpenOnStartup to ${isOpenOnStartup}`);
  // electron tells OS to open at login
  app.setLoginItemSettings({ openAtLogin: isOpenOnStartup });
  // Linux is not officially supported by Electron. This covers common
  //  linux distros and standards, but not all.
  if (isLinux()) {
    // If this fails, do not update the store.
    // Todo: notify user
    try {
      await setOpenAtLoginLinux(isOpenOnStartup);
    } catch (err) {
      logger.error(err);
      return;
    }
  }
  store.set(`${SETTINGS_KEY}.${APP_IS_OPEN_ON_STARTUP}`, isOpenOnStartup);
  logger.info(
    `App isOpenOnStartup is ${store.get(
      `${SETTINGS_KEY}.${APP_IS_OPEN_ON_STARTUP}`,
    )}`,
  );
};

export const getSetIsNotificationsEnabled = (
  isNotificationsEnabled?: boolean,
) => {
  if (isNotificationsEnabled !== undefined) {
    logger.info(`Setting isNotificationsEnabled to ${isNotificationsEnabled}`);
    store.set(
      `${SETTINGS_KEY}.${APP_IS_NOTIFICATIONS_ENABLED}`,
      isNotificationsEnabled,
    );
  }
  const savedIsNotificationsEnable: boolean = store.get(
    `${SETTINGS_KEY}.${APP_IS_NOTIFICATIONS_ENABLED}`,
  );
  return savedIsNotificationsEnable;
};

export const setIsEventReportingEnabled = (
  isEventReportingEnabled: boolean,
) => {
  logger.info(`Setting isEventReportingEnabled to ${isEventReportingEnabled}`);
  store.set(
    `${SETTINGS_KEY}.${APP_IS_EVENT_REPORTING_ENABLED}`,
    isEventReportingEnabled,
  );
  logger.info(
    `App isEventReportingEnabled is ${store.get(
      SETTINGS_KEY,
      APP_IS_EVENT_REPORTING_ENABLED,
    )}`,
  );
};

export const getSetIsPreReleaseUpdatesEnabled = (
  isPreReleaseUpdatesEnabled?: boolean,
) => {
  if (isPreReleaseUpdatesEnabled !== undefined) {
    logger.info(
      `Setting isPreReleaseUpdatesEnabled to ${isPreReleaseUpdatesEnabled}`,
    );
    store.set(
      `${SETTINGS_KEY}.${APP_IS_PRE_RELEASE_UPDATES_ENABLED}`,
      isPreReleaseUpdatesEnabled,
    );
    setAllowPrerelease(isPreReleaseUpdatesEnabled);
  }
  const savedIsPreReleaseUpdatesEnabled: boolean = store.get(
    `${SETTINGS_KEY}.${APP_IS_PRE_RELEASE_UPDATES_ENABLED}`,
  );
  return savedIsPreReleaseUpdatesEnabled;
};

// listen to OS theme updates
nativeTheme.on('updated', () => {
  console.log("nativeTheme.on('updated')");
  const settings = getSettings();

  // bug: nativeTheme.shouldUseDarkColors stays true when OS theme changes to light and
  // NN is set to dark mode
  console.log(
    'nativeTheme shouldUseDarkColors vs settings.osIsDarkMode',
    nativeTheme.shouldUseDarkColors,
    settings.osIsDarkMode,
  );
  // if the user theme setting is 'auto', notify the front end of the change
  if (settings.appThemeSetting === 'auto') {
    sendMessageOnThemeChange();
  }
});
