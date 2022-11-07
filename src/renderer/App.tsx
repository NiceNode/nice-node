import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';

import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import Footer from './Footer/Footer';
import { initialize as initializeIpcListeners } from './ipc';
// import LeftSideBar from './LeftSideBar';
import NodeScreen from './NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import Sidebar from './Presentational/Sidebar/Sidebar';
import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';
import { darkTheme, lightTheme } from './Generics/redesign/theme.css';
import NNSplash from './Presentational/NNSplashScreen/NNSplashScreen';
import { dragWindowContainer } from './app.css';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

const MainScreen = () => {
  const dispatch = useAppDispatch();
  const [isDarkTheme] = useState(false);
  const [sHasSeenSplashscreen, setHasSeenSplashscreen] = useState<boolean>();
  const [sHasClickedGetStarted, setHasClickedGetStarted] = useState<boolean>();

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
  if (sHasSeenSplashscreen === false) {
    console.log('User has not seen the splash screen yet');
  }

  return (
    <div
      id="onBoarding"
      className={isDarkTheme ? darkTheme : lightTheme}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      {sHasSeenSplashscreen === false ? (
        <>
          {!sHasClickedGetStarted && (
            <NNSplash onClickGetStarted={onClickSplashGetStarted} />
          )}
        </>
      ) : (
        <>
          <div className={dragWindowContainer} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
            }}
          >
            <SidebarWrapper>
              {(sUserNodes) => (
                <Sidebar
                  offline={false}
                  updateAvailable={false}
                  sUserNodes={sUserNodes}
                />
              )}
            </SidebarWrapper>

            <NodeScreen />
          </div>

          <Footer />
          <DataRefresher />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
      </Routes>
    </Router>
  );
}
