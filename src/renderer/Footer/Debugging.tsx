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

  const getGethLogs = async () => {
    // electron.ipcRenderer.on('nodeLogs', (message: any) => {
    //   // console.log(`IPC::nodeLogs:: message received: `, message);
    //   console.log('sLogs: ', sLogs);
    //   // setLogs([...sLogs, message[0]]);
    //   sLogs.push(message);
    // });
  };
  const getGethErrorLogs = async () => {
    const gethLogs = await electron.getGethErrorLogs();
    setGethErrorLogs(gethLogs);
  };

  useEffect(() => {
    getGethLogs();
    getGethErrorLogs();
  }, []);

  // useEffect(() => {
  //   if (isOpen) {
  //     getGethLogs();
  //     getGethErrorLogs();
  //   }
  // }, [isOpen]);

  return (
    <MenuDrawer
      title="App and Node Logs"
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <h4>Node Logs</h4>
      <div>{JSON.stringify(sLogs, null, 4)}</div>
    </MenuDrawer>
  );
};
export default Debugging;
