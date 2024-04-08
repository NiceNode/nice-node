import React, { useEffect, useState, useRef } from 'react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';

import { NotificationsWrapper } from './Presentational/Notifications/NotificationsWrapper';
import SystemMonitor from './Presentational/SystemMonitor/SystemMonitor';
import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import { initialize as initializeIpcListeners } from './ipc';
import NodeScreen from './Presentational/NodeScreen/NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';
import LogsWrapper from './Presentational/LogsWrapper/LogsWrapper';
import NodeSetup from './Presentational/NodeSetup/NodeSetup';
import {
  dragWindowContainer,
  homeContainer,
  contentContainer,
  sidebarDrag,
  borderLeft,
  borderCenter,
  borderCenterLine,
  borderRight,
} from './app.css';
import ThemeManager from './ThemeManager';
import ModalManager from './Presentational/ModalManager/ModalManager';
import { reportEvent } from './events/reportEvent';
import NodePackageScreen from './Presentational/NodePackageScreen/NodePackageScreen';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});
reportEvent('OpenApp');

const WindowContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={dragWindowContainer} />
      {children}
    </>
  );
};

const Main = (props: { platform?: string }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [lastX, setLastX] = useState<number>(0);
  const { platform } = props;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      if (sidebarRef.current) {
        const deltaX = event.clientX - lastX;
        const newWidth = sidebarRef.current.offsetWidth + deltaX;
        if (newWidth >= 225 && newWidth <= 300) {
          sidebarRef.current.style.width = `${newWidth}px`;
          setLastX(event.clientX);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, lastX]);

  return (
    <WindowContainer>
      <div className={homeContainer}>
        <SidebarWrapper ref={sidebarRef} />
        <div
          role="button"
          className={sidebarDrag}
          tabIndex={0}
          onMouseDown={(e) => {
            setIsResizing(true);
            setLastX(e.clientX);
          }}
          onKeyDown={() => {}}
        >
          <div className={[borderLeft, platform].join(' ')} />
          <div className={borderCenter}>
            <div className={[borderCenterLine, platform].join(' ')} />
          </div>
          <div className={borderRight} />
        </div>
        <Outlet />
        <DataRefresher />
      </div>
    </WindowContainer>
  );
};

const System = () => {
  return <SystemMonitor />;
};

export default function App() {
  const dispatch = useAppDispatch();
  const [sHasSeenSplashscreen, setHasSeenSplashscreen] = useState<boolean>();
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    const callAsync = async () => {
      const hasSeenSplash = await electron.getSetHasSeenSplashscreen();
      setHasSeenSplashscreen(hasSeenSplash ?? false);
      const userSettings = await electron.getSettings();
      setPlatform(userSettings.osPlatform || '');
    };
    callAsync();
  }, []);

  useEffect(() => {
    console.log('App loaded. Initializing...');
    initializeIpcListeners(dispatch);
  }, [dispatch]);

  if (sHasSeenSplashscreen === undefined) {
    console.log(
      'waiting for splash screen value to return... showing loading screen',
    );
    return <></>;
  }

  let initialPage = '/main/nodePackage';
  // electron.getSetHasSeenSplashscreen(false);
  if (sHasSeenSplashscreen === false) {
    initialPage = '/setup';
    console.log('User has not seen the splash screen yet');
  }

  return (
    <ThemeManager>
      <MemoryRouter initialEntries={[initialPage]}>
        <ModalManager />
        <Routes>
          <Route path="/">
            <Route
              index
              path="/setup"
              element={
                <WindowContainer>
                  <NodeSetup />
                </WindowContainer>
              }
            />
            <Route path="/main" element={<Main platform={platform} />}>
              <Route
                path="/main/nodePackage"
                element={
                  <div className={contentContainer}>
                    <NodePackageScreen />
                  </div>
                }
              />
              <Route
                path="/main/node"
                element={
                  <div className={contentContainer}>
                    <NodeScreen />
                  </div>
                }
              />
              <Route path="/main/node/logs" element={<LogsWrapper />} />
              <Route
                path="/main/notification"
                element={
                  <div className={contentContainer}>
                    <NotificationsWrapper />
                  </div>
                }
              />
              <Route
                path="/main/system"
                element={
                  <div className={contentContainer}>
                    <System />
                  </div>
                }
              />
            </Route>
            {/* Using path="*"" means "match anything", so this route
            acts like a catch-all for URLs that we don't have explicit
            routes for. */}
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeManager>
  );
}
