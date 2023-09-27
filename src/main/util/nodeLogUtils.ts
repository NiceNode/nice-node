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

const trimLogHeader = (log: string, client: string) => {
  if (client === 'geth') {
    // Pattern: INFO/WARN/ERROR/ERR/INF [MM-DD|HH:mm:ss.SSS]
    return log.replace(
      /(INFO|WARN|ERROR) \[\d{2}-\d{2}\|\d{2}:\d{2}:\d{2}\.\d{3}\] /,
      '',
    );
  }
  if (client === 'besu') {
    // Pattern: YYYY-MM-DD HH:mm:ss.SSS±HH:mm | thread-name | INFO/WARN/ERROR  | LoggerName |
    return log.replace(
      // eslint-disable-next-line no-useless-escape
      /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2} \| [\w\.\-]+ \| (INFO|WARN|ERROR) {2}\| /,
      '',
    );
  }
  if (client === 'teku-beacon') {
    // Pattern: HH:mm:ss.SSS INFO/WARN/ERROR  -
    return log.replace(
      /\d{2}:\d{2}:\d{2}\.\d{3} (INFO|WARN|ERROR) {1,2}- /,
      '',
    );
  }
  if (client === 'nimbus-beacon') {
    // Pattern: INF YYYY-MM-DD HH:mm:ss.SSS±HH:mm
    return log.replace(
      /(INF) \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2} /,
      '',
    );
  }
  if (client === 'nethermind') {
    // Pattern: DD MMM HH:mm:ss | <message>
    const pattern1 = /\d{2} \w{3} \d{2}:\d{2}:\d{2} \| /;
    // Pattern: YYYY-MM-DD HH-mm-ss.SSSS|<message>
    const pattern2 = /\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}\.\d{4}\|/;
    if (pattern1.test(log)) {
      return log.replace(pattern1, '');
    }
    if (pattern2.test(log)) {
      return log.replace(pattern2, '');
    }
  }
  if (client === 'lighthouse-beacon') {
    return log.replace(
      /\w{3} \d{2} \d{2}:\d{2}:\d{2}\.\d{3} (INFO|WARN|ERROR) /,
      '',
    );
  }
  if (client === 'lodestar-beacon') {
    return (
      log
        // eslint-disable-next-line no-control-regex
        .replace(/\x1b\[[0-9;]*m/g, '')
        .replace(
          /\w{3}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\s*\[.*?\]\s*(info|warn|error|debug|trace)\s*:\s*/,
          '',
        )
    );
  }
  if (client === 'reth') {
    // Example: 2023-09-21T18:30:10.069472Z  INFO or 2023-09-21T18:35:10.070470Z  WARN
    // Pattern: YYYY-MM-DD HH:mm:ss.SSSSSSZ  INFO/WARN/ERROR
    return log.replace(
      // eslint-disable-next-line no-useless-escape
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z\s+(INFO|WARN|ERROR)/,
      '',
    );
  }
  if (client === 'nitro') {
    // Example: INFO [09-26|23:52:47.760]
    // Pattern: INFO/WARN/ERROR [MM-DD|HH:mm:ss.SSS]
    return log.replace(
      /(INFO|WARN|ERROR)\s+\[\d{2}-\d{2}\|\d{2}:\d{2}:\d{2}\.\d{3}\] /,
      '',
    );
  }

  // Other Ethereum clients could be added here as needed...

  // If the client is not recognized, return the original log
  return log;
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

// Last timestamp is used for multi-line logs from a container. This should work in most
//  use cases because, the last valid log timestamp will be from the first log
//  in the multi-line log.
//  This is required because logs are parsed and split on new line chars. A possible fix
//  for this long-term is to better split logs as they come from Podman.
let lastTimestamp = -1;
/**
 * Tries to parse as much log metadata from a raw log string output
 *  from `podman logs --follow --timestamps --tail <n> <container>`
 * For multi-line logs, the timestamp of the first log is used for the remainer lines
 * @param log
 */
export const parsePodmanLogMetadata = (
  log: string,
  client: string,
): LogWithMetadata => {
  // try to parse timestamp from beginning of log
  // Podman timestamp format with padded zeros giving consistent length
  // Examples:
  // podman:  2023-03-09T15:12:17-08:00
  // podman:
  const TIMESTAMP_LENGTH = 25;
  const nanoTimestampStr = log.substring(0, TIMESTAMP_LENGTH);
  // returns timestamp in seconds
  let timestamp = timestampFromString(nanoTimestampStr);
  // If the timestamp is not a timestamp, then the log is missing a timestmap.
  // Or it is a multi-lined log and in this case we can only return the whole log
  let message;
  if (timestamp > 0) {
    lastTimestamp = timestamp;
    message = trimLogHeader(log.slice(TIMESTAMP_LENGTH + 1), client); // 25+1 to remove a space
  } else {
    message = trimLogHeader(log, client);
    timestamp = lastTimestamp;
  }
  const level = parseLogLevel(log);

  return {
    message,
    level,
    timestamp,
  };
};
