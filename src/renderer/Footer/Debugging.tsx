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
    if (isOpen) {
      getGethLogs();
      getGethErrorLogs();
    }
  }, [isOpen]);

  return (
    <MenuDrawer
      title="App and Node Logs"
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <h4>Geth Info Logs</h4>
      <ReactJson
        style={{ overflow: 'auto', maxHeight: '80%' }}
        src={{ logs: sLogs }}
        theme="monokai"
        displayDataTypes={false}
        enableClipboard={false}
        collapsed
      />
      <h4>Geth Error Logs</h4>
      <ReactJson
        style={{ overflow: 'auto', maxHeight: '80%' }}
        src={{ logs: sGethErrorLogs }}
        theme="monokai"
        displayDataTypes={false}
        enableClipboard={false}
        collapsed
      />
    </MenuDrawer>
  );
};
export default Debugging;
