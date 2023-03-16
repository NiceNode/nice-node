/* eslint-disable @typescript-eslint/no-explicit-any */
import { execAwait } from '../execHelper';
import logger from '../logger';
import * as platform from '../platform';
import { runCommand as runPodmanCommand } from './podman';

const NICENODE_MACHINE_NAME = 'nicenode-machine';

/**
 * calls podman machine init
 */
export const startOnMac = async (): Promise<any> => {
  logger.info('Podman startOnMac...');
  try {
    // todoo: start without machine init
    // todoo: implement podman check on startup

    // Get computer cpu count and total memory size
    const { stdout } = await execAwait(`sysctl -n hw.ncpu hw.memsize`, {
      log: true,
    });
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
    const machineListOutput = await runPodmanCommand(
      `machine list --format json`
    );

    let isNiceNodeMachineCreated = false;
    // todo: stop start other machine logic here
    try {
      const machines = JSON.parse(machineListOutput);
      if (
        Array.isArray(machines) &&
        machines[0] &&
        machines[0].Name === NICENODE_MACHINE_NAME
      ) {
        isNiceNodeMachineCreated = true;
        if (!machines[0].Running) {
          logger.info(
            "Podman machine found, but it isn't running. Starting..."
          );
          await runPodmanCommand(`machine start ${NICENODE_MACHINE_NAME}`);
          // todoo: validate machine started properly
        }
      }
    } catch (err) {
      console.error('Error parsing machine ls output');
    }

    if (!isNiceNodeMachineCreated) {
      // Set disk size to 2TB for now (ok even though system disk is smaller)
      const diskSize = 2000;
      const machineInitOutput = await runPodmanCommand(
        `machine init --rootful --cpus ${cpuCount} --memory ${memory} --disk-size ${diskSize} --now ${NICENODE_MACHINE_NAME}`
      );
      logger.info(`Start podman (machine init) output: ${machineInitOutput}`);
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
    // the first time podman machine init is called, podman will install windows subsystem
    //  linux v2 and then require a restart
    // eslint-disable-next-line prefer-const
    const machineInitOutput = await runPodmanCommand(
      `podman machine init --rootful --cpus 8 --memory 8500 --disk-size 2000 --now`
    );
    logger.info(`Start podman (machine init) output: ${machineInitOutput}`);

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
