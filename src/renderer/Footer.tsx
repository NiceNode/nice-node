import { VscDebugConsole } from 'react-icons/vsc';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { MdSettings } from 'react-icons/md';
import { CgCloseO } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactJson from 'react-json-view';

import IconButton from './IconButton';
import electron from './electronGlobal';

const MenuDrawer = styled.div`
  display: box;
  &.show {
    bottom: 64px;
  }
  &.hidde {
    bottom: calc(-100vh - 64px);
  }
  position: fixed;
  width: 100vw;
  // height of screen - footer height - header height
  height: calc(100vh - 64px - 48px);
  transition: bottom 0.2s ease-out 0s;
  background: linear-gradient(
    -160.96deg,
    #7a2c9e -29.09%,
    #dd5789 51.77%,
    #fedc2a 129.35%
  );
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const Footer = () => {
  const [sSelectedMenuDrawer, setSelectedMenuDrawer] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sLogs, setLogs] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sGethErrorLogs, setGethErrorLogs] = useState<any>();

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
        className={sSelectedMenuDrawer === 'debugging' ? 'show' : 'hidde'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              type="button"
              onClick={() => {
                setSelectedMenuDrawer(undefined);
              }}
            >
              <CgCloseO />
            </IconButton>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <h4>Geth Info Logs</h4>
            <ReactJson
              src={{ logs: sLogs }}
              theme="monokai"
              displayDataTypes={false}
              enableClipboard={false}
            />
            <h4>Geth Error Logs</h4>
            <ReactJson
              src={{ logs: sGethErrorLogs }}
              theme="monokai"
              displayDataTypes={false}
              enableClipboard={false}
            />
          </div>
        </div>
      </MenuDrawer>
      <MenuDrawer
        className={sSelectedMenuDrawer === 'settings' ? 'show' : 'hidde'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              type="button"
              onClick={() => {
                setSelectedMenuDrawer(undefined);
              }}
            >
              <CgCloseO />
            </IconButton>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>Settings</div>
        </div>
      </MenuDrawer>
    </div>
  );
};
export default Footer;
