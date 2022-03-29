import os from 'os';
import checkDiskSpace from 'check-disk-space';
import { app } from 'electron';
// eslint-disable-next-line import/no-cycle
import { gethDataDir } from './geth';

const du = require('du');

console.log('App data dir: ', app.getPath('appData'));
console.log('User data dir: ', app.getPath('userData'));

export const getNNDirPath = (): string => {
  // Linux: ~/.config/NiceNode
  return app.getPath('userData');
};

export const getSystemFreeDiskSpace = async (): Promise<number> => {
  // eslint-disable-next-line @typescript-eslint/return-await
  const diskSpace = await checkDiskSpace('/');
  const freeInGBs = diskSpace.free * 1e-9;
  console.log('GBs free: ', freeInGBs);
  return freeInGBs;
};

export const tryGetGethUsedDiskSpace = async () => {
  let diskUsedInGBs;
  try {
    diskUsedInGBs = (await du(gethDataDir())) * 1e-9;
  } catch (err) {
    console.error(
      'Error calculating geth disk usage. Likely geth is cleanup up files.'
    );
  }
  return diskUsedInGBs;
};

export const getGethUsedDiskSpace = async (): Promise<number | undefined> => {
  let diskUsedInGBs = await tryGetGethUsedDiskSpace();
  // geth may cleanup mid calculation
  if (diskUsedInGBs === undefined) {
    diskUsedInGBs = await tryGetGethUsedDiskSpace();
  }
  console.log('Geth disk used (GBs): ', diskUsedInGBs);
  return diskUsedInGBs;
};
