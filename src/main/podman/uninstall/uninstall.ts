import logger from '../../logger';
import * as platform from '../../platform';
import { removeNiceNodeMachine } from '../machine';
import uninstallOnMac from './uninstallOnMac';
import uninstallOnWindows from './uninstallOnWindows';
import uninstallOnLinux from './uninstallOnLinux';

const uninstallPodman = async (): Promise<boolean | { error: string }> => {
  logger.info(`Starting podman uninstall...`);

  // force stop and remove nicenode-machine
  await removeNiceNodeMachine();

  let result;
  if (platform.isMac()) {
    result = await uninstallOnMac();
  } else if (platform.isWindows()) {
    result = await uninstallOnWindows();
  } else if (platform.isLinux()) {
    result = await uninstallOnLinux();
  } else {
    result = { error: 'Unable to uninstall Podman on this operating system.' };
  }
  logger.info(`Finished podman uninstall. Result: ${result}`);
  return result;
};

export default uninstallPodman;
