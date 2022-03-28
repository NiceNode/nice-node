import os from 'os';
import checkDiskSpace from 'check-disk-space';
import { app } from 'electron';

const homeDir = os.homedir();
const niceNodeDirName = '.nicenode';

console.log('App data dir: ', app.getPath('appData'));
console.log('User data dir: ', app.getPath('userData'));

// eslint-disable-next-line import/prefer-default-export
export const getNNDirPath = (): string => {
  // return `${homeDir}/${niceNodeDirName}`;
  return app.getPath('userData');
};

export const getFreeDiskSpace = async () => {
  // eslint-disable-next-line @typescript-eslint/return-await
  const diskSpace = await checkDiskSpace('/');
  const freeInGBs = diskSpace.free * 1e-9;
  console.log('GBs free: ', freeInGBs);
  return diskSpace;
};
