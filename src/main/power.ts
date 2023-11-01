import { powerSaveBlocker, powerMonitor } from 'electron';

// import { getIsStartOnLogin, watchIsStartOnLogin } from './state/store';
import logger from './logger';
import { onShutDown, restartNodes } from './state/nodes';

let id: number | undefined;
// eslint-disable-next-line import/prefer-default-export
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

export const initialize = () => {
  console.log('Initialize power settings...');
  // get saved settings and make sure app values are up to date
  // const isStartOnLogin = getIsStartOnLogin();
  // logger.info(`isStartOnLogin: ${isStartOnLogin}`);
  // app.setLoginItemSettings({ openAtLogin: false });
  // app.setLoginItemSettings({ openAtLogin: isStartOnLogin });
  // watchIsStartOnLogin((openAtLogin: boolean) => {
  //   app.setLoginItemSettings({ openAtLogin });
  // });
};

logger.info(`Is on battery: ${powerMonitor.isOnBatteryPower()}`);
logger.info(`on battery: ${powerMonitor.onBatteryPower}`);
powerMonitor.on('on-battery', () => {
  logger.info('PowerChange: On battery!');
});
powerMonitor.on('on-ac', () => {
  logger.info('PowerChange: On power!');
});
// dontSuspendSystem();

powerMonitor.on('shutdown', () => {
  onShutDown();
});

powerMonitor.on('suspend', () => {
  onShutDown();
});

powerMonitor.on('resume', () => {
  restartNodes('login');
});
