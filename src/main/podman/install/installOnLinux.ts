import logger from '../../logger';
import { execAwait } from '../../execHelper';
import { sendMessageOnGrantPermissionToInstallPodman } from '../messageFrontEnd';
import { getOperatingSystemInfo } from '../../systemInfo';
import { script as ubuntuInstallScript } from './ubuntuInstallScript';
import { script as debianInstallScript } from './debianInstallScript';
import { script as fedoraInstallScript } from './fedoraInstallScript';
import { script as manjaroInstallScript } from './manjaroInstallScript';
import { script as linuxMintInstallScript } from './linuxMintInstallScript';

// const UBUNTU_INSTALL_SCRIPT = 'installOnUbuntuScript';
/**
 * Download podman-arch-verson.pkg, install podman, start podman
 * @param version example: 4.4.3 (without a v prefix)
 */
// eslint-disable-next-line
const installOnLinux = async (): Promise<any> => {
  logger.info(`Starting podman install on Linux...`);
  const { distro, release } = await getOperatingSystemInfo();
  logger.info(
    `Attempting to install Podman on distro and release: ${distro} & ${release} ...`,
  );
  const lcDistro = distro.toLowerCase();

  let installScript = '';
  // Run "cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release" on a Linux Distro
  //  or see https://github.com/sebhildebrandt/systeminformation/blob/master/lib/osinfo.js to determine.
  if (lcDistro.includes('ubuntu')) {
    installScript = ubuntuInstallScript;
  } else if (lcDistro.includes('debian')) {
    installScript = debianInstallScript;
  } else if (lcDistro.includes('fedora')) {
    installScript = fedoraInstallScript;
  } else if (lcDistro.includes('manjaro') || lcDistro.includes('arch')) {
    installScript = manjaroInstallScript;
  } else if (lcDistro.includes('linuxmint') || lcDistro.includes('linux mint')) {
    installScript = linuxMintInstallScript;
  } else {
    const errorMessage = `Installing Podman is not suported on this distro and release: ${distro} & ${release}`;
    logger.error(errorMessage);
    return { error: errorMessage };
  }
  try {
    let stdout;
    let stderr;
    // eslint-disable-next-line prefer-const
    try {
      ({ stdout, stderr } = await execAwait(installScript, {
        log: true,
        sudo: true,
      }));
      logger.info('Install podman script stdout, stderr', stdout, stderr);
      sendMessageOnGrantPermissionToInstallPodman(true);
    } catch (installErr) {
      console.error(installErr);
      logger.error(JSON.stringify(installErr));
      // if user does not enter their password...
      //  installErr = "User did not grant permission"
      sendMessageOnGrantPermissionToInstallPodman(false);
      return {
        error: `Unable to install Podman. User denied granting NiceNode permission.`,
      };
    }
    return true;
  } catch (err) {
    // console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    return { error: `Unable to install Podman. ${err}` };
  }
};

export default installOnLinux;
