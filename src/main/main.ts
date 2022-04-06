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
// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
// import debug from 'electron-debug';
import * as Sentry from '@sentry/electron/main';

import { CaptureConsole } from '@sentry/integrations';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import { setWindow } from './messenger';
import { initialize as initGeth } from './geth';
import { getGethUsedDiskSpace, getSystemFreeDiskSpace } from './files';
import * as ipc from './ipc';
import * as power from './power';
// import * as processExit from './processExit';

// import { dontSuspendSystem } from './power';

require('dotenv').config();

const logDiskSpace = async () => {
  console.log(`System disk free: `, await getSystemFreeDiskSpace());
};
logDiskSpace();
getGethUsedDiskSpace();

// debug({ isEnabled: true });
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  maxBreadcrumbs: 50,
  debug: true,
  integrations: [
    new CaptureConsole({
      levels: ['error', 'warn'],
    }),
  ],
});

// If your app does uses auto updates
// export default class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let mainWindow: BrowserWindow | null = null;

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
    .catch(console.log);
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
    width: 1024,
    height: 728,
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

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  setWindow(mainWindow);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();

  // [Start] Modifies the renderer's Origin header for all outgoing web requests.
  // This is done to simplify the allowed origins set for geth
  const filter = {
    urls: ['http://localhost/*', 'ws://localhost/'], // Remote API URS for which you are getting CORS error
  };
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders.Origin = `nice-node://`;
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      if (!details.responseHeaders) {
        details.responseHeaders = {};
      }
      details.responseHeaders['access-control-allow-origin'] = [
        'nice-node://',
        // 'http://localhost:1212', // URL your local electron app hosted
      ];
      callback({ responseHeaders: details.responseHeaders });
    }
  );
};
// [End] modifying Origin header

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
  .catch(console.log);

// no blocking work
const initialize = () => {
  console.log('Initializing main process work...');
  initGeth();
  ipc.initialize();
  power.initialize();
  // processExit.initialize();
};

console.log('app name: ', app.getName());
