import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const Debugging = ({ isOpen, onClickCloseButton }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sLogs, setLogs] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sGethErrorLogs, setGethErrorLogs] = useState<any>();

  const nodeLogsListener = (message: any) => {
    // console.log(`IPC::nodeLogs:: message received: `, message);
    console.log('sLogs: ', message);
    setLogs((prevState: any) => {
      if (prevState.length < 1000) {
        return [...prevState, message[0]];
      } else {
        return [message[0]];
      }
    });
    // sLogs.push(message);
  };

  const listenForNodeLogs = async () => {
    electron.ipcRenderer.on('nodeLogs', nodeLogsListener);
  };

  useEffect(() => {
    if (isOpen) {
      listenForNodeLogs();
    } else {
      // rerender might register adiitional listeners..
      electron.ipcRenderer.removeAllListeners('nodeLogs');
    }
    return () => electron.ipcRenderer.removeAllListeners('nodeLogs');
  }, [isOpen]);

  return (
    <MenuDrawer
      title="App and Node Logs"
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <h4>Node Logs</h4>
      <div>
        {sLogs.map((log, index) => {
          return <p key={index}>{log}</p>;
        })}
      </div>
    </MenuDrawer>
  );
};
export default Debugging;
