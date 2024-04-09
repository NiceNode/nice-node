import { app } from 'electron';
import { reportEvent } from '../../events';
import { execAwait } from '../../execHelper';
import logger from '../../logger';

/**
 * Uninstall podman by removing binaries and various configuration files
 */
const uninstallOnMac = async (): Promise<boolean | { error: string }> => {
  logger.info('Uninstalling podman...');
  try {
    // Returns /Users/<user> (Ex. /Users/johns)
    const userHome = app.getPath('home');

    const foldersToDelete = [
      '/opt/podman',
      `${userHome}/.local/share/containers`,
      `${userHome}/.config/containers`,
      `${userHome}/.ssh/*podman*`,
      `${userHome}/.ssh/*nicenode*`,
      '/private/etc/paths.d/podman-pkg',
      '/usr/local/podman',
      '/Library/LaunchDaemons/*podman*',
    ];
    // This can throw return an error if a file or folder doesn't exist.
    // This is ok, because it will still delete the other folders that do exist.
    const rmCommand = `rm -rf ${foldersToDelete.join(' ')}`;
    const { stdout, stderr } = await execAwait(rmCommand, {
      log: true,
      sudo: true,
    });
    logger.info(`podman ${rmCommand}  stdout, stderr ${stdout} ${stderr}`);
    return true;
  } catch (err: any) {
    logger.error(err);
    logger.info('Unable to uninstall podman.');
    reportEvent('ErrorUninstallPodman', {
      error: err.toString(),
    });
    return { error: `Unable to uninstall Podman. ${err}` };
  }
};

export default uninstallOnMac;
