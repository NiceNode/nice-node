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
import { useGetExecutionNodeInfoQuery } from './state/services';
import { detectExecutionClient } from './utils';
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
  const [sNodeInfo, setNodeInfo] = useState(undefined);
  // const [sIsOpenOnLogin, setIsOpenOnLogin] = useState<boolean>(false);
  const sNodeStatus = useAppSelector(selectNodeStatus);
  const dispatch = useAppDispatch();
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);
  const pollingInterval = sIsAvailableForPolling ? 15000 : 0;
  const qNodeInfo = useGetExecutionNodeInfoQuery(null, {
    pollingInterval,
  });

  // const isStartOnLogin = await electron.getStoreValue('isStartOnLogin');
  // console.log('isStartOnLogin: ', isStartOnLogin);
  // setIsOpenOnLogin(isStartOnLogin);

  useEffect(() => {
    console.log('App loaded. Initializing...');
    initializeIpcListeners(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (typeof qNodeInfo?.data === 'string') {
      setNodeInfo(qNodeInfo.data);
    } else {
      setNodeInfo(undefined);
    }
  }, [qNodeInfo]);

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
          <div>
            {sNodeStatus === 'running' && (
              <>
                <h4 data-tip data-for="nodeInfo">
                  {detectExecutionClient(sNodeInfo, true)}
                </h4>
                <ReactTooltip
                  place="bottom"
                  type="light"
                  effect="solid"
                  id="nodeInfo"
                >
                  <span style={{ fontSize: 16 }}>{sNodeInfo}</span>
                </ReactTooltip>
              </>
            )}
          </div>
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
