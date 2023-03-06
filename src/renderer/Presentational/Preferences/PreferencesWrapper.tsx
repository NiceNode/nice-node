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
      setThemeSetting(themeSetting);
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
      }
    },
    [modalOnChangeConfig]
  );

  return (
    <Preferences
      themeSetting={sThemeSetting}
      isOpenOnStartup={sIsOpenOnStartup}
      version={sNiceNodeVersion}
      onChange={onChangePreference}
    />
  );
};

export default PreferencesWrapper;
