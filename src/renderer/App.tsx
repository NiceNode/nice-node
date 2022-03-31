import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CHANNELS } from './messages';
import electron from './electronGlobal';
import './App.css';

import { ethers } from './ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getGethDataInterval: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hexToDecimal = (hex: any) => parseInt(hex, 16);

const MainScreen = () => {
  const [sStatus, setStatus] = useState('loading...');
  const [sGethDiskUsed, setGethDiskUsed] = useState<number>();
  const [sFreeDisk, setFreeDisk] = useState<number>();
  const [sStorageWarning, setStorageWarning] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();

  const refreshGethStatus = async () => {
    const status = await electron.getGethStatus();
    setStatus(status);
  };

  const refreshGethData = async () => {
    getGethDataInterval = setInterval(async () => {
      try {
        console.log(window.origin);
        const provider = new ethers.providers.WebSocketProvider(
          'ws://localhost:8546'
        );
        console.log('curr block: ', await provider.getBlockNumber());
        console.log('curr network: ', await provider.getNetwork());
        console.log(
          'curr eth_blockNumber: ',
          await provider.send('eth_blockNumber')
        );
        const syncingData = await provider.send('eth_syncing');
        console.log('curr sync: ', syncingData);
        if (typeof syncingData === 'object') {
          const syncRatio = syncingData.currentBlock / syncingData.highestBlock;
          setSyncPercent((syncRatio * 100).toFixed(1));
        } else {
          setSyncPercent('');
        }
        // console.log('curr admin peers: ', await provider.send('admin_peers'));
        const numPeers = await provider.send('net_peerCount');
        console.log('curr net peers: ', numPeers);
        setPeers(hexToDecimal(numPeers));
      } catch (err) {
        console.error('error getting curr block: ', err);
      }
    }, 10000);
  };

  useEffect(() => {
    console.log('App loaded. Initializing...');
    electron.ipcRenderer.on(CHANNELS.geth, (message) => {
      console.log('Geth status received: ', message);
      setStatus(message);
    });
    refreshGethStatus();
  }, []);

  useEffect(() => {
    if (sStatus === 'running') {
      refreshGethData();
    } else {
      setPeers(undefined);
      clearInterval(getGethDataInterval);
    }
  }, [sStatus]);

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
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 350,
          }}
        >
          <span>
            <strong>Node: </strong>
          </span>
          {sSyncPercent && <span>{sSyncPercent}% blocks synced</span>}
          {sPeers !== undefined && <span>{sPeers} peer node(s)</span>}
        </div>
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
