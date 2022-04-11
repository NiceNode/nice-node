import checkDiskSpace from 'check-disk-space';
import { app } from 'electron';
import { readFile } from 'fs/promises';
import path from 'path';

import logger from './logger';

const du = require('du');

logger.info('App data dir: ', app.getPath('appData'));
logger.info('User data dir: ', app.getPath('userData'));
logger.info('logs dir: ', app.getPath('logs'));

export const getNNDirPath = (): string => {
  // Linux: ~/.config/NiceNode
  // macOS: ~/Library/Application Support/NiceNode (space causes issues)
  return app.getPath('userData');
};

export const gethDataDir = (): string => {
  return `${getNNDirPath()}/geth-mainnet`;
};

export const getSystemFreeDiskSpace = async (): Promise<number> => {
  // eslint-disable-next-line @typescript-eslint/return-await
  // const diskSpace = await checkDiskSpace('/');
  const diskSpace = await checkDiskSpace(app.getPath('userData'));
  const freeInGBs = diskSpace.free * 1e-9;
  logger.log('GBs free: ', freeInGBs);
  return freeInGBs;
};

export const tryGetGethUsedDiskSpace = async () => {
  let diskUsedInGBs;
  try {
    diskUsedInGBs = (await du(gethDataDir())) * 1e-9;
  } catch (err) {
    console.info(
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
  logger.info('Geth disk used (GBs): ', diskUsedInGBs);
  return diskUsedInGBs;
};

export const getGethLogs = async () => {
  try {
    const gethLogFile = await readFile(
      path.join(app.getPath('logs'), 'geth', 'application.log')
    );
    console.log('getGethLogs: ', gethLogFile);
    return gethLogFile.toString().split('\n');
  } catch (err) {
    logger.error(`getGethLogs error: ${err}`);
  }
  return undefined;
};

export const getGethErrorLogs = async () => {
  try {
    const gethLogFile = await readFile(
      path.join(app.getPath('logs'), 'geth', 'error.log')
    );
    console.log('getGethErrorLogs: ', gethLogFile);
    return gethLogFile.toString().split('\n');
  } catch (err) {
    logger.error(`getGethErrorLogs error: ${err}`);
  }
  return undefined;
};
