import sleep from 'await-sleep';
import { app, autoUpdater, dialog, type BrowserWindow } from 'electron';
import { autoUpdateLogger } from './logger';

import { reportEvent } from './events';
import i18nMain from './i18nMain';
// import { getSetIsPreReleaseUpdatesEnabled } from './state/settings';

let notifyUserIfNoUpdateAvailable: boolean;

const t = i18nMain.getFixedT(null, 'updater');

const logger = autoUpdateLogger;

const initUpdateHandlers = (browserWindow: BrowserWindow) => {
  autoUpdater.on('error', (error) => {
    logger.error('autoUpdater:::::::::error', error);
  });

  autoUpdater.on('checking-for-update', () => {
    logger.info('autoUpdater:::::::::checking-for-update');
  });
  autoUpdater.on('update-available', async (info: any) => {
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
        if (buttonIndex.response === 0) {
          console.log('update accepted by user');
          console.log('starting download');
          autoUpdater.quitAndInstall();
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

  autoUpdater.on('update-downloaded', (...args) => {
    logger.info('autoUpdater:::::::::update-downloaded args: ', args);
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

// export const initialize = (mainWindow: BrowserWindow) => {
//   // autoUpdater.logger = autoUpdateLogger;
//   // autoUpdater.autoDownload = false;
//   // autoUpdater.autoInstallOnAppQuit = false;
//   const isPreReleaseUpdatesEnabled = getSetIsPreReleaseUpdatesEnabled();
//   logger.info(`isPreReleaseUpdatesEnabled: ${isPreReleaseUpdatesEnabled}`);
//   // const server = 'https://github.com/NiceNode/nice-node/releases/latest'
//   // const url = `${server}/update/${process.platform}/${app.getVersion()}`
//   // autoUpdater.setFeedURL({ url });
//   // autoUpdater.allowPrerelease = isPreReleaseUpdatesEnabled;
//   notifyUserIfNoUpdateAvailable = false;
//   initUpdateHandlers(mainWindow);
// };

export const checkForUpdates = (notifyIfNoUpdateAvailable: boolean) => {
  logger.info(`updater.checkForUpdates set to: ${notifyIfNoUpdateAvailable}`);
  notifyUserIfNoUpdateAvailable = notifyIfNoUpdateAvailable;
  autoUpdater.checkForUpdates();
};

export const setAllowPrerelease = (isAllowPrerelease: boolean) => {
  logger.info(`updater.allowPrerelease set to: ${isAllowPrerelease}`);
  // pre-release: not available https://www.electronjs.org/docs/latest/api/auto-updater#event-update-available
  // autoUpdater.allowPrerelease = isAllowPrerelease;
};

export const initialize = (mainWindow: BrowserWindow) => {
  logger.info('initialize updater');
  const host = 'https://update.electronjs.org';
  const publicRepo = 'NiceNode/test-nice-node-updater';
  const currentAppVersion = app.getVersion(); // ex. 5.1.2-alpha
  const feedUrl = `${host}/${publicRepo}/${process.platform}-${process.arch}/${currentAppVersion}`
  logger.info(`electron.autoUpdater feedUrl set to ${feedUrl}`);
  autoUpdater.setFeedURL({ url: feedUrl });
  notifyUserIfNoUpdateAvailable = false;
  initUpdateHandlers(mainWindow);
}
