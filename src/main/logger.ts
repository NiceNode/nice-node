import { app } from 'electron';
import path from 'path';
import * as winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

const logsPath = path.join(app.getPath('userData'), 'logs');
console.log('set log path to: ', logsPath);
app.setAppLogsPath(logsPath);
console.log('get Electron log path: ', app.getPath('logs'));
console.log(
  'app log path: ',
  path.join(app.getPath('logs'), 'application-%DATE%.log')
);

// const combinedTransport: DailyRotateFile = new DailyRotateFile({
//   filename: path.join(app.getPath('logs'), 'application-%DATE%.log'),
//   datePattern: 'YYYY-MM-DD-HH',
//   maxSize: '50m',
//   maxFiles: 1,
// });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'nice-node-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: path.join(app.getPath('logs'), 'application.log'),
      level: 'info',
      maxsize: 50000000, // 50 MB
    }),
    new winston.transports.File({
      filename: path.join(app.getPath('logs'), 'error.log'),
      level: 'error',
      maxsize: 50000000, // 50 MB
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

export const gethLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'geth-service' },
  // transports: [gethRotateTransport, gethErrorRotateTransport],
  transports: [
    new winston.transports.File({
      filename: path.join(app.getPath('logs'), 'geth', 'application.log'),
      level: 'info',
      maxsize: 20000000, // 50 MB
    }),
    new winston.transports.File({
      filename: path.join(app.getPath('logs'), 'geth', 'error.log'),
      level: 'error',
      maxsize: 20000000, // 50 MB
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  gethLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
