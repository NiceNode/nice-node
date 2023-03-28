import logger from '../logger';
import * as platform from '../platform';
import installOnMac from './installOnMac';
import installOnWindows from './installOnWindows';

export const VERSION = '4.4.4';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installPodman = async (): Promise<any> => {
  logger.info(`Starting podman install...`);

  let result;
  if (platform.isMac()) {
    result = await installOnMac(VERSION);
  } else if (platform.isWindows()) {
    result = await installOnWindows(VERSION);
  } else {
    result = { error: 'Unable to install Podman on this operating system.' };
  }
  logger.info(`Finished podman install. Result: ${result}`);
  return result;
};

export default installPodman;
