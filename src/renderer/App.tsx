import { useEffect, useState } from 'react';
import {
  MemoryRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';
import NotificationsWrapper from './Presentational/Notifications/NotificationsWrapper';
import SystemMonitor from './Presentational/SystemMonitor/SystemMonitor';

import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import { initialize as initializeIpcListeners } from './ipc';
import NodeScreen from './NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';
import NNSplash from './Presentational/NNSplashScreen/NNSplashScreen';
import {
  dragWindowContainer,
  homeContainer,
  contentContainer,
} from './app.css';
import ThemeManager from './ThemeManager';
import { Modal } from './Generics/redesign/Modal/Modal';
import AddNodeStepper from './Presentational/AddNodeStepper/AddNodeStepper';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

const WindowContainer = ({ children }) => {
  return (
    <>
      <div className={dragWindowContainer} />
      {children}
    </>
  );
};

const NodeSetup = () => {
  return (
    <WindowContainer>
      <NNSplash />
    </WindowContainer>
  );
};

const Main = () => {
  return (
    <WindowContainer>
      <div className={homeContainer}>
        <SidebarWrapper />
        <div className={contentContainer}>
          <Outlet />
        </div>
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
  const [sHasClickedGetStarted, setHasClickedGetStarted] = useState<boolean>();
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>();

  // const isStartOnLogin = await electron.getStoreValue('isStartOnLogin');
  // console.log('isStartOnLogin: ', isStartOnLogin);
  // setIsOpenOnLogin(isStartOnLogin);

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

  const onClickSplashGetStarted = () => {
    setHasSeenSplashscreen(true);
    electron.getSetHasSeenSplashscreen(true);
    setHasClickedGetStarted(true);
    setIsModalOpenAddNode(true);
  };

  // const onChangeOpenOnLogin = (openOnLogin: boolean) => {
  //   electron.setStoreValue('isStartOnLogin', openOnLogin);
  //   setIsOpenOnLogin(openOnLogin);
  // };
  if (sHasSeenSplashscreen === undefined) {
    console.log(
      'waiting for splash screen value to return... showing loading screen'
    );
    return <></>;
  }

  let initialPage = '/main/node';
  if (sHasSeenSplashscreen === false) {
    initialPage = '/setup';
    console.log('User has not seen the splash screen yet');
  }

  return (
    <ThemeManager>
      <MemoryRouter initialEntries={[initialPage]}>
        <Routes>
          <Route path="/">
            <Route index path="/setup" element={<NodeSetup />} />
            <Route path="/main" element={<Main />}>
              <Route path="/main/node" element={<NodeScreen />} />
              <Route
                path="/main/notification"
                element={<NotificationsWrapper />}
              />
              <Route path="/main/system" element={<System />} />
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
