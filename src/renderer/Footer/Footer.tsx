import { VscDebugConsole } from 'react-icons/vsc';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { MdSettings } from 'react-icons/md';
import { useEffect, useState } from 'react';

import IconButton from '../IconButton';
import Settings from './Settings';
import Monitoring from './Monitoring';
import Debugging from './Debugging';
import electron from '../electronGlobal';

const Footer = () => {
  const [sSelectedMenuDrawer, setSelectedMenuDrawer] = useState<string>();
  const [sNiceNodeVersion, setNiceNodeVersion] = useState<string>();

  const onCloseDrawer = () => {
    setSelectedMenuDrawer(undefined);
  };

  const getNiceNodeVersion = async () => {
    const debugInfo = await electron.getDebugInfo();
    if (
      debugInfo?.niceNodeVersion &&
      typeof debugInfo.niceNodeVersion === 'string'
    ) {
      setNiceNodeVersion(debugInfo.niceNodeVersion);
    }
  };

  useEffect(() => {
    getNiceNodeVersion();
  }, []);

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
      <div style={{ position: 'fixed', right: 10, fontSize: 14 }}>
        <span>v{sNiceNodeVersion}</span>
      </div>

      <Debugging
        isOpen={sSelectedMenuDrawer === 'debugging'}
        onClickCloseButton={onCloseDrawer}
      />

      <Settings
        isOpen={sSelectedMenuDrawer === 'settings'}
        onClickCloseButton={onCloseDrawer}
      />

      <Monitoring
        isOpen={sSelectedMenuDrawer === 'monitoring'}
        onClickCloseButton={onCloseDrawer}
      />
    </div>
  );
};
export default Footer;
