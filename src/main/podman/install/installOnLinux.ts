import { reportEvent } from '../../events';
import { execAwait } from '../../execHelper';
import logger from '../../logger';
import {
  type PackageManager,
  findPackageManager,
} from '../../nn-auto-updater/findPackageManager.js';
import { getOperatingSystemInfo } from '../../systemInfo';
import { sendMessageOnGrantPermissionToInstallPodman } from '../messageFrontEnd';
import { script as aptInstallScript } from './aptInstallScript';
import { script as dnfInstallScript } from './dnfInstallScript';
import { script as pacmanInstallScript } from './pacmanInstallScript';
import { script as yumInstallScript } from './yumInstallScript';
import { script as zypperInstallScript } from './zypperInstallScript';
// to be deprecated in the future
import { script as ubuntu22InstallScript } from './ubuntu22InstallScript';

// const UBUNTU_INSTALL_SCRIPT = 'installOnUbuntuScript';
/**
 * Download podman-arch-verson.pkg, install podman, start podman
 * @param version example: 4.4.3 (without a v prefix)
 */
const installOnLinux = async (): Promise<any> => {
  logger.info('Starting podman install on Linux...');
  const { distro, release } = await getOperatingSystemInfo();
  // ex: Ubuntu & 22.04.4 LTS
  logger.info(
    `Attempting to install Podman on distro and release: ${distro} & ${release} ...`,
  );
  const lcDistro = distro.toLowerCase();

  let installScript = '';
  // Run "cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release" on a Linux Distro
  //  or see https://github.com/sebhildebrandt/systeminformation/blob/master/lib/osinfo.js to determine.
  const pkgManager: PackageManager = await findPackageManager();
  if (pkgManager === 'dpkg') {
    installScript = aptInstallScript;
    // to be deprecated in the future
    if(distro.includes('buntu') && release.includes('22.')) {
      installScript = ubuntu22InstallScript;
    }
  } else if (pkgManager === 'dnf') {
    installScript = dnfInstallScript;
  } else if (pkgManager === 'yum') {
    installScript = yumInstallScript;
  } else if (pkgManager === 'pacman') {
    installScript = pacmanInstallScript;
  } else if (pkgManager === 'zypper') {
    installScript = zypperInstallScript;
  } else {
    const errorMessage = `Installing Podman is not suported on this distro and release: ${distro} & ${release}`;
    logger.error(errorMessage);
    return { error: errorMessage };
  }

  try {
    try {
      const { stdout, stderr } = await execAwait(installScript, {
        log: true,
        sudo: true,
      });
      logger.info('Install podman script stdout, stderr', stdout, stderr);
      sendMessageOnGrantPermissionToInstallPodman(true);
    } catch (installErr) {
      console.error(installErr);
      logger.error(JSON.stringify(installErr));
      // if user does not enter their password...
      //  installErr = "User did not grant permission"
      sendMessageOnGrantPermissionToInstallPodman(false);
      return {
        error:
          'Unable to install Podman. User denied granting NiceNode permission.',
      };
    }

    return true;
  } catch (err: any) {
    // console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    reportEvent('ErrorInstallPodman', {
      error: err.toString(),
    });
    return { error: `Unable to install Podman. ${err}` };
  }
};

export default installOnLinux;
