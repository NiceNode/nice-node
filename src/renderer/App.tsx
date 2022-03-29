import { useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CHANNELS } from './messages';
import './App.css';

const MainScreen = () => {
  const [sStatus, setStatus] = useState('loading...');
  const [sGethDiskUsed, setGethDiskUsed] = useState<number>();
  const [sFreeDisk, setFreeDisk] = useState<number>();
  const [sStorageWarning, setStorageWarning] = useState<boolean>();

  const refreshGethStatus = async () => {
    const status = await window.electron.getGethStatus();
    setStatus(status);
  };

  useEffect(() => {
    console.log('App loaded. Initializing...');
    window.electron.ipcRenderer.on(CHANNELS.geth, (message) => {
      console.log('Geth status received: ', message);
      setStatus(message);
    });
    refreshGethStatus();
  }, []);

  // Wait for message that says Geth is ready to start

  const onClickStartGeth = async () => {
    // Send message to main process to start Geth
    const status = await window.electron.startGeth();
    refreshGethStatus();
  };

  const onClickStopGeth = async () => {
    // Send message to main process to start Geth
    const status = await window.electron.stopGeth();
    refreshGethStatus();
  };

  useEffect(() => {
    const updateGethDiskUsed = async () => {
      const gethDiskUsed = await window.electron.getGethDiskUsed();
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
      const freeDisk = await window.electron.getSystemFreeDiskSpace();
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

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div>
        <h1>NiceNode</h1>
        <h2>An Ethereum Node</h2>
        <h3>Status: {sStatus}</h3>
      </div>
      <div className="Hello">
        <button type="button" onClick={onClickStartGeth}>
          <span>Start</span>
        </button>
        &nbsp;
        <button type="button" onClick={onClickStopGeth}>
          <span>Stop</span>
        </button>
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
        <div style={{ maxWidth: 400, background: '#666666' }}>
          Warning: At least 1 TB of storage is required to run an Ethereum Node.
          Your computer does not have enough SSD storage space. Please visit
          ethereum.org to see computer hardware requirements at
          <a href="https://ethereum.org/en/run-a-node/#build-your-own">
            ethereum.org/run-a-node
          </a>
        </div>
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
