import { app, powerSaveBlocker, powerMonitor } from 'electron';
import { getIsStartOnLogin, watchIsStartOnLogin } from './store';

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
  console.log('isStartOnLogin: ', isStartOnLogin);
  app.setLoginItemSettings({ openAtLogin: isStartOnLogin });
  watchIsStartOnLogin((openAtLogin: boolean) => {
    app.setLoginItemSettings({ openAtLogin });
  });
};

console.log('Is on battery: ', powerMonitor.isOnBatteryPower());
console.log('on battery: ', powerMonitor.onBatteryPower);
powerMonitor.on('on-battery', () => {
  console.log('PowerChange: On battery!');
});
powerMonitor.on('on-ac', () => {
  console.log('PowerChange: On power!');
});
dontSuspendSystem();
