/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isPodmanRunning,
  isPodmanStarting,
  runCommand as runPodmanCommand,
} from './podman';
import { execAwait } from '../execHelper';
import logger from '../logger';
import * as platform from '../platform';
import { startMachineIfCreated } from './machine';

const NICENODE_MACHINE_NAME = 'nicenode-machine';

export const startOnMac = async (): Promise<any> => {
  logger.info('Podman startOnMac...');
  try {
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

    const isNiceNodeMachineCreated = await startMachineIfCreated();
    // todo: stop start other machine logic here

    if (!isNiceNodeMachineCreated) {
      // Set disk size to 2TB for now (ok even though system disk is smaller)
      const diskSize = 2000;
      // On macOS, external drives are mounted to /Volumes by default. Other volumes are Podman defaults.
      const machineInitOutput = await runPodmanCommand(
        `machine init --rootful -v $HOME:$HOME -v /Volumes:/Volumes -v /private:/private -v /var/folders:/var/folders --cpus ${cpuCount} --memory ${memory} --disk-size ${diskSize} --now ${NICENODE_MACHINE_NAME}`
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
    const isNiceNodeMachineCreated = await startMachineIfCreated();

    if (!isNiceNodeMachineCreated) {
      // todoo?: prompt user for restart?
      // todoo?: save a settings flag to do something on restart?

      // Can't set podman machine hardware resources on Windows. WSL2 scales automatically.
      // (optionally, we could change a wslconfig file)
      const machineInitOutput = await runPodmanCommand(
        `machine init --rootful --now ${NICENODE_MACHINE_NAME}`
      );
      logger.info(`Start podman (machine init) output: ${machineInitOutput}`);
    }

    // todo: wait to verfiy if it was started?
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to start podman.');
    return { error: `Unable to start Podman. ${err}` };
  }
};

/**
 * Creates a podman machine if one does not exists. Starts
 * the machine. No machine required on Linux.
 */
const startPodman = async (): Promise<any> => {
  logger.info(`Starting podman...`);

  if (await isPodmanRunning()) {
    return true;
  }
  if (await isPodmanStarting()) {
    return true;
  }
  let result;
  if (platform.isMac()) {
    result = await startOnMac();
  } else if (platform.isWindows()) {
    result = await startOnWindows();
  } else {
    // Machine not req'd on Linux
    result = { error: 'Unable to start Podman on this operating system.' };
  }
  logger.info(`Finished starting podman. Result:`, result);
  return result;
};

export default startPodman;
