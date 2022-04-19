import { BrowserWindow } from 'electron';

import logger from './logger';

let mainWindow: BrowserWindow;

export const setWindow = (inMainWindow: BrowserWindow): void => {
  mainWindow = inMainWindow;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const send = (channel: string, ...args: any[]): void => {
  if (!mainWindow) {
    return;
  }
  logger.info('sending ', channel, args);
  mainWindow.webContents.send(channel, args);
};

export const CHANNELS = {
  geth: 'GETH',
};

export const NODE_STATUS = {
  initializing: 'initializing',
  downloading: 'downloading',
  downloaded: 'downloaded',
  errorDownloading: 'error downloading',
  extracting: 'extracting',
  readyToStart: 'ready to start',
  starting: 'starting',
  running: 'running',
  stopping: 'stopping',
  stopped: 'stopped',
  errorStarting: 'error starting',
  errorStopping: 'error stopping',
};
