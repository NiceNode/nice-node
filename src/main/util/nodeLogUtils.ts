// For more log levels, see page 11 of RFC spec https://www.rfc-editor.org/rfc/rfc5424
// Docker uses RFC3339Nano timestamp, https://docs.docker.com/engine/reference/commandline/logs/#description
// more https://pkg.go.dev/time#pkg-constants

/**
 * message: the log text
 * level: the log severity level
 * timestamp: UTC timestamp in ms
 */
import { timestampFromString } from './timestamp';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogWithMetadata = {
  message: string;
  level?: LogLevel;
  timestamp?: number;
};

/**
 * Tries to parse as much log metadata from a raw log string output
 *  from `docker logs -t ...`
 * @param log
 */
export const parseDockerLogMetadata = (log: string): LogWithMetadata => {
  // try to parse timestamp from beginning of log
  // Docker timestampe format with padded zeros giving consistent length
  // Example: 2014-09-16T06:17:46.000000000Z
  const message = log.slice(31); // 30+1 to remove a space
  const nanoTimestampStr = log.substring(0, 30);
  // returns timestamp in seconds
  const timestamp = timestampFromString(nanoTimestampStr);
  console.log(
    'test parse nanoTimestamp',
    nanoTimestampStr,
    'result',
    timestamp
  );
  // Timestamp library silently fails and returns invalid timestamps
  // handle errors: todo

  let level: LogLevel = 'INFO';
  const uppercaseLog = log.toUpperCase();
  if (uppercaseLog.includes('ERROR') || uppercaseLog.includes('ERR')) {
    level = 'ERROR';
  } else if (uppercaseLog.includes('WARN') || uppercaseLog.includes('WRN')) {
    level = 'WARN';
  } else if (uppercaseLog.includes('DEBUG') || uppercaseLog.includes('DBG')) {
    level = 'DEBUG';
  }

  return {
    message,
    level,
    timestamp,
  };
};
