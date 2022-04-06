import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ipcRenderer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(channel: string, func: (...args: any[]) => void) {
      const validChannels = ['GETH'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
  },
  getGethStatus: () => ipcRenderer.invoke('getGethStatus'),
  startGeth: () => ipcRenderer.invoke('startGeth'),
  stopGeth: () => ipcRenderer.invoke('stopGeth'),
  getGethDiskUsed: () => ipcRenderer.invoke('getGethDiskUsed'),
  getSystemFreeDiskSpace: () => ipcRenderer.invoke('getSystemFreeDiskSpace'),
  getDebugInfo: () => ipcRenderer.invoke('getDebugInfo'),
  getStoreValue: (key: string) => ipcRenderer.invoke('getStoreValue', key),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStoreValue: (key: string, value: any) =>
    ipcRenderer.invoke('setStoreValue', key, value),
});
