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
import { app, BrowserWindow, dialog, shell } from 'electron';

import { autoUpdater, UpdateInfo } from 'electron-updater';
import * as Sentry from '@sentry/electron/main';
import sleep from 'await-sleep';
// import { CaptureConsole } from '@sentry/integrations';

import logger, { autoUpdateLogger } from './logger';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { setWindow } from './messenger';
import {
  initialize as initNodeManager,
  onExit as onExitNodeManager,
} from './nodeManager';
import * as ipc from './ipc';
import * as power from './power';
import * as processExit from './processExit';

require('dotenv').config();
// debug({ isEnabled: true });
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  maxBreadcrumbs: 50,
  debug: true,
  // integrations: [
  //   new CaptureConsole({
  //     levels: ['error', 'warn'],
  //   }),
  // ],
});

// If your app does uses auto updates
export default class AppUpdater {
  constructor() {
    autoUpdater.logger = autoUpdateLogger;
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    // Github allows releases to be marked as "pre-release" for
    //  testing purposes. Devs can set this to true and create
    //  a "pre-release" to test the auto update functionality.
    // https://www.electron.build/auto-update#appupdater-moduleeventseventemitter
    autoUpdater.allowPrerelease = false;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

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
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  intiUpdateHandlers(mainWindow);
  // eslint-disable-next-line no-new
  new AppUpdater();

  // [Start] Modifies the renderer's Origin header for all outgoing web requests.
  // This is done to simplify the allowed origins set for geth
  // const filter = {
  //   urls: ['http://localhost/', 'ws://localhost/'], // Remote API URS for which you are getting CORS error
  // };
  const filter = {
    urls: ['*'], // Remote API URS for which you are getting CORS error
  };
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      // details.requestHeaders.Origin = `http://localhost:1212`; // eh works for nimbus
      // details.requestHeaders.Origin = `nice-node://`;
      // details.requestHeaders.Origin = `*`;
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      if (!details.responseHeaders) {
        details.responseHeaders = {};
      }
      // '*',
      // details.responseHeaders['Access-Control-Allow-Origin'] = [
      //   '*',
      //   // 'http://localhost:1212', // eh works for nimbus, not for geth
      // ];
      // for geth
      details.responseHeaders['Access-Control-Allow-Headers'] = ['*'];
      details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];

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
  .catch(logger.info);

const intiUpdateHandlers = (browserWindow: BrowserWindow) => {
  autoUpdater.on('error', (error) => {
    logger.error('autoUpdater:::::::::error', error);
  });

  autoUpdater.on('checking-for-update', () => {
    logger.info('autoUpdater:::::::::checking-for-update');
  });
  autoUpdater.on('download-progress', (info) => {
    logger.info(`autoUpdater:::::::::download-progress: `, info);
  });
  autoUpdater.on('update-available', async (info: UpdateInfo) => {
    logger.info('autoUpdater:::::::::update-available: ', info);
    // Quick fix to wait for window load before showing update prompt
    await sleep(5000);
    dialog
      .showMessageBox(browserWindow, {
        type: 'info',
        title: 'Updates for NiceNode available',
        message: `Do you want update NiceNode now? NiceNode will restart after downloading the update. Update to version ${info.version}.`,
        buttons: ['Yes', 'No'],
      })
      .then(async (buttonIndex) => {
        if (buttonIndex.response === 0) {
          console.log('update accepted by user');
          console.log('starting download');
          autoUpdater.downloadUpdate();
          dialog.showMessageBox(browserWindow, {
            type: 'info',
            title: 'Updates for NiceNode available',
            message: `Downloading NiceNode update...`,
          });
        } else {
          console.log('update checkbox not checked');
        }
      })
      .catch((err) => {
        console.error('error in update available diaglog: ', err);
      });
  });

  autoUpdater.on('update-not-available', () => {
    logger.info('autoUpdater:::::::::update-not-available');
  });

  autoUpdater.on('update-downloaded', () => {
    logger.info('autoUpdater:::::::::update-downloaded');
    logger.info('Calling autoUpdater.quitAndInstall()');
    autoUpdater.quitAndInstall();
  });
};

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
};

logger.info(`app name: ${app.getName()}`);
