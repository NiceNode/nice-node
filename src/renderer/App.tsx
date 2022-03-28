import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CHANNELS } from './messages';
import './App.css';

const MainScreen = () => {
  const [sStatus, setStatus] = useState('loading...');

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

  return (
    <div>
      <div>
        <h1>NiceNode</h1>
        <h3>Status: {sStatus}</h3>
      </div>
      <div className="Hello">
        <button type="button" onClick={onClickStartGeth}>
          <span>Start Geth</span>
        </button>
        <button type="button" onClick={onClickStopGeth}>
          <span>Stop Geth</span>
        </button>
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
