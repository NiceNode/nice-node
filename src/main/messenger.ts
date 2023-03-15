import { BrowserWindow } from 'electron';

// import logger from './logger';

let mainWindow: BrowserWindow;

export const setWindow = (inMainWindow: BrowserWindow): void => {
  mainWindow = inMainWindow;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  theme: 'theme',
};
export const CHANNELS_ARRAY = ['userNodes', 'nodeLogs', 'podman', 'theme'];
