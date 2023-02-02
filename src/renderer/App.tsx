import React, { useEffect, useState } from 'react';
import {
  MemoryRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';
import NotificationsWrapper from './Presentational/Notifications/NotificationsWrapper';
import SystemMonitor from './Presentational/SystemMonitor/SystemMonitor';

import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import { initialize as initializeIpcListeners } from './ipc';
import NodeScreen from './Presentational/NodeScreen/NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';
import LogsWrapper from './Generics/redesign/LogMessage/LogsWrapper';
import NodeSetup from './Presentational/NodeSetup/NodeSetup';
import {
  dragWindowContainer,
  homeContainer,
  contentContainer,
} from './app.css';
import ThemeManager from './ThemeManager';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

export const ModalContext = React.createContext({
  isOpen: false,
  toggle: () => {},
});

const WindowContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={dragWindowContainer} />
      {children}
    </>
  );
};

const Main = () => {
  return (
    <WindowContainer>
      <div className={homeContainer}>
        <SidebarWrapper />
        <Outlet />
        <DataRefresher />
      </div>
    </WindowContainer>
  );
};

const System = () => {
  return <SystemMonitor />;
};

const ModalManager = () => {
  const { isOpen, toggle } = React.useContext(ModalContext);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: 'white',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '1rem',
        }}
      >
        <div>test</div>
        <button onClick={toggle}>Close</button>
      </div>
    </div>
  );
};

export default function App() {
  const dispatch = useAppDispatch();
  const [sHasSeenSplashscreen, setHasSeenSplashscreen] = useState<boolean>();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const callAsync = async () => {
      const hasSeen = await electron.getSetHasSeenSplashscreen();
      setHasSeenSplashscreen(hasSeen ?? false);
    };
    callAsync();
  }, []);

  useEffect(() => {
    console.log('App loaded. Initializing...');
    initializeIpcListeners(dispatch);
  }, [dispatch]);

  if (sHasSeenSplashscreen === undefined) {
    console.log(
      'waiting for splash screen value to return... showing loading screen'
    );
    return <></>;
  }

  let initialPage = '/main/node';
  // electron.getSetHasSeenSplashscreen(false);
  if (sHasSeenSplashscreen === false) {
    initialPage = '/setup';
    console.log('User has not seen the splash screen yet');
  }

  return (
    <ModalContext.Provider
      value={{ isOpen: isModalOpen, toggle: () => setModalOpen(!isModalOpen) }}
    >
      <ThemeManager>
        <MemoryRouter initialEntries={[initialPage]}>
          {isModalOpen && <ModalManager />}
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
              <Route path="/main" element={<Main />}>
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
    </ModalContext.Provider>
  );
}
