import { useCallback, useEffect, useState } from 'react';
import electron from '../../electronGlobal';

import Preferences, { Preference, ThemeSetting } from './Preferences';

export interface PreferencesWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  modalOnChangeConfig: (config: object) => void;
}

const PreferencesWrapper = ({
  isOpen,
  onClose,
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
          preferences: {
            theme,
          },
        });
      } else if (preference === 'isOpenOnStartup') {
        const isOpenOnStartup = value as boolean;
        setIsOpenOnStartup(isOpenOnStartup);
        modalOnChangeConfig({
          preferences: {
            isOpenOnStartup: value,
          },
        });
      }
    },
    [modalOnChangeConfig]
  );

  return (
    <Preferences
      isOpen={isOpen}
      onClose={onClose}
      themeSetting={sThemeSetting}
      isOpenOnStartup={sIsOpenOnStartup}
      version={sNiceNodeVersion}
      onChange={onChangePreference}
    />
  );
};

export default PreferencesWrapper;
