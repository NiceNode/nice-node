import logger from '../logger';
import { execAwait } from '../execHelper';
import { sendMessageOnGrantPermissionToInstallPodman } from './messageFrontEnd';
import { getOperatingSystemInfo } from '../systemInfo';
import { script as ubuntuInstallScript } from './installOnUbuntuScript';

// const UBUNTU_INSTALL_SCRIPT = 'installOnUbuntuScript';
/**
 * Download podman-arch-verson.pkg, install podman, start podman
 * @param version example: 4.4.3 (without a v prefix)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installOnLinux = async (): Promise<any> => {
  logger.info(`Starting podman install on Linux...`);
  const { distro } = await getOperatingSystemInfo();

  let installScript = '';
  if (distro === 'Ubuntu') {
    installScript = ubuntuInstallScript;
  } else {
    logger.error('Only the distro Ubuntu is supported for installing Podman');
  }
  try {
    let stdout;
    let stderr;
    // todo: wrap
    // eslint-disable-next-line prefer-const
    try {
      ({ stdout, stderr } = await execAwait(installScript, {
        log: true,
        sudo: true,
      }));
      console.log(
        'Ubuntu install podman script stdout, stderr',
        stdout,
        stderr
      );
      sendMessageOnGrantPermissionToInstallPodman(true);
    } catch (installErr) {
      console.error(installErr);
      // if user does not enter their password...
      //  installErr = "User did not grant permission"
      sendMessageOnGrantPermissionToInstallPodman(false);
      return {
        error: `Unable to install Podman. User denied granting NiceNode permission.`,
      };
    }
    console.log('sudo ubuntu install script stdout, stderr', stdout, stderr);

    return true;
  } catch (err) {
    // console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    return { error: `Unable to install Podman. ${err}` };
  }
};

export default installOnLinux;
