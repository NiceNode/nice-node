import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';
import ReactTooltip from 'react-tooltip';

import './App.css';
import { useAppDispatch, useAppSelector } from './state/hooks';
import electron from './electronGlobal';
import Header from './Header';
import Footer from './Footer/Footer';
import Warnings from './Warnings';
import { initialize as initializeIpcListeners } from './ipc';
import { selectIsAvailableForPolling, selectNodeStatus } from './state/node';
import LeftSideBar from './LeftSideBar';
import NodeScreen from './NodeScreen';
import DataRefresher from './DataRefresher';
// import { useGetNodesQuery } from './state/nodeService';

// Sentry.init({
//   dsn: electron.SENTRY_DSN,
//   debug: true,
// });

const MainScreen = () => {
  const dispatch = useAppDispatch();

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <LeftSideBar />

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
