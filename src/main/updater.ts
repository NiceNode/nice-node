import { BrowserWindow, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import sleep from 'await-sleep';

import logger, { autoUpdateLogger } from './logger';
import { reportEvent } from './events';
import { i18nMain } from './i18nMain';

let notifyUserIfNoUpdateAvailable: boolean;

const t = i18nMain.getFixedT(null, 'updater');

const intiUpdateHandlers = (browserWindow: BrowserWindow) => {
  autoUpdater.on('error', (error) => {
    logger.error('autoUpdater:::::::::error', error);
  });

  autoUpdater.on('checking-for-update', () => {
    logger.info('autoUpdater:::::::::checking-for-update');
  });
  autoUpdater.on('download-progress', (info) => {
    logger.info('autoUpdater:::::::::download-progress: ', info);
  });
  autoUpdater.on('update-available', async (info: UpdateInfo) => {
    logger.info('autoUpdater:::::::::update-available: ', info);
    // Quick fix to wait for window load before showing update prompt
    await sleep(5000);
    dialog
      .showMessageBox(browserWindow, {
        type: 'info',
        title: t('UpdateAvailable'),
        message: `${t('UpdateNiceNode')} ${info.version}.`,
        buttons: [t('Yes'), t('No')],
      })
      .then(async (buttonIndex) => {
        // eslint-disable-next-line promise/always-return
        if (buttonIndex.response === 0) {
          console.log('update accepted by user');
          console.log('starting download');
          autoUpdater.downloadUpdate();
          dialog.showMessageBox(browserWindow, {
            type: 'info',
            title: t('UpdateAvailable'),
            message: t('DownloadingUpdate'),
          });
        } else {
          console.log('update checkbox not checked');
        }
      })
      .catch((err) => {
        console.error('error in update available dialog: ', err);
      });
  });

  autoUpdater.on('update-not-available', () => {
    logger.info('autoUpdater:::::::::update-not-available');
    if (notifyUserIfNoUpdateAvailable) {
      dialog.showMessageBox(browserWindow, {
        type: 'info',
        title: t('NoUpdateAvailable'),
        message: t('NoUpdateAvailable'),
      });
      notifyUserIfNoUpdateAvailable = false;
    }
  });

  autoUpdater.on('update-downloaded', () => {
    logger.info('autoUpdater:::::::::update-downloaded');
    logger.info('Calling autoUpdater.quitAndInstall()');
    reportEvent('UpdatedNiceNode');
    try {
      autoUpdater.quitAndInstall();
    } catch (err) {
      logger.error('Error in: autoUpdater.quitAndInstall()');
      logger.error(err);
      dialog.showErrorBox(
        t('ErrorUpdating'),
        t('UnableToInstallUpdate', {
          downloadLink: 'https://www.nicenode.xyz/#download',
        }),
      );
      // todo: send error details
      reportEvent('ErrorUpdatingNiceNode');
    }
  });
};

export const initialize = (mainWindow: BrowserWindow) => {
  autoUpdater.logger = autoUpdateLogger;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  notifyUserIfNoUpdateAvailable = false;
  // Todo: remove this next line of code after testing this PR
  autoUpdater.forceDevUpdateConfig = true;
  intiUpdateHandlers(mainWindow);
};

export const checkForUpdates = (notifyIfNoUpdateAvailable: boolean) => {
  notifyUserIfNoUpdateAvailable = notifyIfNoUpdateAvailable;
  autoUpdater.checkForUpdatesAndNotify();
};
