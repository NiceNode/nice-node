import { useEffect, useState } from 'react';
import type { LogWithMetadata } from '../../../main/util/nodeLogUtils';
import electron from '../../electronGlobal';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNodeId } from '../../state/node';

import { CHANNELS } from '../../../main/messenger';
import { Logs } from '../Logs/Logs';

const LogsWrapper = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const [sLogs, setLogs] = useState<LogWithMetadata[]>([]);

  useEffect(() => {
    const nodeLogsListener = (message: LogWithMetadata[]) => {
      setLogs((prevState) => {
        if (prevState.length < 1000) {
          return [...prevState, message[0]];
        }
        return [message[0]];
      });
    };
    console.log('LogsWrapper: isOpen. Listening for logs.');
    electron.ipcRenderer.on(CHANNELS.nodeLogs, nodeLogsListener);
    return () => {
      setLogs([]);
      electron.ipcRenderer.removeAllListeners(CHANNELS.nodeLogs);
    };
  }, []);

  useEffect(() => {
    // when switching selected nodes...
    // if none selected, send stop
    // if one is selected, ask for those logs
    setLogs([]);
    console.log('LogsWrapper: isOpen, sSelectedNodeId changed. Clear logs.');
    if (sSelectedNodeId) {
      electron.sendNodeLogs(sSelectedNodeId);
      console.log(
        'LogsWrapper: isOpen && sSelectedNodeId truthy. Send selected node logs',
      );
    } else {
      console.log(
        'LogsWrapper: isOpen && sSelectedNodeId falsy. stopSendingNodeLogs',
      );
      electron.stopSendingNodeLogs();
    }
    return () => {
      electron.stopSendingNodeLogs();
    };
  }, [sSelectedNodeId]);

  return <Logs sLogs={sLogs} />;
};

export default LogsWrapper;
