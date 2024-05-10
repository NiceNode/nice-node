import logger from '../../logger';
import * as platform from '../../platform';
import { runCommand } from '../podman';
import installOnLinux from './installOnLinux';
import installOnMac from './installOnMac';
import installOnWindows from './installOnWindows';

export const PODMAN_LATEST_VERSION = '4.9.3';
export const PODMAN_MIN_VERSION = '4.9.3';

const installPodman = async (): Promise<any> => {
  logger.info('Starting podman install...');

  let result;
  if (platform.isMac()) {
    result = await installOnMac(PODMAN_LATEST_VERSION);
  } else if (platform.isWindows()) {
    result = await installOnWindows(PODMAN_LATEST_VERSION);
  } else if (platform.isLinux()) {
    result = await installOnLinux();
  } else {
    result = { error: 'Unable to install Podman on this operating system.' };
  }
  logger.info(`Finished podman install. Result: ${JSON.stringify(result)}`);
  return result;
};

/**
 * @returns a version string without a prefixed v. Example: "4.7.1"
 * @returns undefined if Podman is uninstalled or version is undetected
 */
export const getInstalledPodmanVersion = async () => {
  let version;
  try {
    const versionRegex = /(\d+\.\d+\.\d+)/;
    // ex: "podman version 4.7.1";
    const commandOutput = await runCommand('--version');
    const matchedVersion = commandOutput.match(versionRegex);

    if (matchedVersion?.[0]) {
      logger.info('getInstalledPodmanVersion: ', matchedVersion[0]);
      // ex: 4.7.1
      version = matchedVersion[0];
    }
  } catch (err) {
    // podman not installed
    logger.error('Error in getInstalledPodmanVersion()');
    logger.error(err);
  }
  return version;
};

export default installPodman;
