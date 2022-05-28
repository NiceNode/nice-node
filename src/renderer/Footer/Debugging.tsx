import { useEffect, useState } from 'react';
import { useAppSelector } from '../state/hooks';
import { selectSelectedNode, selectSelectedNodeId } from '../state/node';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const Debugging = ({ isOpen, onClickCloseButton }: Props) => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const sSelectedNode = useAppSelector(selectSelectedNode);
  const [sLogs, setLogs] = useState<string[]>([]);

  const nodeLogsListener = (message: any) => {
    // console.log('sLogs: ', message);
    setLogs((prevState: any) => {
      if (prevState.length < 1000) {
        return [...prevState, message[0]];
      } else {
        return [message[0]];
      }
    });
  };

  const listenForNodeLogs = async () => {
    electron.ipcRenderer.on('nodeLogs', nodeLogsListener);
  };

  useEffect(() => {
    if (isOpen) {
      console.log('Debugging.tsx: isOpen. Listening for logs.');
      listenForNodeLogs();
    } else {
      setLogs([]);
      console.log(
        'Debugging.tsx: isclosed. Clear logs and removeAllListeners.'
      );
      electron.ipcRenderer.removeAllListeners('nodeLogs');
    }
    return () => electron.ipcRenderer.removeAllListeners('nodeLogs');
  }, [isOpen]);

  useEffect(() => {
    // when switching selected nodes...
    // if none selected, send stop
    // if one is selected, ask for those logs
    setLogs([]);
    console.log('Debugging.tsx: isOpen, sSelectedNodeId changed. Clear logs.');
    if (isOpen && sSelectedNodeId) {
      electron.sendNodeLogs(sSelectedNodeId);
      console.log(
        'Debugging.tsx: isOpen && sSelectedNodeId truthy. Send selected node logs'
      );
    } else {
      console.log(
        'Debugging.tsx: isOpen && sSelectedNodeId falsy. stopSendingNodeLogs'
      );
      electron.stopSendingNodeLogs();
    }
    return () => {
      electron.stopSendingNodeLogs();
    };
  }, [isOpen, sSelectedNodeId]);

  return (
    <MenuDrawer
      title={`${sSelectedNode?.spec.displayName} Logs`}
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      {/* <h4>Node Logs</h4> */}
      <em>Newest logs at the top</em>
      <div
        style={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        {sLogs.map((log, index) => {
          return <p key={index}>{log}</p>;
        })}
      </div>
    </MenuDrawer>
  );
};
export default Debugging;
