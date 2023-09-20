import { spawn } from 'node:child_process';

import logger from '../logger';
import * as platform from '../platform';
import { execAwait } from '../execHelper';

export const startOnMac = async (): Promise<any> => {
  try {
    let stdout;
    let stderr;
    // start docker app
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(`open /Applications/Docker.app`, {
      log: true,
    }));
    console.log('open docker app stdout, stderr', stdout, stderr);
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to start docker.');
    return { error: `Unable to start Docker. ${err}` };
  }
};

export const startOnWindows = async (): Promise<any> => {
  try {
    // To start an exe does not return after it starts.
    //  It returns when the exe stops, in this case, we don't want to wait.
    //  Use spawn here so that if NiceNode is closed, Docker continues running
    spawn('C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe', [], {
      detached: true,
      stdio: 'ignore',
    });
    // todo: wait to verfiy if it was started?
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to start docker.');
    return { error: `Unable to start Docker. ${err}` };
  }
};

const startDocker = async (): Promise<any> => {
  logger.info(`Starting docker...`);

  let result;
  if (platform.isMac()) {
    result = await startOnMac();
  } else if (platform.isWindows()) {
    result = await startOnWindows();
  } else {
    result = { error: 'Unable to start Docker on this operating system.' };
  }
  logger.info(`Finished starting docker. Result: ${result}`);
  return result;
};

export default startDocker;
