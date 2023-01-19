import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';
import NotificationsWrapper from './Presentational/Notifications/NotificationsWrapper';

import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import { initialize as initializeIpcListeners } from './ipc';
import NodeScreen from './NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import { SidebarWrapper } from './Presentational/SidebarWrapper/SidebarWrapper';
import NNSplash from './Presentational/NNSplashScreen/NNSplashScreen';
import { dragWindowContainer } from './app.css';
import ThemeManager from './ThemeManager';
import { Modal } from './Generics/redesign/Modal/Modal';
import AddNodeStepper from './Presentational/AddNodeStepper/AddNodeStepper';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

const MainScreen = () => {
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
  if (sHasSeenSplashscreen === false) {
    console.log('User has not seen the splash screen yet');
  }

  return (
    <ThemeManager>
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
              width: '100%',
              height: '100%',
            }}
          >
            <SidebarWrapper />
            <div style={{ flex: 1, overflow: 'auto' }}>
              {/* <NodeScreen /> */}
              <NotificationsWrapper />
            </div>
          </div>

          <DataRefresher />
          {/* Todo: remove this when Modal Manager is created */}
          <Modal
            title=""
            isOpen={sIsModalOpenAddNode}
            onClickCloseButton={() => setIsModalOpenAddNode(false)}
            isFullScreen
          >
            <AddNodeStepper
              onChange={(newValue: 'done' | 'cancel') => {
                console.log(newValue);
                if (newValue === 'done' || newValue === 'cancel') {
                  setIsModalOpenAddNode(false);
                }
              }}
            />
          </Modal>
        </>
      )}
    </ThemeManager>
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
