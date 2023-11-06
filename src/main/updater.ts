import { BrowserWindow, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import sleep from 'await-sleep';

import logger, { autoUpdateLogger } from './logger';
import { reportEvent } from './events';
import { i18nMain } from './i18nMain';

let notifyUserIfNoUpdateAvailable: boolean;

const t = (str: string) => i18nMain.t(str, { ns: 'updater' });

const intiUpdateHandlers = (browserWindow: BrowserWindow) => {
  autoUpdater.on('error', (error) => {
    logger.error(t(`autoUpdater:::::::::error, ${error}`));
  });

  autoUpdater.on('checking-for-update', () => {
    logger.info(t('autoUpdater:::::::::checking-for-update'));
  });
  autoUpdater.on('download-progress', (info) => {
    logger.info(t(`autoUpdater:::::::::download-progress: ${info}`));
  });
  autoUpdater.on('update-available', async (info: UpdateInfo) => {
    logger.info(t(`autoUpdater:::::::::update-available: ${info}`));
    // Quick fix to wait for window load before showing update prompt
    await sleep(5000);
    dialog
      .showMessageBox(browserWindow, {
        type: 'info',
        title: t('Updates for NiceNode available'),
        message: t(
          `Do you want update NiceNode now? NiceNode will restart after downloading the update. Update to version ${info.version}.`,
        ),
        buttons: [t('Yes'), t('No')],
      })
      .then(async (buttonIndex) => {
        // eslint-disable-next-line promise/always-return
        if (buttonIndex.response === 0) {
          console.log(t('update accepted by user'));
          console.log(t('starting download'));
          autoUpdater.downloadUpdate();
          dialog.showMessageBox(browserWindow, {
            type: 'info',
            title: t('Updates for NiceNode available'),
            message: t('Downloading NiceNode update...'),
          });
        } else {
          console.log(t('update checkbox not checked'));
        }
      })
      .catch((err) => {
        console.error(t(`error in update available dialog:  ${err}`));
      });
  });

  autoUpdater.on('update-not-available', () => {
    logger.info(t('autoUpdater:::::::::update-not-available'));
    if (notifyUserIfNoUpdateAvailable) {
      dialog.showMessageBox(browserWindow, {
        type: 'info',
        title: t('No update available'),
        message: t('No update available'),
      });
      notifyUserIfNoUpdateAvailable = false;
    }
  });

  autoUpdater.on('update-downloaded', () => {
    logger.info(t('autoUpdater:::::::::update-downloaded'));
    logger.info(t('Calling autoUpdater.quitAndInstall()'));
    reportEvent(t('UpdatedNiceNode'));
    try {
      autoUpdater.quitAndInstall();
    } catch (err) {
      logger.error(t('Error in: autoUpdater.quitAndInstall()'));
      logger.error(err);
      dialog.showErrorBox(
        t('Sorry, there was an error updating NiceNode'),
        t(
          'Unable to install the new version of NiceNode. You can try downloading the new version manually at https://www.nicenode.xyz/#download',
        ),
      );
      // todo: send error details
      reportEvent(t('ErrorUpdatingNiceNode'));
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
