import { CronJob } from 'cron';
import type { NodeId, NodeStatus, UserNodePackages } from '../common/node';
import { reportEvent } from './events';
import logger from './logger';
import { getUserNodePackagesWithNodes } from './state/nodePackages';
import store from './state/store';

const CRON_ONCE_A_DAY = '0 0 * * *';
// const CRON_ONCE_A_DAY = '* * * * *'; // one minute for testing

type NodeReportData = {
  specId: string;
  specVersion: string;
  status: NodeStatus;
  diskUsedGBs?: number;
  network?: string;
  lastRunningTimestampMs?: number;
  lastStartedTimestampMs?: number;
  lastStoppedTimestampMs?: number;
};

type PackageReportData = {
  specId: string;
  specVersion: string;
  status: NodeStatus;
  nodes: Record<NodeId, NodeReportData>;
  network?: string;
  lastRunningTimestampMs?: number;
  lastStartedTimestampMs?: number;
  lastStoppedTimestampMs?: number;
};
export const reportDataForNodePackages = (
  userNodePackages: UserNodePackages,
) => {
  const reportData: Record<NodeId, PackageReportData> = {};

  userNodePackages?.nodeIds.forEach((nodeId: NodeId) => {
    const nodePackage = userNodePackages.nodes[nodeId];
    const packageReportData: PackageReportData = {
      specId: nodePackage.spec.specId,
      specVersion: nodePackage.spec.version,
      status: nodePackage.status,
      network: nodePackage.config?.configValuesMap?.network,
      lastRunningTimestampMs: nodePackage.lastRunningTimestampMs,
      lastStartedTimestampMs: nodePackage.lastStartedTimestampMs,
      lastStoppedTimestampMs: nodePackage.lastStoppedTimestampMs,
      nodes: {},
    };

    nodePackage.nodes.forEach((node) => {
      let diskUsedGBs;
      if (node.runtime?.usage?.diskGBs?.[0]?.y !== undefined) {
        diskUsedGBs = node.runtime.usage.diskGBs[0].y;
      }
      packageReportData.nodes[node.id] = {
        specId: node.spec.specId,
        specVersion: node.spec.version,
        status: node.status,
        network: node.config?.configValuesMap?.network,
        lastRunningTimestampMs: node.lastRunningTimestampMs,
        lastStartedTimestampMs: node.lastStartedTimestampMs,
        lastStoppedTimestampMs: node.lastStoppedTimestampMs,
        diskUsedGBs,
      };
    });

    reportData[nodeId] = packageReportData;
  });
  return reportData;
};

const dailyReportFunc = async () => {
  const lastDailyReportTimestamp = store.get(
    'lastDailyReportTimestamp',
  ) as number;
  const nowTimestamp = Date.now();
  // Subtracts 23 hours and 59 minutes ago, (86,340,000 milliseconds)
  const oneDayAgo = nowTimestamp - 23 * 60 * 60 * 1000 - 59 * 60 * 1000;
  // const oneDayAgo = nowTimestamp + 1 * 60 * 1000; // one minute for testing
  if (
    lastDailyReportTimestamp < oneDayAgo ||
    lastDailyReportTimestamp === undefined
  ) {
    // It's been more than a day, proceed with the report
    logger.info(
      'Cron dailyReportJob: it has been more than a day. Reporting dailyReport.',
    );
    const userNodePackages = await getUserNodePackagesWithNodes();
    // console.log(
    //   'userNodePackages: ',
    //   JSON.stringify(userNodePackages, null, 2),
    // );
    const reportData = reportDataForNodePackages(userNodePackages);
    logger.info('reportData: ', JSON.stringify(reportData));
    reportEvent('DailyUserReport', reportData);
    store.set('lastDailyReportTimestamp', nowTimestamp);
  }
};

// Run once everyday at midnight in the user's local timezone
const dailyReportJob = new CronJob(CRON_ONCE_A_DAY, async () => {
  logger.info('Running cron dailyReportJob...');
  await dailyReportFunc();
  logger.info('End cron dailyReportJob.');
});

export const initialize = () => {
  // Start the cron jobs and then run some for a first time now
  dailyReportJob.start();
  // Wait 30 seconds for front end to load
  // todo: send report events from backend
  setTimeout(() => {
    dailyReportFunc();
  }, 30000); // 30 seconds
};
