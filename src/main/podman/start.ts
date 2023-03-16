/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '../logger';
import * as platform from '../platform';
import { execAwait } from '../execHelper';

const NICENODE_MACHINE_NAME = 'nicenode-machine';

/**
 * calls podman machine init
 */
export const startOnMac = async (): Promise<any> => {
  logger.info('Podman startOnMac...');
  try {
    let stdout;
    let stderr;
    // start podman app

    // todoo: start without machine init
    // todoo: implement podman check on startup
    ({ stdout, stderr } = await execAwait(`sysctl -n hw.ncpu hw.memsize`, {
      log: true,
    }));
    const output = stdout.split('\n'); // get the first line of output
    let cpuCount = parseInt(output[0], 10); // get the first line of output
    // qemu requires extra properties if cpu > 8
    // https://github.com/utmapp/UTM/commit/a358d5c62dccded2e471a67e750e03b3c40fcc43
    cpuCount = cpuCount < 8 ? cpuCount : 8;
    const memory = Math.floor(parseInt(output[1], 10) * 1e-6); // get the first line of output
    // eslint-disable-next-line prefer-const
    // todo: change volumes and disk-size as node storage paths change?
    // todoo: machine ls command
    //          if machine, yay? if not, start?
    //          name machine nicenode-machine?
    ({ stdout, stderr } = await execAwait(`podman machine list --format json`, {
      log: true,
    }));

    let isNiceNodeMachineCreated = false;
    // todo: stop start other machine logic here
    try {
      const machines = JSON.parse(stdout);
      if (
        Array.isArray(machines) &&
        machines[0] &&
        machines[0].Name === NICENODE_MACHINE_NAME
      ) {
        console.log('WOOOOT', machines);
        isNiceNodeMachineCreated = true;
        if (!machines[0].Running) {
          ({ stdout, stderr } = await execAwait(
            `podman machine start ${NICENODE_MACHINE_NAME}`,
            {
              log: true,
            }
          ));
          // todoo: validate machine started properly
        }
      }
    } catch (err) {
      console.error('Error parsing machine ls output');
    }

    if (!isNiceNodeMachineCreated) {
      ({ stdout, stderr } = await execAwait(
        `podman machine init --rootful --cpus ${cpuCount} --memory ${memory} --disk-size 200 --now ${NICENODE_MACHINE_NAME}`,
        {
          log: true,
        }
      ));
      console.log('Start podman (machine init) stdout, stderr', stdout, stderr);
      // todoo: validate machine started properly
    }
    logger.info('Podman startOnMac finished.');

    return true;
  } catch (err) {
    logger.error(err);
    logger.info('Unable to start podman.', err);
    return { error: `Unable to start Podman. ${err}` };
  }
};

export const startOnWindows = async (): Promise<any> => {
  try {
    let stdout = '';
    let stderr = '';
    // the first time podman machine init is called, podman will install windows subsystem
    //  linux v2 and then require a restart
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(
      `podman machine init --rootful --cpus 8 --memory 8500 --disk-size 2000 --now`,
      {
        log: true,
      }
    ));
    logger.info(stdout);
    if (stderr) logger.error(stderr);
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
  logger.info(`Finished starting podman. Result:`, result);
  return result;
};

export default startPodman;
