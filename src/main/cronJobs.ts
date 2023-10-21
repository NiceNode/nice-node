import { CronJob } from 'cron';
import logger from './logger';
import { reportEvent } from './events';
import { getUserNodePackagesWithNodes } from './state/nodePackages';
import store from './state/store';

const CRON_ONCE_A_DAY = '0 0 * * *';
// const CRON_ONCE_A_DAY = '* * * * *'; // one minute for testing

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
    // console.log('userNodePackages: ', JSON.stringify(userNodePackages));
    reportEvent('DailyUserReport', userNodePackages);
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
  dailyReportFunc();
};
