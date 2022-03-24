import { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow;

export const setWindow = (inMainWindow: BrowserWindow): void => {
  mainWindow = inMainWindow;
};

export const send = (channel: string, ...args: any[]): void => {
  if (!mainWindow) {
    console.error('mainWindow is unset');
    return;
  }
  console.log('sending ', channel, args);
  mainWindow.webContents.send(channel, args);
};

export const CHANNELS = {
  geth: 'GETH',
};

export const MESSAGES = {
  downloading: 'downloading',
  extracting: 'extracting',
  readyToStart: 'readyToStart',
};
