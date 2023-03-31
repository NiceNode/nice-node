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
  const [sIsOpenOnStartup, setIsOpenOnStartup] = useState<boolean>();
  const [sIsNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>();
  const [sIsEventReportingEnabled, setIsEventReportingEnabled] =
    useState<boolean>();
  const [sNiceNodeVersion, setNiceNodeVersion] = useState<string>();

  useEffect(() => {
    const asyncData = async () => {
      const userSettings = await electron.getSettings();
      console.log('pref userSettings', userSettings);
      // use the os setting unless the user changes
      let themeSetting: ThemeSetting = 'auto';
      if (userSettings.appThemeSetting) {
        themeSetting = userSettings.appThemeSetting;
      }
      const notificationsSetting =
        userSettings.appIsNotificationsEnabled || false;
      const isOpenAtStartupSetting = userSettings.appIsOpenOnStartup || false;
      const isEventReportingEnabled =
        userSettings.appIsEventReportingEnabled || false;
      setThemeSetting(themeSetting);
      setIsNotificationsEnabled(notificationsSetting);
      setIsOpenOnStartup(isOpenAtStartupSetting);
      setIsEventReportingEnabled(isEventReportingEnabled);
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
      } else if (preference === 'isEventReportingEnabled') {
        const isEventReportingEnabled = value as boolean;
        setIsEventReportingEnabled(isEventReportingEnabled);
        modalOnChangeConfig({
          isEventReportingEnabled,
        });
      }
    },
    [modalOnChangeConfig]
  );
  return (
    <Preferences
      themeSetting={sThemeSetting}
      isOpenOnStartup={sIsOpenOnStartup}
      version={sNiceNodeVersion}
      isNotificationsEnabled={sIsNotificationsEnabled}
      isEventReportingEnabled={sIsEventReportingEnabled}
      onChange={onChangePreference}
    />
  );
};

export default PreferencesWrapper;
