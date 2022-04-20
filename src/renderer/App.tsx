import { useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';
import ReactTooltip from 'react-tooltip';
import { useAppDispatch, useAppSelector } from './state/hooks';

import electron from './electronGlobal';
import './App.css';

import Header from './Header';
import Footer from './Footer/Footer';
import Warnings from './Warnings';
import { useGetExecutionNodeInfoQuery } from './state/services';
import { detectExecutionClient } from './utils';
import { initialize as initializeIpcListeners } from './ipc';
import { selectNodeStatus, updateNodeStatus } from './state/node';
import { NODE_STATUS } from './messages';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

// start services to poll node, os, etc.?

const MainScreen = () => {
  const [sNodeInfo, setNodeInfo] = useState(undefined);
  const [sIsOpenOnLogin, setIsOpenOnLogin] = useState<boolean>(false);
  const sNodeStatus = useAppSelector(selectNodeStatus);
  const dispatch = useAppDispatch();

  const qNodeInfo = useGetExecutionNodeInfoQuery(null, {
    pollingInterval: 15000,
  });

  const refreshGethStatus = useCallback(async () => {
    const status = await electron.getGethStatus();
    dispatch(updateNodeStatus(status));
    const isStartOnLogin = await electron.getStoreValue('isStartOnLogin');
    console.log('isStartOnLogin: ', isStartOnLogin);
    setIsOpenOnLogin(isStartOnLogin);
  }, [dispatch]);

  useEffect(() => {
    console.log('App loaded. Initializing...');
    initializeIpcListeners(dispatch);
    refreshGethStatus();
  }, [dispatch, refreshGethStatus]);

  useEffect(() => {
    if (typeof qNodeInfo?.data === 'string') {
      setNodeInfo(qNodeInfo.data);
    } else {
      setNodeInfo(undefined);
    }
  }, [qNodeInfo]);

  // Wait for message that says Geth is ready to start

  const onClickStartGeth = async () => {
    // Send message to main process to start Geth
    await electron.startGeth();
    refreshGethStatus();
  };

  const onClickStopGeth = async () => {
    // Send message to main process to start Geth
    await electron.stopGeth();
    refreshGethStatus();
  };

  const onChangeOpenOnLogin = (openOnLogin: boolean) => {
    electron.setStoreValue('isStartOnLogin', openOnLogin);
    setIsOpenOnLogin(openOnLogin);
  };

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
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <div>
          <h2>An Ethereum Node</h2>
          <h3>Status: {sNodeStatus}</h3>
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
        <div className="Hello">
          <button
            type="button"
            onClick={onClickStartGeth}
            disabled={
              !(
                sNodeStatus === NODE_STATUS.readyToStart ||
                sNodeStatus === NODE_STATUS.stopped ||
                sNodeStatus === NODE_STATUS.errorStopping
              )
            }
          >
            <span>Start</span>
          </button>
          &nbsp;
          <button
            type="button"
            onClick={onClickStopGeth}
            disabled={sNodeStatus !== NODE_STATUS.running}
          >
            <span>Stop</span>
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            marginBottom: 10,
          }}
        >
          <form>
            <label htmlFor="openOnLogin">
              <input
                id="openOnLogin"
                type="checkbox"
                name="openOnLogin"
                checked={sIsOpenOnLogin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeOpenOnLogin(e.target.checked)
                }
              />
              Start when your computer starts (Windows and macOS only)
            </label>

            {/* <label htmlFor="openOnLogin">Start when your computer starts</label> */}
          </form>
        </div>
        <Warnings />
      </div>
      <Footer />
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
