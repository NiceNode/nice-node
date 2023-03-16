import { useCallback, useEffect, useState } from 'react';
import { ModalConfig } from '../ModalManager/modalUtils';
import electron from '../../electronGlobal';

import Preferences, { Preference, ThemeSetting } from './Preferences';

export interface PreferencesWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
}

const PreferencesWrapper = ({
  modalOnChangeConfig,
}: PreferencesWrapperProps) => {
  const [sThemeSetting, setThemeSetting] = useState<ThemeSetting>();
  const [sOsIsDarkMode, setOsIsDarkMode] = useState<boolean>();
  const [sIsOpenOnStartup, setIsOpenOnStartup] = useState<boolean>();
  const [sIsNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>();
  const [sNiceNodeVersion, setNiceNodeVersion] = useState<string>();

  useEffect(() => {
    const asyncData = async () => {
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
      setThemeSetting(themeSetting);
      setOsIsDarkMode(osIsDarkMode);
      setIsNotificationsEnabled(notificationsSetting);
      setIsOpenOnStartup(isOpenAtStartupSetting);
    };
    asyncData();

    const getNiceNodeVersion = async () => {
      const debugInfo = await electron.getDebugInfo();
      if (
        debugInfo?.niceNodeVersion &&
        typeof debugInfo.niceNodeVersion === 'string'
      ) {
        setNiceNodeVersion(debugInfo.niceNodeVersion);
      }
    };
    getNiceNodeVersion();
  }, []);

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
      }
    },
    [modalOnChangeConfig]
  );

  if (sThemeSetting === undefined || sOsIsDarkMode === undefined) return null;
  return (
    <Preferences
      themeSetting={sThemeSetting}
      osDarkMode={sOsIsDarkMode}
      isOpenOnStartup={sIsOpenOnStartup}
      version={sNiceNodeVersion}
      isNotificationsEnabled={sIsNotificationsEnabled}
      onChange={onChangePreference}
    />
  );
};

export default PreferencesWrapper;
