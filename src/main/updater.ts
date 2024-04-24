import { BrowserWindow, dialog, shell } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import sleep from 'await-sleep';

import logger, { autoUpdateLogger } from './logger';
import { reportEvent } from './events';
import { i18nMain } from './i18nMain';
import { getSetIsPreReleaseUpdatesEnabled } from './state/settings';

let notifyUserIfNoUpdateAvailable: boolean;

const t = i18nMain.getFixedT(null, 'updater');
let pMainWindow: any;

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
    // always notify user if no update available to download v6+
    const downloadUrl = 'https://nicenode.xyz/#download';
    dialog
      .showMessageBox(browserWindow, {
        type: 'info',
        title: t('UpdateAvailable'),
        message: `Please download NiceNode version 6 at ${downloadUrl}. Unfortunately, updates from v5 to v6 are not compatible. Automatic updates will work as normal with v6+.`,
        buttons: [t('Go to NiceNode downloads'), t('Cancel')],
      })
      .then(async (buttonIndex) => {
        // eslint-disable-next-line promise/always-return
        if (buttonIndex.response === 0) {
          logger.info('Go to NiceNode download links accepted by user');
          shell.openExternal(downloadUrl);
        } else {
          logger.info('cancel v6 download dialog');
        }
      })
      .catch((err) => {
        logger.error(err);
      });
    // avoid removing var work for deprecated v5
    console.log(notifyUserIfNoUpdateAvailable);
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
  pMainWindow = mainWindow;
  autoUpdater.logger = autoUpdateLogger;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  const isPreReleaseUpdatesEnabled = getSetIsPreReleaseUpdatesEnabled();
  logger.info(`isPreReleaseUpdatesEnabled: ${isPreReleaseUpdatesEnabled}`);
  autoUpdater.allowPrerelease = isPreReleaseUpdatesEnabled;
  notifyUserIfNoUpdateAvailable = false;
  intiUpdateHandlers(mainWindow);
};

export const checkForUpdates = (notifyIfNoUpdateAvailable: boolean) => {
  notifyUserIfNoUpdateAvailable = notifyIfNoUpdateAvailable;
  // always notify user if no update available to download v6+
  const downloadUrl = 'https://nicenode.xyz/#download';
  dialog
    .showMessageBox(pMainWindow, {
      type: 'info',
      title: t('UpdateAvailable'),
      message: `Please download NiceNode version 6 at ${downloadUrl}. Unfortunately, updates from v5 to v6 are not compatible. Automatic updates will work as normal with v6+.`,
      buttons: [t('Go to NiceNode downloads'), t('Cancel')],
    })
    .then(async (buttonIndex) => {
      // eslint-disable-next-line promise/always-return
      if (buttonIndex.response === 0) {
        logger.info('Go to NiceNode download links accepted by user');
        shell.openExternal(downloadUrl);
      } else {
        logger.info('cancel v6 download dialog');
      }
    })
    .catch((err) => {
      logger.error(err);
    });
  // autoUpdater.checkForUpdatesAndNotify();
};

export const setAllowPrerelease = (isAllowPrerelease: boolean) => {
  logger.info(`updater.allowPrerelease set to: ${isAllowPrerelease}`);
  autoUpdater.allowPrerelease = isAllowPrerelease;
};
