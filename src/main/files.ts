import checkDiskSpace from 'check-disk-space';
import { app } from 'electron';
import { readFile, rm } from 'fs/promises';
import path from 'path';
// eslint-disable-next-line import/no-cycle
import { stopGeth } from './geth';

import logger from './logger';

const du = require('du');

logger.info(`App data dir: ${app.getPath('appData')}`);
logger.info(`User data dir: ${app.getPath('userData')}`);
logger.info(`logs dir: ${app.getPath('logs')}`);

export const getNNDirPath = (): string => {
  // In packaged build...
  // Linux: ~/.config/NiceNode
  // macOS: ~/Library/Application Support/NiceNode (space causes issues)
  return app.getPath('userData');
};

export const gethDataDir = (): string => {
  return `${getNNDirPath()}/geth-mainnet`;
};

export const getSystemFreeDiskSpace = async (): Promise<number> => {
  const diskSpace = await checkDiskSpace(app.getPath('userData'));
  const freeInGBs = diskSpace.free * 1e-9;
  return freeInGBs;
};
export const getSystemDiskSize = async (): Promise<number> => {
  const diskSpace = await checkDiskSpace(app.getPath('userData'));
  const sizeInGBs = diskSpace.size * 1e-9;
  return sizeInGBs;
};

export const tryGetGethUsedDiskSpace = async () => {
  let diskUsedInGBs;
  try {
    diskUsedInGBs = (await du(gethDataDir())) * 1e-9;
  } catch (err) {
    console.info(
      'Cannot calculate geth disk usage. Likely geth is changing files.'
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
  // logger.info(`Geth disk used (GBs): ${diskUsedInGBs}`);
  return diskUsedInGBs;
};

export const getGethLogs = async () => {
  try {
    const gethLogFile = await readFile(
      path.join(app.getPath('logs'), 'geth', 'application.log')
    );
    return gethLogFile.toString().split('\n');
  } catch (err) {
    logger.error('getGethLogs error:', err);
  }
  return undefined;
};

export const getGethErrorLogs = async () => {
  try {
    const gethLogFile = await readFile(
      path.join(app.getPath('logs'), 'geth', 'error.log')
    );
    return gethLogFile.toString().split('\n');
  } catch (err) {
    logger.error('getGethErrorLogs error:', err);
  }
  return undefined;
};

export const deleteGethDisk = async () => {
  try {
    // stop geth
    await stopGeth();
    const getGethDiskBefore = await tryGetGethUsedDiskSpace();

    const gethDiskPath = gethDataDir();
    logger.info(`---------  ${gethDiskPath} ---------------`);
    const rmResult = await rm(gethDiskPath, { recursive: true, force: true });
    logger.info(`---------  ${rmResult} ---------------`);
    const getGethDiskAfter = await tryGetGethUsedDiskSpace();
    logger.info(
      `---------  after: ${getGethDiskAfter} before: ${getGethDiskBefore}---------------`
    );
    return getGethDiskAfter === undefined;
  } catch (err) {
    logger.error('getGethErrorLogs error:', err);
  }
  return false;
};
