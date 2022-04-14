import { VscDebugConsole } from 'react-icons/vsc';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { MdSettings } from 'react-icons/md';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import IconButton from '../IconButton';
import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';

const Footer = () => {
  const [sSelectedMenuDrawer, setSelectedMenuDrawer] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sLogs, setLogs] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sGethErrorLogs, setGethErrorLogs] = useState<any>();
  const [sGethDeleteResult, setGethDeleteResult] = useState<boolean>();

  const getGethLogs = async () => {
    const gethLogs = await electron.getGethLogs();
    setLogs(gethLogs);
  };
  const getGethErrorLogs = async () => {
    const gethLogs = await electron.getGethErrorLogs();
    setGethErrorLogs(gethLogs);
  };

  useEffect(() => {
    getGethLogs();
    getGethErrorLogs();
  }, []);

  useEffect(() => {
    if (sSelectedMenuDrawer === 'debugging') {
      getGethLogs();
      getGethErrorLogs();
    }
  }, [sSelectedMenuDrawer]);

  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <IconButton
        type="button"
        onClick={() => {
          setSelectedMenuDrawer(
            sSelectedMenuDrawer === 'settings' ? undefined : 'settings'
          );
        }}
        style={{
          borderBottom:
            sSelectedMenuDrawer === 'settings' ? '2px solid' : 'none',
          borderTop: sSelectedMenuDrawer === 'settings' ? '2px solid' : 'none',
        }}
      >
        <MdSettings />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => {
          setSelectedMenuDrawer(
            sSelectedMenuDrawer === 'monitoring' ? undefined : 'monitoring'
          );
        }}
        style={{
          borderBottom:
            sSelectedMenuDrawer === 'monitoring' ? '2px solid' : 'none',
          borderTop:
            sSelectedMenuDrawer === 'monitoring' ? '2px solid' : 'none',
        }}
      >
        <AiOutlineAreaChart />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => {
          setSelectedMenuDrawer(
            sSelectedMenuDrawer === 'debugging' ? undefined : 'debugging'
          );
        }}
        style={{
          borderBottom:
            sSelectedMenuDrawer === 'debugging' ? '2px solid' : 'none',
          borderTop: sSelectedMenuDrawer === 'debugging' ? '2px solid' : 'none',
        }}
      >
        <VscDebugConsole />
      </IconButton>
      <MenuDrawer
        title="App and Node Logs"
        isSelected={sSelectedMenuDrawer === 'debugging'}
        onClickCloseButton={() => setSelectedMenuDrawer(undefined)}
      >
        <h4>Geth Info Logs</h4>
        <ReactJson
          src={{ logs: sLogs }}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
          style={{ overflow: 'auto', maxHeight: '80%' }}
        />
        <h4>Geth Error Logs</h4>
        <ReactJson
          src={{ logs: sGethErrorLogs }}
          style={{ overflow: 'auto', maxHeight: '80%' }}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
        />
      </MenuDrawer>
      <MenuDrawer
        title="Settings"
        isSelected={sSelectedMenuDrawer === 'settings'}
        onClickCloseButton={() => setSelectedMenuDrawer(undefined)}
      >
        <h2>Storage</h2>
        <div>
          <h3>Delete node data</h3>
          <p>
            Your node requires this data to run and will require time and
            internet data to recover if deleted. Only delete node data if you do
            not intend to run a node.
          </p>
          <button
            type="button"
            onClick={async () => {
              console.log('Deleting Geth Data');
              // clear result while waiting for delete to return
              setGethDeleteResult(undefined);
              setGethDeleteResult(await electron.deleteGethDisk());
            }}
            style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
          >
            <span>Delete</span>
          </button>
          {sGethDeleteResult !== undefined && (
            <>
              {sGethDeleteResult ? (
                <span>Delete successful</span>
              ) : (
                <span>Delete failed</span>
              )}
            </>
          )}
        </div>
      </MenuDrawer>
      <MenuDrawer
        title="Monitoring"
        isSelected={sSelectedMenuDrawer === 'monitoring'}
        onClickCloseButton={() => setSelectedMenuDrawer(undefined)}
      >
        <div style={{ flex: 1, overflow: 'auto' }}>Monitoring</div>
      </MenuDrawer>
    </div>
  );
};
export default Footer;
