import type { BrowserWindow } from 'electron';

// import logger from './logger';

let mainWindow: BrowserWindow;

export const setWindow = (inMainWindow: BrowserWindow): void => {
  mainWindow = inMainWindow;
};

export const send = (channel: string, ...args: any[]): void => {
  if (!mainWindow) {
    return;
  }
  // console.log('sending', channel, args);
  mainWindow.webContents.send(channel, args);
};

export const CHANNELS = {
  userNodes: 'userNodes',
  userNodePackages: 'userNodePackages',
  nodeLogs: 'nodeLogs',
  podman: 'podman',
  podmanInstall: 'podmanInstall',
  theme: 'theme',
  notifications: 'notifications',
  reportEvent: 'reportEvent',
};
export const CHANNELS_ARRAY = Object.keys(CHANNELS);
