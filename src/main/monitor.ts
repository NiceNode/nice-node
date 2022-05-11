import { net } from 'electron';
import { getSystemDiskSize, getUsedDiskSpace } from './files';

import { NodeId } from '../common/node';
import { getPid } from './geth';
import logger from './logger';
import * as storeNodes from './state/nodes';

const pidusage = require('pidusage');

export const getProcessUsageByPid = async (pid: number) => {
  const stats = await pidusage(pid);
  return stats;
};

export const getNodeUsage = async () => {
  const nodePid = await getPid();
  if (typeof nodePid !== 'number') {
    return undefined;
  }
  try {
    const gethUsage = await getProcessUsageByPid(nodePid);
    return gethUsage;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getMainProcessUsage = async () => {
  const memory = await process.getProcessMemoryInfo();
  const cpu = await process.getCPUUsage();
  return { memory, cpu };
};

export const getSystemTotalMemory = async (): Promise<number> => {
  const memory = await process.getSystemMemoryInfo();
  return memory.total * 1e-6;
};

// returns a list of warnings
export const checkSystemHardware = async () => {
  const warnings = [];
  // Is total RAM < 8 GB?
  const totalMemoryGB = await getSystemTotalMemory();
  if (totalMemoryGB < 8) {
    warnings.push(
      `Computer memory is only ${totalMemoryGB.toFixed(
        2
      )}GB. The recommended amount is greater than 8GB.`
    );
  } else {
    logger.info(`${totalMemoryGB}GB memory is sufficient.`);
  }
  // Is disk size < 1 TB?
  const sizeDiskGB = Math.round(await getSystemDiskSize());
  if (sizeDiskGB < 1000) {
    warnings.push(
      `Computer storage is only ${sizeDiskGB}GB. The recommended amount is greater than 1TB (1000GB).`
    );
  } else {
    logger.info(`${sizeDiskGB}GB size storage is sufficient.`);
  }
  // Is the internet connected?
  if (!net.isOnline()) {
    warnings.push(`Internet connection may be disconnected.`);
  } else {
    logger.info(`Internet connection appears connected.`);
  }
  logger.info(warnings);
  return warnings;
};

export const updateNodeUsedDiskSpace = async (nodeId: NodeId) => {
  const node = storeNodes.getNode(nodeId);
  if (node) {
    const { dataDir } = node.runtime;
    const diskGBs = await getUsedDiskSpace(dataDir);
    if (diskGBs !== undefined) {
      logger.info(`Disk usaged ${diskGBs}GBs calculated for nodeId ${nodeId}`);
      node.runtime.usage.diskGBs = diskGBs;
      storeNodes.updateNode(node);
    }
  }
};
