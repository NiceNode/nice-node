// import { app } from 'electron';
import logger from '../../logger';
import { execAwait } from '../../execHelper';

/**
 * Uninstall podman by removing binaries and various configuration files
 */
const uninstallOnLinux = async (): Promise<boolean | { error: string }> => {
  logger.info(`Uninstalling podman...`);
  try {
    // Returns /Users/<user> (Ex. /Users/johns)
    // const userHome = app.getPath('home');

    // todo: delete more?
    const foldersToDelete = [
      '/etc/apt/sources.list.d/devel:kubic:libcontainers:unstable.list',
      // '/opt/podman',
      // `${userHome}/.local/share/containers`,
      // `${userHome}/.config/containers`,
      // `${userHome}/.ssh/*podman*`,
      // `${userHome}/.ssh/*nicenode*`,
      // `/private/etc/paths.d/podman-pkg`,
      // `/usr/local/podman`,
      // `/Library/LaunchDaemons/*podman*`,
    ];
    // 1. (applies to mac, also linux?) This can throw return an error if a file or folder doesn't exist.
    // This is ok, because it will still delete the other folders that do exist.
    // 2. Combine sudo commands so that user is only prompted for password once
    const rmCommand = `
      rm -rf ${foldersToDelete.join(' ')}
      apt-get remove -y podman`;
    const { stdout, stderr } = await execAwait(rmCommand, {
      log: true,
      sudo: true,
    });
    logger.info(`${rmCommand}  stdout, stderr ${stdout} ${stderr}`);
    return true;
  } catch (err) {
    logger.error(err);
    logger.info('Unable to uninstall podman.');
    return { error: `Unable to uninstall Podman. ${err}` };
  }
};

export default uninstallOnLinux;
