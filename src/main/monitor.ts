import { net } from 'electron';
import pidusage from 'pidusage';
// import { getNodesDirPathDetails } from './files';

import type { NodeId } from '../common/node';
import { NOTIFICATIONS } from './consts/notifications';
import logger from './logger';
import * as storeNodes from './state/nodes';
import { addNotification } from './state/notifications';
import { delay } from './util/delay';

const watchProcessPollingInterval = 300000; // 5 minutes
let monitoringInterval: ReturnType<typeof setTimeout>;

export const getProcessUsageByPid = async (pid: number) => {
  const stats = await pidusage(pid);
  return stats;
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
        2,
      )}GB. The recommended amount is greater than 8GB.`,
    );
  } else {
    logger.info(`${totalMemoryGB}GB memory is sufficient.`);
  }
  // Is disk size < 1 TB?
  // const getStorageDetails = await getNodesDirPathDetails();
  // const sizeDiskGB = Math.round(getStorageDetails.freeStorageGBs);
  // if (sizeDiskGB < 40) {
  //   warnings.push(
  //     `Computer storage is only ${sizeDiskGB}GB. The recommended amount is greater than 1TB (1000GB).`,
  //   );
  //   addNotification(NOTIFICATIONS.WARNING.LOW_DISK_SPACE);
  // } else {
  //   logger.info(`${sizeDiskGB}GB size storage is sufficient.`);
  // }
  // Is the internet connected?
  if (!net.isOnline()) {
    warnings.push('Internet connection may be disconnected.');
    addNotification(NOTIFICATIONS.WARNING.CONNECTION_DOWN);
  }
  logger.info(warnings);
  return warnings;
};

export const updateNodeLastSyncedBlock = async (
  nodeId: NodeId,
  block: number,
) => {
  const node = storeNodes.getNode(nodeId);
  if (node) {
    if (block !== undefined) {
      // logger.info(`Synced block ${block} for nodeId ${nodeId}`);
      node.runtime.usage.syncedBlock = block;
      storeNodes.updateNode(node);
    }
  }
};

export const initialize = async () => {
  // Delay the initial system check for 20 seconds after the app opens
  //  Operating systems take some time to connect to wifi after starting up
  await delay(20000);
  checkSystemHardware();
  monitoringInterval = setInterval(
    checkSystemHardware,
    watchProcessPollingInterval,
  );
};

export const onExit = () => {
  clearInterval(monitoringInterval);
};
