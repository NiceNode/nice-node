import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/electron/renderer';

import { CHANNELS } from './messages';
import electron from './electronGlobal';
import './App.css';

import Header from './Header';
import Footer from './Footer/Footer';
import Warnings from './Warnings';

Sentry.init({
  dsn: electron.SENTRY_DSN,
  debug: true,
});

// start services to poll node, os, etc.?

const MainScreen = () => {
  const [sStatus, setStatus] = useState('loading...');
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
