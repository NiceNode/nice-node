import { reportEvent } from '../../events';
import { execAwait } from '../../execHelper';
// import { app } from 'electron';
import logger from '../../logger';
import {
  type PackageManager,
  findPackageManager,
} from '../../nn-auto-updater/findPackageManager.js';
import { script as aptUninstallScript } from './aptUninstallScript';
import { script as dnfUninstallScript } from './dnfUninstallScript';
import { script as yumUninstallScript } from './yumUninstallScript';

/**
 * Uninstall podman by removing binaries and various configuration files
 */
const uninstallOnLinux = async (): Promise<boolean | { error: string }> => {
  logger.info('Uninstalling podman...');
  try {
    // Returns /Users/<user> (Ex. /Users/johns)
    // const userHome = app.getPath('home');

    // 1. (applies to mac, also linux?) This can throw return an error if a file or folder doesn't exist.
    // This is ok, because it will still delete the other folders that do exist.
    // 2. Combine sudo commands so that user is only prompted for password once
    const pkgManager: PackageManager = await findPackageManager();
    let uninstallScript = '';
    if (pkgManager === 'dpkg') {
      uninstallScript = aptUninstallScript;
    } else if (pkgManager === 'dnf') {
      uninstallScript = dnfUninstallScript;
    } else if (pkgManager === 'yum') {
      uninstallScript = yumUninstallScript;
    }
    const { stdout, stderr } = await execAwait(uninstallScript, {
      log: true,
      sudo: true,
    });
    logger.info(`${uninstallScript}  stdout, stderr ${stdout} ${stderr}`);
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

export default uninstallOnLinux;
