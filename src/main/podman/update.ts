import { NodeStoppedBy } from '../../common/node';
import logger from '../logger';
import {
  restartNodePackagesNotStoppedByUser,
  stopAllNodePackages,
} from '../nodePackageManager';
import { isMac, isWindows } from '../platform';
import install, {
  PODMAN_MIN_VERSION,
  getInstalledPodmanVersion,
} from './install/install';
import { removeNiceNodeMachine } from './machine';

/**
 * Stops all nodes, downloads and installs new podman version,
 * restarts all the nodes that were previously running prior to the update.
 * todo: send messages to the front-end updating the status of the update
 */
export const updatePodman = async () => {
  logger.info('updatePodman...');

  // Stop nodes
  await stopAllNodePackages(NodeStoppedBy.podmanUpdate);
  logger.info('updatePodman: all node packages stopped');

  // Stop and remove any podman machines (call uninstall?)
  if (isMac() || isWindows()) {
    logger.info('updatePodman: removing nice node podman machine');
    await removeNiceNodeMachine();
    logger.info('updatePodman: nice node podman machine removed');
  }

  // Install (starts podman machine if needed)
  logger.info('updatePodman: installing podman...');
  await install();
  logger.info(
    'updatePodman: installed podman. restarting stopped node packages',
  );

  // Restart nodes
  await restartNodePackagesNotStoppedByUser();
  logger.info('updatePodman: restarting stopped node packages');
};

/**
 * Compares the currently installed version, PODMAN_MIN_VERSION
 * and sends a message to the front-end if an update is required.
 */
export const checkForPodmanUpdate = async () => {
  const installedPodmanVersion = await getInstalledPodmanVersion();
  logger.info(
    `Installed Podman version: ${installedPodmanVersion}, Minimum Podman version required: ${PODMAN_MIN_VERSION}`,
  );
  if (!installedPodmanVersion) {
    // return update (install) required
    return;
  }
  if (installedPodmanVersion < PODMAN_MIN_VERSION) {
    // return update required
    updatePodman();
  }
};
