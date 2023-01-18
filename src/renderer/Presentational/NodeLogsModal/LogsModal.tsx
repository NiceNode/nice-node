import { useCallback, useEffect, useState } from 'react';
import electron from '../../electronGlobal';
import { LogWithMetadata } from '../../../main/util/nodeLogUtils';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNodeId } from '../../state/node';

import { Logs } from '../../Generics/redesign/LogMessage/Logs';
import { Modal } from '../../Generics/redesign/Modal/Modal';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface LogsModalProps {
  isOpen: boolean;
  onClickClose: () => void;
}

const LogsModal = ({ isOpen, onClickClose }: LogsModalProps) => {
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
    if (isOpen) {
      console.log('LogsModal: isOpen. Listening for logs.');
      listenForNodeLogs();
    } else {
      setLogs([]);
      console.log('LogsModal: isclosed. Clear logs and removeAllListeners.');
      electron.ipcRenderer.removeAllListeners('nodeLogs');
    }
    return () => electron.ipcRenderer.removeAllListeners('nodeLogs');
  }, [isOpen, listenForNodeLogs]);

  useEffect(() => {
    // when switching selected nodes...
    // if none selected, send stop
    // if one is selected, ask for those logs
    setLogs([]);
    console.log('LogsModal: isOpen, sSelectedNodeId changed. Clear logs.');
    if (isOpen && sSelectedNodeId) {
      electron.sendNodeLogs(sSelectedNodeId);
      console.log(
        'LogsModal: isOpen && sSelectedNodeId truthy. Send selected node logs'
      );
    } else {
      console.log(
        'LogsModal: isOpen && sSelectedNodeId falsy. stopSendingNodeLogs'
      );
      electron.stopSendingNodeLogs();
    }
    return () => {
      electron.stopSendingNodeLogs();
    };
  }, [isOpen, sSelectedNodeId]);

  return (
    <Modal isOpen={isOpen} isFullScreen onClickCloseButton={onClickClose}>
      <Logs sLogs={sLogs} onClickCloseButton={onClickClose} />
    </Modal>
  );
};

export default LogsModal;
