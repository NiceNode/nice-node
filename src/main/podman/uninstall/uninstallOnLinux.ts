import { app } from 'electron';
import { reportEvent } from '../../events';
import { execAwait } from '../../execHelper';
import logger from '../../logger';
import {
  type PackageManager,
  findPackageManager,
} from '../../nn-auto-updater/findPackageManager.js';
import { script as aptUninstallScript } from './aptUninstallScript';
import { script as dnfUninstallScript } from './dnfUninstallScript';
import { script as pacmanUninstallScript } from './pacmanUninstallScript';
import { script as yumUninstallScript } from './yumUninstallScript';
import { script as zypperUninstallScript } from './zypperUninstallScript';

/**
 * Uninstall podman by removing binaries and various configuration files
 */
const uninstallOnLinux = async (): Promise<boolean | { error: string }> => {
  logger.info('Uninstalling podman...');
  try {
    // Returns /Users/<user> (Ex. /Users/johns)
    const userHome = app.getPath('home');

    // First cleanup containers and pods
    try {
      // Stop and remove all containers
      await execAwait('podman stop -a', { log: true });
      await execAwait('podman rm -af', { log: true });
      
      // Remove all pods
      await execAwait('podman pod rm -af', { log: true });
      
      // Remove all images
      await execAwait('podman rmi -af', { log: true });
      
      logger.info('Successfully cleaned up all podman containers, pods and images');
    } catch (cleanupErr) {
      logger.error('Error during container cleanup, continuing with uninstall:', cleanupErr);
    }

    // Remove podman configuration folders
    const foldersToDelete = [
      `${userHome}/.config/containers`,
      `${userHome}/.local/share/containers`,
      `${userHome}/.ssh/*podman*`,
      '/usr/local/podman',
    ];
    
    try {
      const rmCommand = `rm -rf ${foldersToDelete.join(' ')}`;
      await execAwait(rmCommand, {
        log: true,
        sudo: true,
      });
      logger.info('Successfully removed podman configuration folders');
    } catch (rmErr) {
      logger.error('Error removing configuration folders:', rmErr);
      // Continue with uninstall even if folder removal fails
    }

    // 1. (applies to mac, also linux?) This can throw return an error if a file or folder doesn't exist.
    // This is ok, because it will still delete the other folders that do exist.
    // 2. Combine sudo commands so that user is only prompted for password once
    const pkgManager: PackageManager = await findPackageManager();
    let uninstallScript = '';
    if (pkgManager === 'dpkg') {
      uninstallScript = aptUninstallScript;
    } else if (pkgManager === 'dnf') {
      uninstallScript = dnfUninstallScript;
    } else if (pkgManager === 'pacman') {
      uninstallScript = pacmanUninstallScript;
    } else if (pkgManager === 'yum') {
      uninstallScript = yumUninstallScript;
    } else if (pkgManager === 'zypper') {
      uninstallScript = zypperUninstallScript;
    }

    const { stdout, stderr } = await execAwait(uninstallScript, {
      log: true,
      sudo: true,
    });
    logger.info(`${uninstallScript} stdout, stderr ${stdout} ${stderr}`);
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
