import { app, powerSaveBlocker, powerMonitor } from 'electron';

import { getIsStartOnLogin, watchIsStartOnLogin } from './store';
import logger from './logger';

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
  // get saved settings and make sure app values are up to date
  const isStartOnLogin = getIsStartOnLogin();
  logger.info(`isStartOnLogin: ${isStartOnLogin}`);
  app.setLoginItemSettings({ openAtLogin: isStartOnLogin });
  watchIsStartOnLogin((openAtLogin: boolean) => {
    app.setLoginItemSettings({ openAtLogin });
  });
};

logger.info(`Is on battery: ${powerMonitor.isOnBatteryPower()}`);
logger.info(`on battery: ${powerMonitor.onBatteryPower}`);
powerMonitor.on('on-battery', () => {
  logger.info('PowerChange: On battery!');
});
powerMonitor.on('on-ac', () => {
  logger.info('PowerChange: On power!');
});
dontSuspendSystem();
