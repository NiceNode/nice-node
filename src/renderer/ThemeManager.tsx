import React, { useCallback, useEffect, useState } from 'react';
import { CHANNELS } from '../main/messenger';
import electron from './electronGlobal';
import { Settings } from '../main/state/settings';
import { darkTheme, lightTheme } from './Generics/redesign/theme.css';
import { useGetSettingsQuery } from './state/settingsService';
import { ThemeSetting } from './Presentational/Preferences/Preferences';
import { reportEvent } from './events/reportEvent';
import { NNEvent } from './events/events';
import { background } from './themeManager.css';

type Props = {
  children: React.ReactNode;
};

interface MetaElement extends HTMLMetaElement {
  content: ThemeSetting;
}

const ThemeManager = ({ children }: Props) => {
  const qSettings = useGetSettingsQuery();
  const [sIsDarkTheme, setIsDarkTheme] = useState<boolean>();
  const [platform, setPlatform] = useState<string>('');

  const handleColorSchemeChange = (colorScheme: ThemeSetting) => {
    const meta = document.querySelector(
      'meta[name="color-scheme"]',
    ) as MetaElement;
    meta.content = colorScheme as ThemeSetting;
  };

  // Sets the app language based on user or os setting
  useEffect(() => {
    const settingsData = qSettings?.data as Settings;
    if (settingsData) {
      const { osIsDarkMode, appThemeSetting, osPlatform } = settingsData;
      // check user and os settings
      if (appThemeSetting === 'light') {
        setIsDarkTheme(false);
        handleColorSchemeChange('light');
      } else if (appThemeSetting === 'dark') {
        setIsDarkTheme(true);
        handleColorSchemeChange('dark');
      } else {
        setIsDarkTheme(osIsDarkMode);
        handleColorSchemeChange(osIsDarkMode ? 'dark' : 'light');
      }
      electron.setNativeThemeSetting(appThemeSetting || 'auto');
      setPlatform(osPlatform || '');
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

  useEffect(() => {
    console.log('theme: listenForThemeChanges');
    electron.ipcRenderer.on(CHANNELS.theme, onThemeChange);
    return () => {
      electron.ipcRenderer.removeListener(CHANNELS.theme, onThemeChange);
    };
  }, [onThemeChange]);

  // todo: move reportEvent logic to another component or replace on backend
  // subscribes to a channel which notifies when dark mode settings change
  const onReportEventMessage = useCallback((event: NNEvent) => {
    // onChange, retrieve new settings
    console.log('theme: onReportEventMessage', event);
    reportEvent(event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listenForReportEventMessages = useCallback(async () => {
    console.log('theme: listenForReportEventMessages');
    electron.ipcRenderer.on(CHANNELS.reportEvent, onReportEventMessage);
    return () =>
      electron.ipcRenderer.removeListener(
        CHANNELS.reportEvent,
        onReportEventMessage,
      );
  }, [onReportEventMessage]);

  useEffect(() => {
    listenForReportEventMessages();
  }, [listenForReportEventMessages]);

  return (
    <div
      id="onBoarding"
      className={[
        background,
        platform,
        sIsDarkTheme ? darkTheme : lightTheme,
      ].join(' ')}
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
