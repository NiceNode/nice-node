import logger from '../logger';
import { runCommand } from './podman';
import type { MachineJSON } from './types';

export const NICENODE_MACHINE_NAME = 'nicenode-machine';

/**
 * @returns the podman machine created by NiceNode (name NICENODE_MACHINE_NAME)
 */
export const getNiceNodeMachine = async (): Promise<
  MachineJSON | undefined
> => {
  try {
    const result = await runCommand('machine list --format json');
    if (!result) {
      logger.error(`Podman machine ls result returned: ${result}`);
      return undefined;
    }

    try {
      const machines: MachineJSON[] = JSON.parse(result);
      if (Array.isArray(machines)) {
        for (const machine of machines) {
          if (machine && machine.Name === NICENODE_MACHINE_NAME) {
            // logger.info('Podman machine found.');
            return machine;
          }
        }
      }
    } catch (err) {
      logger.error('Error parsing machine ls output');
      logger.error(err);
    }
  } catch (err) {
    logger.error('Error running command podman machine list');
    logger.error(err);
  }
  return undefined;
};

/**
 * @returns false if the machine hasn't been created. true if the machine
 * is created and start command was sent or is already Starting
 */
export const startMachineIfCreated = async (): Promise<boolean> => {
  try {
    const nnMachine = await getNiceNodeMachine();
    if (nnMachine) {
      if (!nnMachine.Running && !nnMachine.Starting) {
        logger.info(
          "Podman machine found, but it isn't running or starting yet. Starting...",
        );
        await runCommand(`machine start ${NICENODE_MACHINE_NAME}`);
        // todoo: validate machine started properly
      } else {
        logger.info('Podman machine in state of running or starting');
      }
      return true;
    }
  } catch (err) {
    logger.error('Error getting the machine.');
  }
  return false;
};

/**
 * @returns false if the machine hasn't been stopped. true if the machine
 * is stopped and stop command was sent or is already Stopping
 */
export const stopMachineIfCreated = async (): Promise<boolean> => {
  try {
    const nnMachine = await getNiceNodeMachine();
    if (nnMachine) {
      await runCommand(`machine stop ${NICENODE_MACHINE_NAME}`);
      // todo: validate machine stopped properly
      // consider: removing the machine here if the machine is stuck
      return true;
    }
  } catch (err) {
    logger.error('Error getting the machine.');
  }
  return false;
};

/**
 *
 * @returns an error message if it fails. undefined if successful.
 */
export const removeNiceNodeMachine = async (): Promise<string | undefined> => {
  // --force stops the machine and does not prompt before removing
  const command = `machine rm --force ${NICENODE_MACHINE_NAME}`;
  try {
    await runCommand(command);
  } catch (err) {
    const errorMessage = `Error running command podman ${command}`;
    logger.error(errorMessage);
    logger.error(err);
    return errorMessage;
  }
  return undefined;
};
