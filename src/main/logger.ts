import path from 'node:path';
import * as Sentry from '@sentry/electron/main';
import { app } from 'electron';
import { createLogger, format, transports } from 'winston';
import store from './state/store.js';
import SentryTransport from './util/sentryWinstonTransport';

// import DailyRotateFile from 'winston-daily-rotate-file';

const logsPath = path.join(app.getPath('userData'), 'logs');
console.log('set log path to: ', logsPath);
app.setAppLogsPath(logsPath);
console.log('get Electron log path: ', app.getPath('logs'));
console.log(
  'app log path: ',
  path.join(app.getPath('logs'), 'application-%DATE%.log'),
);

// const combinedTransport: DailyRotateFile = new DailyRotateFile({
//   filename: path.join(app.getPath('logs'), 'application-%DATE%.log'),
//   datePattern: 'YYYY-MM-DD-HH',
//   maxSize: '50m',
//   maxFiles: 1,
// });

const defaultFormat = format.combine(format.timestamp(), format.prettyPrint());
const logger = createLogger({
  level: 'info',
  format: defaultFormat,
  defaultMeta: { service: 'nice-node-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `application.log`
    //
    new transports.File({
      filename: path.join(app.getPath('logs'), 'application.log'),
      level: 'info',
      maxsize: 50000000, // 50 MB
    }),
    new transports.File({
      filename: path.join(app.getPath('logs'), 'error.log'),
      level: 'error',
      maxsize: 50000000, // 50 MB
    }),
  ],
});

export const autoUpdateLogger = createLogger({
  level: 'info',
  format: defaultFormat,
  defaultMeta: { service: 'auto-updater-service' },
  transports: [
    new transports.File({
      filename: path.join(app.getPath('logs'), 'auto-updater-application.log'),
      level: 'info',
      maxsize: 10000000, // 50 MB
    }),
    new transports.File({
      filename: path.join(app.getPath('logs'), 'auto-updater-error.log'),
      level: 'error',
      maxsize: 10000000, // 50 MB
    }),
  ],
});

// const gethRotateTransport: DailyRotateFile = new DailyRotateFile({
//   // filename: path.join(app.getPath('logs'), 'geth', 'application-%DATE%.log'),
//   filename: path.join(app.getPath('logs'), 'geth', 'application.log'),
//   // datePattern: 'YYYY-MM-DD-HH',
//   maxSize: '50m',
//   maxFiles: 1,
//   level: 'info',
// });

// const gethErrorRotateTransport: DailyRotateFile = new DailyRotateFile({
//   filename: path.join(app.getPath('logs'), 'geth', 'error-%DATE%.log'),
//   datePattern: 'YYYY-MM-DD-HH',
//   maxSize: '50m',
//   maxFiles: 1,
//   level: 'error',
// });

// gethRotateTransport.on('rotate', (oldFilename, newFilename) => {
//   logger.info(
//     `Rotating geth logs! Old file: ${oldFilename} new file: ${newFilename}`
//   );
// });

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
const errorEventReporting = store.get('settings.appIsEventReportingEnabled');
if (
  (errorEventReporting === null || errorEventReporting) &&
  (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging')
) {
  logger.add(
    new SentryTransport({
      sentry: Sentry,
      level: 'error',
    }),
  );
  autoUpdateLogger.add(
    new SentryTransport({
      sentry: Sentry,
      level: 'error',
    }),
  );
}

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: defaultFormat,
    }),
  );
  autoUpdateLogger.add(
    new transports.Console({
      format: defaultFormat,
    }),
  );
}

export default logger;
