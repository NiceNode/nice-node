import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';

import './Generics/redesign/globalStyle.css';
import './reset.css';
import { useAppDispatch } from './state/hooks';
import Footer from './Footer/Footer';
import Warnings from './Warnings';
import { initialize as initializeIpcListeners } from './ipc';
// import LeftSideBar from './LeftSideBar';
import NodeScreen from './NodeScreen';
import DataRefresher from './DataRefresher';
import electron from './electronGlobal';
import Sidebar from './Presentational/Sidebar/Sidebar';
import { darkTheme, lightTheme } from './Generics/redesign/theme.css';
import { dragWindowContainer } from './app.css';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

const MainScreen = () => {
  const dispatch = useAppDispatch();
  const [isDarkTheme] = useState(false);

  // const isStartOnLogin = await electron.getStoreValue('isStartOnLogin');
  // console.log('isStartOnLogin: ', isStartOnLogin);
  // setIsOpenOnLogin(isStartOnLogin);

  useEffect(() => {
    console.log('App loaded. Initializing...');
    initializeIpcListeners(dispatch);
  }, [dispatch]);

  // const onChangeOpenOnLogin = (openOnLogin: boolean) => {
  //   electron.setStoreValue('isStartOnLogin', openOnLogin);
  //   setIsOpenOnLogin(openOnLogin);
  // };

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
      <div className={dragWindowContainer} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        {/* <LeftSideBar /> */}
        <Sidebar offline={false} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <NodeScreen />
          <Warnings />
        </div>
      </div>

      <Footer />
      <DataRefresher />
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
