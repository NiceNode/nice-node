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

const parseLogLevel = (log: string): LogLevel => {
  let level: LogLevel = 'INFO';
  const uppercaseLog = log.toUpperCase();
  if (uppercaseLog.includes('ERROR') || uppercaseLog.includes('ERR')) {
    level = 'ERROR';
  } else if (uppercaseLog.includes('WARN') || uppercaseLog.includes('WRN')) {
    level = 'WARN';
  } else if (uppercaseLog.includes('DEBUG') || uppercaseLog.includes('DBG')) {
    level = 'DEBUG';
  }
  return level;
};

/**
 * Tries to parse as much log metadata from a raw log string output
 *  from `docker logs -t ...`
 * @param log
 */
export const parseDockerLogMetadata = (log: string): LogWithMetadata => {
  // try to parse timestamp from beginning of log
  // Docker timestampe format with padded zeros giving consistent length
  // Examples:
  // docker: 2014-09-16T06:17:46.000000000Z
  // docker:
  const TIMESTAMP_LENGTH = 30;
  const message = log.slice(TIMESTAMP_LENGTH + 1); // 30+1 to remove a space

  const nanoTimestampStr = log.substring(0, TIMESTAMP_LENGTH);
  // returns timestamp in seconds
  const timestamp = timestampFromString(nanoTimestampStr);
  // Timestamp library silently fails and returns invalid timestamps
  // handle errors: todo
  const level = parseLogLevel(log);

  return {
    message,
    level,
    timestamp,
  };
};

/**
 * Tries to parse as much log metadata from a raw log string output
 *  from `docker logs -t ...`
 * @param log
 */
export const parsePodmanLogMetadata = (log: string): LogWithMetadata => {
  // try to parse timestamp from beginning of log
  // Podman timestamp format with padded zeros giving consistent length
  // Examples:
  // podman:  2023-03-09T15:12:17-08:00
  // podman:
  const TIMESTAMP_LENGTH = 25;
  const message = log.slice(TIMESTAMP_LENGTH + 1); // 25+1 to remove a space
  const nanoTimestampStr = log.substring(0, TIMESTAMP_LENGTH);
  // returns timestamp in seconds
  const timestamp = timestampFromString(nanoTimestampStr);
  // Timestamp library silently fails and returns invalid timestamps
  // handle errors: todo
  const level = parseLogLevel(log);

  return {
    message,
    level,
    timestamp,
  };
};
