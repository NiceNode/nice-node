import { contextBridge, ipcRenderer } from 'electron';
import { NodeSpecification } from '../common/nodeSpec';
import { CHANNELS_ARRAY } from './messenger';
import { NodeId } from '../common/node';

contextBridge.exposeInMainWorld('electron', {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ipcRenderer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(channel: string, func: (...args: any[]) => void) {
      const validChannels = CHANNELS_ARRAY;
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      } else {
        console.error('IPC message not on a valid channel!');
      }
    },
    removeListener(channel: string, listener: (...args: any[]) => void) {
      ipcRenderer.removeListener(channel, listener);
      console.log(`Removed ${channel} channel listener.`);
    },
    removeAllListeners(channel: string) {
      ipcRenderer.removeAllListeners(channel);
      console.log(`Removed all listeners on ${channel} channel.`);
    },
  },
  updateNodeUsedDiskSpace: (nodeId: NodeId) =>
    ipcRenderer.invoke('updateNodeUsedDiskSpace', nodeId),
  getSystemFreeDiskSpace: () => ipcRenderer.invoke('getSystemFreeDiskSpace'),
  getDebugInfo: () => ipcRenderer.invoke('getDebugInfo'),
  getStoreValue: (key: string) => ipcRenderer.invoke('getStoreValue', key),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStoreValue: (key: string, value: any) =>
    ipcRenderer.invoke('setStoreValue', key, value),
  getGethLogs: () => ipcRenderer.invoke('getGethLogs'),
  getGethErrorLogs: () => ipcRenderer.invoke('getGethErrorLogs'),
  getMainProcessUsage: () => ipcRenderer.invoke('getMainProcessUsage'),
  getRendererProcessUsage: async () => {
    const memory = await process.getProcessMemoryInfo();
    const cpu = await process.getCPUUsage();
    return { memory, cpu };
  },
  checkSystemHardware: () => ipcRenderer.invoke('checkSystemHardware'),

  // Multi-node
  getNodes: () => ipcRenderer.invoke('getNodes'),
  getUserNodes: () => ipcRenderer.invoke('getUserNodes'),
  addNode: (nodeSpec: NodeSpecification) =>
    ipcRenderer.invoke('addNode', nodeSpec),

  updateNode: (nodeId: NodeId, propertiesToUpdate: any) =>
    ipcRenderer.invoke('updateNode', nodeId, propertiesToUpdate),

  removeNode: (nodeId: NodeId, options: { isDeleteStorage: boolean }) =>
    ipcRenderer.invoke('removeNode', nodeId, options),
  startNode: (nodeId: NodeId) => {
    ipcRenderer.invoke('startNode', nodeId);
  },
  stopNode: (nodeId: NodeId) => {
    ipcRenderer.invoke('stopNode', nodeId);
  },
  openDialogForNodeDataDir: (nodeId: NodeId) =>
    ipcRenderer.invoke('openDialogForNodeDataDir', nodeId),
  deleteNodeStorage: (nodeId: NodeId) =>
    ipcRenderer.invoke('deleteNodeStorage', nodeId),

  // Node library
  getNodeLibrary: () => ipcRenderer.invoke('getNodeLibrary'),

  // Settings/Config
  getIsDockerInstalled: () => ipcRenderer.invoke('getIsDockerInstalled'),
});
