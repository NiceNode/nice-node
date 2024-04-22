/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'node:path';
import url from 'node:url';
import * as Sentry from '@sentry/electron/main';
import dotenv from 'dotenv';
import { BrowserWindow, app, shell } from 'electron';

import {
  REACT_DEVELOPER_TOOLS,
  installExtension,
} from 'electron-extension-installer';
import { setCorsForNiceNode } from './corsMiddleware';
import * as cronJobs from './cronJobs';
import * as i18nMain from './i18nMain';
import * as ipc from './ipc';
import logger from './logger';
import MenuBuilder from './menu';
import { setWindow } from './messenger';
import * as monitor from './monitor';
import {
  initialize as initNodeManager,
  onExit as onExitNodeManager,
} from './nodeManager';
import * as power from './power';
import * as processExit from './processExit';
import * as systemInfo from './systemInfo';
import * as tray from './tray';
import * as updater from './updater';
import { resolveHtmlPath } from './util';
import { fixPathEnvVar } from './util/fixPathEnvVar';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

// todo: when moving from require to imports
// const isTest = process.env.NODE_ENV === 'test';
// if (isTest) {
//   console.log('NODE_ENV=TEST... requiring wdio-electron-service/main');
//   require('wdio-electron-service/main');
// }

// todo: Turned off when switching to ESM modules. Do we need this?
// https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// fixPathEnvVar();
logger.info(`NICENODE_ENV: ${process.env.NICENODE_ENV}`);
logger.info(`MP_PROJECT_ENV: ${process.env.MP_PROJECT_ENV}`);
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  maxBreadcrumbs: 50,
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NICENODE_ENV || 'development',
});

let mainWindow: BrowserWindow | null = null;
export const getMainWindow = () => mainWindow;
let menuBuilder: MenuBuilder | null = null;
export const getMenuBuilder = () => menuBuilder;

// if (process.env.NODE_ENV === 'production') {
//   const sourceMapSupport = require('source-map-support');
//   sourceMapSupport.install();
// }

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDevelopment) {
//   require('electron-debug')();
// }

export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

console.log('electron.app.getAppPath(): ', app.getAppPath());
const preloadPath = path.resolve(app.getAppPath(), '.vite/build/preload.js')
console.log('preloadPath:', preloadPath)

// __dirname = package.json dir or app.asar in build. works in dev and built app.
// electron.app.getAppPath() = ../../__dirname (I think .vite/build/__dirname)
// const RESOURCES_PATH = app.isPackaged
//   ? path.join(__dirname)
//   : path.join(__dirname, '..', '..', 'assets'); // starting point: .vite/build/main.js
const RESOURCES_PATH = __dirname

const getAssetPath = (...paths: string[]): string => {
  logger.info('RESOURCES_PATH: ', RESOURCES_PATH);
  return path.join(RESOURCES_PATH, ...paths);
};

export const createWindow = async () => {
  // let name: string;
  // if (windowName === 'log') {
  //   name = getLogWindowName();
  // } else {
  //   name = windowName;
  // }
  if (isDevelopment) {
    // https://github.com/MarshallOfSound/electron-devtools-installer/issues/238
    await installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
  }

  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('preloadPath: ', preloadPath);
  mainWindow = new BrowserWindow({
    titleBarOverlay: true,
    titleBarStyle: 'hiddenInset',

    show: false,
    minWidth: 980,
    minHeight: 480,
    width: 1068,
    height: 780,
    icon: '/public/icon.png',
    webPreferences: {
      // contextIsolation: true,
      // sandbox: true,
      // preload: app.isPackaged
      //   ? path.join(__dirname, 'preload.js')
      //   : path.join(__dirname, '../../.vite/build/preload.js'),
      preload: preloadPath,
    },
    vibrancy: process.platform === 'darwin' ? 'sidebar' : undefined,
  });

  console.log(
    'MAIN_WINDOW_VITE_DEV_SERVER_URL: ',
    MAIN_WINDOW_VITE_DEV_SERVER_URL,
  );
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // mainWindow.loadURL(resolveHtmlPath('index.html'));

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
  // disabled in dev env
  if (!isDevelopment) {
    updater.checkForUpdates(false);
  } else {
    logger.info('updater.checkForUpdates() skipped. Disabled in development env');
  }

  menuBuilder = new MenuBuilder(mainWindow);
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
  app.quit(); // todo: remove
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This is called by the tray icon "Quit" menu item
let isFullQuit = false;
export const fullQuit = () => {
  isFullQuit = true;
  app.quit();
};

export const setFullQuitForNextQuit = (_isNextQuitAFullQuit: boolean) => {
  isFullQuit = _isNextQuitAFullQuit;
};

// Emitted on app.quit() after all windows have been closed
app.on('will-quit', (e) => {
  // Remove dev env check to test background. This is to prevent
  // multiple instances of the app staying open in dev env where we
  // regularly quit the app.
  app.quit(); // todo: remove
  if (isFullQuit || process.env.NODE_ENV === 'development') {
    console.log('quitting app from background');
    app.quit();
  } else {
    console.log('quitting app from foreground');
    // This allows NN to run in the background. The purpose is to keep a tray icon updated,
    // monitor node's statuses and alert the user when a node is down, and to continuously
    // track node usage.
    e.preventDefault();
    if (process.platform === 'darwin' && app.dock) {
      app.dock.hide(); // app appears "quitted" in the dock
    }
  }
});

app.on('ready', () => {
  createWindow();
  initialize();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

const onExit = () => {
  onExitNodeManager();
  monitor.onExit();
  app.quit(); // todo: remove
};

// no blocking work
const initialize = () => {
  logger.info('Initializing main process work...');
  ipc.initialize();
  power.initialize();
  initNodeManager();
  systemInfo.initialize();
  processExit.initialize();
  processExit.registerExitHandler(onExit);
  monitor.initialize();
  cronJobs.initialize();
  i18nMain.initialize();
  tray.initialize(getAssetPath);
  console.log('app locale: ', app.getLocale());
  console.log('app LocaleCountryCode: ', app.getLocaleCountryCode());
};

logger.info(`app name: ${app.getName()}`);
