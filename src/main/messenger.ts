import { BrowserWindow } from 'electron';

// import logger from './logger';

let mainWindow: BrowserWindow;

export const setWindow = (inMainWindow: BrowserWindow): void => {
  mainWindow = inMainWindow;
};

// eslint-disable-next-line
export const send = (channel: string, ...args: any[]): void => {
  if (!mainWindow) {
    return;
  }
  // console.log('sending', channel, args);
  mainWindow.webContents.send(channel, args);
};

export const CHANNELS = {
  userNodes: 'userNodes',
  nodeLogs: 'nodeLogs',
  podman: 'podman',
  podmanInstall: 'podmanInstall',
  theme: 'theme',
  notifications: 'notifications',
  reportEvent: 'reportEvent',
};
export const CHANNELS_ARRAY = [
  'userNodes',
  'nodeLogs',
  'podman',
  'podmanInstall',
  'theme',
  'notifications',
  'reportEvent',
];
