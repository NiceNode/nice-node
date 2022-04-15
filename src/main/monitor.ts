import { getPid } from './geth';

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
  const gethUsage = await getProcessUsageByPid(nodePid);
  return gethUsage;
};

export const getMainProcessUsage = async () => {
  const memory = await process.getProcessMemoryInfo();
  const cpu = await process.getCPUUsage();
  return { memory, cpu };
};
