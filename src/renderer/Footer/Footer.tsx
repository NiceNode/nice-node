import { VscDebugConsole } from 'react-icons/vsc';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { MdSettings } from 'react-icons/md';
import { FaDocker } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import IconButton from '../IconButton';
import Monitoring from './Monitoring';
import Debugging from './Debugging';
import electron from '../electronGlobal';
import DynamicSettings from './DynamicSettings';
import Docker from './Docker';
import { useGetIsDockerInstalledQuery } from '../state/settingsService';

export const FOOTER_HEIGHT = 64;

const Footer = () => {
  const [sSelectedMenuDrawer, setSelectedMenuDrawer] = useState<string>();
  const [sNiceNodeVersion, setNiceNodeVersion] = useState<string>();
  const qIsDockerInstalled = useGetIsDockerInstalledQuery();
  const isDockerInstalled = qIsDockerInstalled?.data;

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
        height: FOOTER_HEIGHT,
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
      {!isDockerInstalled && (
        <IconButton
          type="button"
          onClick={() => {
            setSelectedMenuDrawer(
              sSelectedMenuDrawer === 'docker' ? undefined : 'docker'
            );
          }}
          style={{
            borderBottom:
              sSelectedMenuDrawer === 'docker' ? '2px solid' : 'none',
            borderTop: sSelectedMenuDrawer === 'docker' ? '2px solid' : 'none',
          }}
        >
          <FaDocker />
        </IconButton>
      )}
      <div style={{ position: 'fixed', right: 10, fontSize: 14 }}>
        <span>v{sNiceNodeVersion}</span>
      </div>

      <Debugging
        isOpen={sSelectedMenuDrawer === 'debugging'}
        onClickCloseButton={onCloseDrawer}
      />

      <DynamicSettings
        isOpen={sSelectedMenuDrawer === 'settings'}
        onClickCloseButton={onCloseDrawer}
      />

      <Monitoring
        isOpen={sSelectedMenuDrawer === 'monitoring'}
        onClickCloseButton={onCloseDrawer}
      />

      {!isDockerInstalled && (
        <Docker
          isOpen={sSelectedMenuDrawer === 'docker'}
          onClickCloseButton={onCloseDrawer}
        />
      )}
    </div>
  );
};
export default Footer;
