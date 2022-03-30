import { powerSaveBlocker } from 'electron';

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
