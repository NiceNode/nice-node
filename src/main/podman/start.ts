/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '../logger';
import * as platform from '../platform';
import { execAwait } from '../execHelper';

/**
 * calls podman machine init
 */
export const startOnMac = async (): Promise<any> => {
  try {
    let stdout;
    let stderr;
    // start podman app

    ({ stdout, stderr } = await execAwait(`sysctl -n hw.ncpu hw.memsize`, {
      log: true,
    }));
    const output = stdout.split('\n'); // get the first line of output
    const cpuCount = parseInt(output[0], 10); // get the first line of output
    const memory = Math.floor(parseInt(output[1], 10) * 1e-6); // get the first line of output
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(
      `podman machine init --rootful --cpus ${cpuCount} --memory ${memory} --disk-size 200 --now`,
      {
        log: true,
      }
    ));
    console.log('Start podman (machine init) stdout, stderr', stdout, stderr);
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to start podman.');
    return { error: `Unable to start Podman. ${err}` };
  }
};

export const startOnWindows = async (): Promise<any> => {
  try {
    let stdout;
    let stderr;
    // the first time podman machine init is called, podman will install windows subsystem
    //  linux v2 and then require a restart
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(
      `podman machine init --rootful --cpus 8 --memory 8500 --disk-size 200 --now`,
      {
        log: true,
      }
    ));
    // todoo?: prompt user for restart?
    // todoo?: save a settings flag to do something on restart?

    // todo: wait to verfiy if it was started?
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to start podman.');
    return { error: `Unable to start Podman. ${err}` };
  }
};

const startPodman = async (): Promise<any> => {
  logger.info(`Starting podman...`);

  // todo: add podman machine ls check?
  let result;
  if (platform.isMac()) {
    result = await startOnMac();
  } else if (platform.isWindows()) {
    result = await startOnWindows();
  } else {
    result = { error: 'Unable to start Podman on this operating system.' };
  }
  logger.info(`Finished starting podman. Result: ${result}`);
  return result;
};

export default startPodman;
