import checkDiskSpace from 'check-disk-space';
import { app } from 'electron';
import { access, mkdir, readFile, rm } from 'fs/promises';
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

/**
 *
 * @returns getNNDirPath + '/nodes'
 */
export const getNodesDirPath = (): string => {
  return path.join(getNNDirPath(), 'nodes');
};

const checkAndOrCreateDir = async (dirPath: string) => {
  try {
    await access(dirPath);
    logger.info(`checkAndOrCreateDir dirPath ${dirPath} exists`);
  } catch {
    logger.info(`checkAndOrCreateDir making dirPath ${dirPath}...`);
    await mkdir(dirPath, { recursive: true });
    logger.info(`checkAndOrCreateDir making dirPath ${dirPath}...`);
  }
};

/**
 *
 * @returns checkOrMakeNodeDir at getNodesDirPath() + nodeDirName
 * @throws error if it cannot make the directory
 */
export const makeNodeDir = async (nodeDirName: string): Promise<string> => {
  const nodeDir = path.join(getNodesDirPath(), nodeDirName);
  await checkAndOrCreateDir(nodeDir);
  return nodeDir;
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

export const tryCalcDiskSpace = async (dirPath: string) => {
  let diskUsedInGBs;
  try {
    diskUsedInGBs = (await du(dirPath)) * 1e-9;
  } catch (err) {
    console.info(
      'Cannot calculate geth disk usage. Likely geth is changing files.'
    );
  }
  return diskUsedInGBs;
};

/**
 * May return undefined if files are changining while trying to calculate
 * disk usage.
 */
export const getUsedDiskSpace = async (
  dirPath: string
): Promise<number | undefined> => {
  let diskUsedInGBs = await tryCalcDiskSpace(dirPath);
  // geth may cleanup mid calculation
  if (diskUsedInGBs === undefined) {
    diskUsedInGBs = await tryCalcDiskSpace(dirPath);
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
