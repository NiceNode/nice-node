import logger from '../../logger';
import { execAwait } from '../../execHelper';

const iconv = require('iconv-lite');

/**
 * Uninstall podman from Windows, and remove various configuration files
 * @param version example: 4.4.2 (without a v prefix)
 */
const uninstallOnWindows = async (
  version: string
): Promise<boolean | { error: string }> => {
  logger.info(`Starting podman uninstall of version ${version}...`);

  try {
    let stdout;
    let stderr;

    // This uninstall command is equivalent to the user going to Add & Remove programs UI
    // and clicking Uninstall. Command requires sudo.
    // todo: query for the podman version
    const uninstallCommand = `(Get-WmiObject -Class Win32_Product -Filter "Name = 'Podman ${version}'").Uninstall()`;
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(uninstallCommand, {
      log: true,
      sudo: true,
    }));
    console.log('podman uninstall stdout, stderr', stdout, stderr);

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to uninstall podman.');
    const errStr = iconv.decode(Buffer.from(err.toString()), 'ucs2');
    return { error: `Unable to uninstall podman. ${errStr}` };
  }
};

export default uninstallOnWindows;
