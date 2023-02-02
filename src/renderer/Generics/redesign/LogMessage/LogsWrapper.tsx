import { useCallback, useEffect, useState } from 'react';
import electron from '../../../electronGlobal';
import { LogWithMetadata } from '../../../../main/util/nodeLogUtils';
import { useAppSelector } from '../../../state/hooks';
import { selectSelectedNodeId } from '../../../state/node';

import { Logs } from './Logs';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';

const LogsWrapper = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const [sLogs, setLogs] = useState<LogWithMetadata[]>([]);

  const nodeLogsListener = (message: LogWithMetadata[]) => {
    setLogs((prevState) => {
      if (prevState.length < 1000) {
        return [...prevState, message[0]];
      }
      return [message[0]];
    });
  };

  const listenForNodeLogs = useCallback(async () => {
    electron.ipcRenderer.on('nodeLogs', nodeLogsListener);
  }, []);

  useEffect(() => {
    console.log('LogsWrapper: isOpen. Listening for logs.');
    listenForNodeLogs();
    return () => {
      setLogs([]);
      electron.ipcRenderer.removeAllListeners('nodeLogs');
    };
  }, [listenForNodeLogs]);

  useEffect(() => {
    // when switching selected nodes...
    // if none selected, send stop
    // if one is selected, ask for those logs
    setLogs([]);
    console.log('LogsWrapper: isOpen, sSelectedNodeId changed. Clear logs.');
    if (sSelectedNodeId) {
      electron.sendNodeLogs(sSelectedNodeId);
      console.log(
        'LogsWrapper: isOpen && sSelectedNodeId truthy. Send selected node logs'
      );
    } else {
      console.log(
        'LogsWrapper: isOpen && sSelectedNodeId falsy. stopSendingNodeLogs'
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
