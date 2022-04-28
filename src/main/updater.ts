import { BrowserWindow, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import sleep from 'await-sleep';

import logger, { autoUpdateLogger } from './logger';

let notifyUserIfNoUpdateAvailable: boolean;

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
        // eslint-disable-next-line promise/always-return
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
    if (notifyUserIfNoUpdateAvailable) {
      dialog.showMessageBox(browserWindow, {
        type: 'info',
        title: 'No update available',
        message: `No update available`,
      });
      notifyUserIfNoUpdateAvailable = false;
    }
  });

  autoUpdater.on('update-downloaded', () => {
    logger.info('autoUpdater:::::::::update-downloaded');
    logger.info('Calling autoUpdater.quitAndInstall()');
    autoUpdater.quitAndInstall();
  });
};

export const initialize = (mainWindow: BrowserWindow) => {
  autoUpdater.logger = autoUpdateLogger;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  // Github allows releases to be marked as "pre-release" for
  //  testing purposes. Devs can set this to true and create
  //  a "pre-release" to test the auto update functionality.
  // https://www.electron.build/auto-update#appupdater-moduleeventseventemitter
  autoUpdater.allowPrerelease = false;
  notifyUserIfNoUpdateAvailable = false;
  intiUpdateHandlers(mainWindow);
};

export const checkForUpdates = (notifyIfNoUpdateAvailable: boolean) => {
  notifyUserIfNoUpdateAvailable = notifyIfNoUpdateAvailable;
  autoUpdater.checkForUpdatesAndNotify();
};
