import logger from '../logger';
import * as platform from '../platform';
import installOnMac from './installOnMac';
import installOnWindows from './installOnWindows';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installDocker = async (): Promise<any> => {
  logger.info(`Starting docker install...`);

  let result;
  if (platform.isMac()) {
    result = await installOnMac();
  } else if (platform.isWindows()) {
    result = await installOnWindows();
  } else {
    result = { error: 'Unable to install Docker on this operating system.' };
  }
  logger.info(`Finished docker install. Result: ${result}`);
  return result;
};

export default installDocker;
