/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import * as Sentry from '@sentry/electron/main';
// import { CaptureConsole } from '@sentry/integrations';

import logger from './logger';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { fixPathEnvVar } from './util/fixPathEnvVar';
import { setWindow } from './messenger';
import {
  initialize as initNodeManager,
  onExit as onExitNodeManager,
} from './nodeManager';
// eslint-disable-next-line import/no-cycle
import * as ipc from './ipc';
import * as power from './power';
import * as processExit from './processExit';
import { setCorsForNiceNode } from './corsMiddleware';
import * as updater from './updater';

require('dotenv').config();

fixPathEnvVar();
// debug({ isEnabled: true });
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  maxBreadcrumbs: 50,
  // integrations: [
  //   new CaptureConsole({
  //     levels: ['error', 'warn'],
  //   }),
  // ],
});

let mainWindow: BrowserWindow | null = null;
export const getMainWindow = () => mainWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(logger.info);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 820,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // App auto updates
  updater.initialize(mainWindow);
  updater.checkForUpdates(false);

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  setWindow(mainWindow);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Intercepts web requests from the UI an internet and sets origins
  setCorsForNiceNode(mainWindow);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    initialize();

    createWindow();
    // dontSuspendSystem();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(logger.info);

const onExit = () => {
  onExitNodeManager();
};

// no blocking work
const initialize = () => {
  logger.info('Initializing main process work...');
  ipc.initialize();
  power.initialize();
  initNodeManager();
  processExit.initialize();
  processExit.registerExitHandler(onExit);
  console.log('app locale: ', app.getLocale());
  console.log('app LocaleCountryCode: ', app.getLocaleCountryCode());
};

logger.info(`app name: ${app.getName()}`);
