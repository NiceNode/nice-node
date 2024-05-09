import { powerMonitor, powerSaveBlocker } from 'electron';

// import { getIsStartOnLogin, watchIsStartOnLogin } from './state/store';
import logger from './logger';
import {
  restartNodes,
  onShutDown as shutdownNodes,
} from './nodePackageManager';
import { onStartUp } from './podman/start';

let id: number | undefined;
export const dontSuspendSystem = () => {
  // "Block the system from entering low-power (sleep) mode."
  if (id === undefined) {
    id = powerSaveBlocker.start('prevent-app-suspension');
  }
};

export const allowSuspendSystem = () => {
  if (id) {
    powerSaveBlocker.stop(id);
    id = undefined;
  }
};

export const onShutdown = () => {
  logger.info("powerMonitor.on('shutdown'). Shutting down nodes.");
  shutdownNodes();
};
export const onSuspend = () => {
  logger.info("powerMonitor.on('suspend'). Shutting down nodes.");
  shutdownNodes();
};
// Not used on('resume') because this logic is called everytime the app is opened
//  This is we already do this elsewhere more frequently, so it would be redundant
//  and possibly cause issues if we call these multiple times. Only used for dev testing
//  in the menu bar.
export const onResume = async () => {
  logger.info('onResume: Starting Podman and previously running nodes.');
  await onStartUp();
  restartNodes();
};

export const initialize = () => {
  logger.info('Initialize power settings');
  // Electron supports 'shutdown' for Linux and Mac
  // Also called when a user logs out
  // Todo: optionally prompt user, "Are you sure you want to log out? You have running nodes."
  // Electron 26+ has a bug where these have to be set AFTER
  //  app.whenReady()
  // https://github.com/electron/electron/issues/40694
  powerMonitor.on('shutdown', () => {
    onShutdown();
  });
  powerMonitor.on('suspend', () => {
    onSuspend();
  });
  powerMonitor.on('on-battery', () => {
    logger.info('PowerChange: On battery!');
  });
  powerMonitor.on('on-ac', () => {
    logger.info('PowerChange: On power!');
  });
};

logger.info(`Is on battery: ${powerMonitor.isOnBatteryPower()}`);
logger.info(`on battery: ${powerMonitor.onBatteryPower}`);

// dontSuspendSystem();
