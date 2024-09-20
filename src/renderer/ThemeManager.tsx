import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CHANNELS } from '../main/messenger';
import type { Settings } from '../main/state/settings';
import { darkTheme, lightTheme } from './Generics/redesign/theme.css';
import type { ThemeSetting } from './Presentational/Preferences/Preferences';
import electron from './electronGlobal';
import type { NNEvent } from './events/events';
import { type ReportEventData, reportEvent } from './events/reportEvent';
import { useGetSettingsQuery } from './state/settingsService';
import { background } from './themeManager.css';

type Props = {
  children: React.ReactNode;
};

interface MetaElement extends HTMLMetaElement {
  content: ThemeSetting;
}

interface ThemeContextType {
  isDarkTheme: boolean;
  themeSetting: ThemeSetting;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeManager = ({ children }: Props) => {
  const qSettings = useGetSettingsQuery();
  const [sIsDarkTheme, setIsDarkTheme] = useState<boolean>();
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>('auto');
  const [platform, setPlatform] = useState<string>('');

  const handleColorSchemeChange = (colorScheme: ThemeSetting) => {
    const meta = document.querySelector(
      'meta[name="color-scheme"]',
    ) as MetaElement;
    if (meta) meta.content = colorScheme as ThemeSetting;
  };

  // Sets the app language based on user or os setting
  useEffect(() => {
    const settingsData = qSettings?.data as Settings;
    if (settingsData) {
      const { osIsDarkMode, appThemeSetting, osPlatform } = settingsData;
      setThemeSetting(appThemeSetting || 'auto');
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
  const onReportEventMessage = useCallback(
    (event: NNEvent, eventData?: ReportEventData) => {
      // onChange, retrieve new settings
      console.log('theme: onReportEventMessage', event);
      reportEvent(event, eventData);
    },
    [],
  );

  type messageArgs = [NNEvent, ReportEventData];
  useEffect(() => {
    console.log('theme: listenForReportEventMessages');
    electron.ipcRenderer.on(CHANNELS.reportEvent, (args: messageArgs) => {
      // console.log('reportEvent: ', args);
      onReportEventMessage(args[0], args[1]);
    });
    return () =>
      electron.ipcRenderer.removeListener(
        CHANNELS.reportEvent,
        onReportEventMessage,
      );
  }, [onReportEventMessage]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme: sIsDarkTheme, themeSetting }}>
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
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeManager');
  }
  return context;
};

export default ThemeManager;
