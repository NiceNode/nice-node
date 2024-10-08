import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Settings } from '../../../main/state/settings';
import electron from '../../electronGlobal';
import { useGetSettingsQuery } from '../../state/settingsService';
import type { ModalConfig } from '../ModalManager/modalUtils';

import Preferences, { type Preference, type ThemeSetting } from './Preferences';

export interface PreferencesWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  data?: any;
}

const PreferencesWrapper = ({
  modalOnChangeConfig,
  data,
}: PreferencesWrapperProps) => {
  const [sThemeSetting, setThemeSetting] = useState<ThemeSetting>();
  const [sOsIsDarkMode, setOsIsDarkMode] = useState<boolean>();
  const [sIsOpenOnStartup, setIsOpenOnStartup] = useState<boolean>();
  const [sIsNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>();
  const [sIsEventReportingEnabled, setIsEventReportingEnabled] =
    useState<boolean>();
  const [sIsPreReleaseUpdatesEnabled, setIsPreReleaseUpdatesEnabled] =
    useState<boolean>();
  const [sIsDeveloperModeEnabled, setIsDeveloperModeEnabled] =
    useState<boolean>();
  const [sNiceNodeVersion, setNiceNodeVersion] = useState<string>();
  const [sLanguageSetting, setLanguageSetting] = useState<string>();
  const [hasScrolled, setHasScrolled] = useState(false); // Track if the scroll has occurred

  const { i18n } = useTranslation();
  const qSettings = useGetSettingsQuery();

  useEffect(() => {
    const getUserSettings = async () => {
      const userSettings = await electron.getSettings();
      console.log('pref userSettings', userSettings);
      // use the os setting unless the user changes
      let themeSetting: ThemeSetting = 'auto';
      let osIsDarkMode = false;
      if (userSettings.appThemeSetting) {
        themeSetting = userSettings.appThemeSetting;
      }
      if (userSettings.osIsDarkMode) {
        osIsDarkMode = userSettings.osIsDarkMode;
      }
      const notificationsSetting =
        userSettings.appIsNotificationsEnabled || false;
      const isOpenAtStartupSetting = userSettings.appIsOpenOnStartup || false;
      const isEventReportingEnabled =
        userSettings.appIsEventReportingEnabled || false;
      const isPreReleaseUpdatesEnabled =
        userSettings.appIsPreReleaseUpdatesEnabled || false;
      const isDeveloperModeEnabled =
        userSettings.appIsDeveloperModeEnabled || false;
      setThemeSetting(themeSetting);
      setOsIsDarkMode(osIsDarkMode);
      setIsNotificationsEnabled(notificationsSetting);
      setIsOpenOnStartup(isOpenAtStartupSetting);
      setIsEventReportingEnabled(isEventReportingEnabled);
      setIsPreReleaseUpdatesEnabled(isPreReleaseUpdatesEnabled);
      setIsDeveloperModeEnabled(isDeveloperModeEnabled);
    };

    const getNiceNodeVersion = async () => {
      const debugInfo = await electron.getDebugInfo();
      if (
        debugInfo?.niceNodeVersion &&
        typeof debugInfo.niceNodeVersion === 'string'
      ) {
        setNiceNodeVersion(debugInfo.niceNodeVersion);
      }
    };

    const getLanguageSetting = async () => {
      let appLanguage = 'en';
      if (qSettings?.data) {
        const settings: Settings = qSettings.data;
        if (settings.appLanguage) {
          appLanguage = settings.appLanguage;
        } else if (settings.osLanguage) {
          // Only 2-letter language codes supported right now
          //   OS's can return 4+ letter language codes
          appLanguage = settings.osLanguage.substring(0, 2);
        }
      }
      // This will set the language when the app loads.
      if (appLanguage !== i18n.language) {
        i18n.changeLanguage(appLanguage);
      }
      setLanguageSetting(appLanguage);
    };
    getUserSettings();
    getNiceNodeVersion();
    getLanguageSetting();
  }, []);

  useEffect(() => {
    if (!hasScrolled && data?.deeplink) {
      const element = document.getElementById(data?.deeplink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setHasScrolled(true);
      }
    }
  }, [sThemeSetting]);

  const onChangePreference = useCallback(
    async (preference: Preference, value: unknown) => {
      if (preference === 'theme') {
        const theme = value as ThemeSetting;
        setThemeSetting(theme);
        modalOnChangeConfig({
          theme,
        });
      } else if (preference === 'isOpenOnStartup') {
        const isOpenOnStartup = value as boolean;
        setIsOpenOnStartup(isOpenOnStartup);
        modalOnChangeConfig({
          isOpenOnStartup,
        });
      } else if (preference === 'isNotificationsEnabled') {
        const isNotificationsEnabled = value as boolean;
        setIsNotificationsEnabled(isNotificationsEnabled);
        modalOnChangeConfig({
          isNotificationsEnabled,
        });
      } else if (preference === 'isEventReportingEnabled') {
        const isEventReportingEnabled = value as boolean;
        setIsEventReportingEnabled(isEventReportingEnabled);
        modalOnChangeConfig({
          isEventReportingEnabled,
        });
      } else if (preference === 'isPreReleaseUpdatesEnabled') {
        const isPreReleaseUpdatesEnabled = value as boolean;
        setIsPreReleaseUpdatesEnabled(isPreReleaseUpdatesEnabled);
        modalOnChangeConfig({
          isPreReleaseUpdatesEnabled,
        });
      } else if (preference === 'isDeveloperModeEnabled') {
        const isDeveloperModeEnabled = value as boolean;
        setIsDeveloperModeEnabled(isDeveloperModeEnabled);
        modalOnChangeConfig({
          isDeveloperModeEnabled,
        });
      } else if (preference === 'language') {
        const language = value as string;
        setLanguageSetting(language);
        modalOnChangeConfig({
          language,
        });
      }
    },
    [modalOnChangeConfig],
  );

  if (sThemeSetting === undefined || sOsIsDarkMode === undefined) return null;
  return (
    <Preferences
      themeSetting={sThemeSetting}
      osDarkMode={sOsIsDarkMode}
      isOpenOnStartup={sIsOpenOnStartup}
      version={sNiceNodeVersion}
      isNotificationsEnabled={sIsNotificationsEnabled}
      isEventReportingEnabled={sIsEventReportingEnabled}
      isPreReleaseUpdatesEnabled={sIsPreReleaseUpdatesEnabled}
      isDeveloperModeEnabled={sIsDeveloperModeEnabled}
      language={sLanguageSetting}
      onChange={onChangePreference}
    />
  );
};

export default PreferencesWrapper;
