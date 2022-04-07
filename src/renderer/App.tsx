import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';

import { CHANNELS } from './messages';
import electron from './electronGlobal';
import './App.css';

import Header from './Header';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

const MainScreen = () => {
  const [sStatus, setStatus] = useState('loading...');
  const [sGethDiskUsed, setGethDiskUsed] = useState<number>();
  const [sFreeDisk, setFreeDisk] = useState<number>();
  const [sStorageWarning, setStorageWarning] = useState<boolean>();
  const [sIsOpenOnLogin, setIsOpenOnLogin] = useState<boolean>(false);

  const refreshGethStatus = async () => {
    const status = await electron.getGethStatus();
    setStatus(status);
    const isStartOnLogin = await electron.getStoreValue('isStartOnLogin');
    console.log('isStartOnLogin: ', isStartOnLogin);
    setIsOpenOnLogin(isStartOnLogin);
  };

  useEffect(() => {
    console.log('App loaded. Initializing...');
    electron.ipcRenderer.on(CHANNELS.geth, (message) => {
      console.log('Geth status received: ', message);
      setStatus(message);
    });

    refreshGethStatus();
  }, []);

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

  useEffect(() => {
    const updateGethDiskUsed = async () => {
      const gethDiskUsed = await electron.getGethDiskUsed();
      if (gethDiskUsed) {
        setGethDiskUsed(gethDiskUsed);
      }
    };
    updateGethDiskUsed();
    const intveral = setInterval(updateGethDiskUsed, 30000);
    return () => clearInterval(intveral);
  }, []);

  useEffect(() => {
    const updateFreeDisk = async () => {
      const freeDisk = await electron.getSystemFreeDiskSpace();
      if (freeDisk) {
        setFreeDisk(freeDisk);
      }
    };
    updateFreeDisk();
    const intveral = setInterval(updateFreeDisk, 30000);
    return () => clearInterval(intveral);
  }, []);

  useEffect(() => {
    if (sFreeDisk !== undefined && sGethDiskUsed !== undefined) {
      if (sGethDiskUsed + sFreeDisk > 1000) {
        setStorageWarning(false);
      } else {
        setStorageWarning(true);
      }
    }
  }, [sFreeDisk, sGethDiskUsed]);

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
          <h3>Status: {sStatus}</h3>
        </div>
        <div className="Hello">
          <button
            type="button"
            onClick={onClickStartGeth}
            disabled={sStatus === 'running'}
          >
            <span>Start</span>
          </button>
          &nbsp;
          <button type="button" onClick={onClickStopGeth}>
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
        <div>
          {sGethDiskUsed !== undefined && (
            <h4>Storage used by node: {sGethDiskUsed.toFixed(1)} GB</h4>
          )}
          {sFreeDisk !== undefined && (
            <h4>Storage available: {sFreeDisk.toFixed(1)} GB</h4>
          )}
        </div>
        {sStorageWarning && (
          <div
            style={{
              maxWidth: 400,
              background: 'rgb(255, 255, 204)',
              borderRadius: 5,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <p style={{ color: '#333333' }}>
              Warning: At least 1 TB of storage is required to run an Ethereum
              Node. Your computer does not have enough SSD storage space. Please
              visit ethereum.org to see computer hardware requirements at
              <a href="https://ethereum.org/en/run-a-node/#build-your-own">
                ethereum.org/run-a-node
              </a>
            </p>
          </div>
        )}
      </div>
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
