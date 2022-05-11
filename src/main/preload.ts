import { contextBridge, ipcRenderer } from 'electron';
import { NodeSpecification } from '../common/nodeSpec';
import { CHANNELS_ARRAY } from './messenger';
import { NodeId } from '../common/node';
import { NodeConfig } from './state/nodeConfig';

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
  },
  getGethStatus: () => ipcRenderer.invoke('getGethStatus'),
  startGeth: () => ipcRenderer.invoke('startGeth'),
  stopGeth: () => ipcRenderer.invoke('stopGeth'),
  deleteGethDisk: () => ipcRenderer.invoke('deleteGethDisk'),
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
  getNodeUsage: () => ipcRenderer.invoke('getNodeUsage'),
  getNodeConfig: (node: string) => ipcRenderer.invoke('getNodeConfig', node),
  changeNodeConfig: (node: string, config: NodeConfig) =>
    ipcRenderer.invoke('changeNodeConfig', node, config),
  getDefaultNodeConfig: (node: string) => {
    ipcRenderer.invoke('getDefaultNodeConfig', node);
  },
  setToDefaultNodeConfig: (node: string) =>
    ipcRenderer.invoke('setToDefaultNodeConfig', node),
  setDirectInputNodeConfig: (node: string, directInput: string[]) => {
    ipcRenderer.invoke('setDirectInputNodeConfig', node, directInput);
  },
  checkSystemHardware: () => ipcRenderer.invoke('checkSystemHardware'),

  // Multi-node
  getNodes: () => ipcRenderer.invoke('getNodes'),
  getUserNodes: () => ipcRenderer.invoke('getUserNodes'),
  addNode: (nodeSpec: NodeSpecification) =>
    ipcRenderer.invoke('addNode', nodeSpec),
  removeNode: (nodeId: NodeId) => ipcRenderer.invoke('removeNode', nodeId),
  startNode: (nodeId: NodeId) => {
    ipcRenderer.invoke('startNode', nodeId);
  },
  stopNode: (nodeId: NodeId) => {
    ipcRenderer.invoke('stopNode', nodeId);
  },
});
