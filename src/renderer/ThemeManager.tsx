import React, { useCallback, useEffect, useState } from 'react';
import { CHANNELS } from '../main/messenger';
import electron from './electronGlobal';
import { Settings } from '../main/state/settings';
import { darkTheme, lightTheme } from './Generics/redesign/theme.css';
import { useGetSettingsQuery } from './state/settingsService';

type Props = {
  children: React.ReactNode;
};

const ThemeManager = ({ children }: Props) => {
  const qSettings = useGetSettingsQuery();
  const [sIsDarkTheme, setIsDarkTheme] = useState<boolean>();
  // Sets the app language based on user or os setting
  useEffect(() => {
    const settingsData = qSettings?.data as Settings;
    if (settingsData) {
      // check user and os settings
      if (settingsData.appThemeSetting === 'light') {
        setIsDarkTheme(false);
      } else if (settingsData.appThemeSetting === 'dark') {
        setIsDarkTheme(true);
      } else if (settingsData.appThemeSetting === 'auto') {
        setIsDarkTheme(settingsData.osIsDarkMode);
      }
    }
  }, [qSettings.data]);

  // subscribes to a channel which notifies when dark mode settings change
  const onThemeChange = useCallback(() => {
    // onChange, retrieve new settings
    console.log('theme: onThemeChange');
    qSettings?.refetch();
    // We don't care if qSettings changes here (and it shouldn't)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listenForThemeChanges = useCallback(async () => {
    console.log('theme: listenForThemeChanges');
    electron.ipcRenderer.on(CHANNELS.theme, onThemeChange);
    return () =>
      electron.ipcRenderer.removeListener(CHANNELS.theme, onThemeChange);
  }, [onThemeChange]);

  useEffect(() => {
    listenForThemeChanges();
  }, [listenForThemeChanges]);

  return (
    <div
      id="onBoarding"
      className={sIsDarkTheme ? darkTheme : lightTheme}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      {children}
    </div>
  );
};
export default ThemeManager;
