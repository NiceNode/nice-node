import * as arch from '../../arch';
import { downloadFile } from '../../downloadFile';
import { reportEvent } from '../../events';
import { execAwait } from '../../execHelper';
import { getNNDirPath } from '../../files';
import logger from '../../logger';
import {
  sendMessageOnDownloadProgress,
  sendMessageOnGrantPermissionToInstallPodman,
} from '../messageFrontEnd';
import { startOnMac } from '../start';

/**
 * Download podman-arch-verson.pkg, install podman, start podman
 * @param version example: 4.4.3 (without a v prefix)
 */
const installOnMac = async (version: string): Promise<any> => {
  logger.info('Starting podman install...');
  try {
    let downloadUrl;
    if (arch.isArmAnd64bit()) {
      downloadUrl = `https://github.com/containers/podman/releases/download/v${version}/podman-installer-macos-arm64.pkg`;
    } else if (arch.isX86And64bit()) {
      downloadUrl = `https://github.com/containers/podman/releases/download/v${version}/podman-installer-macos-amd64.pkg`;
    } else {
      return {
        error: 'Unable to install podman. Unknown computer architecture.',
      };
    }
    logger.info(`Downloading Podman from url ${downloadUrl}`);
    const podmanPkgFilePath = await downloadFile(
      downloadUrl,
      getNNDirPath(),
      sendMessageOnDownloadProgress,
    );
    // todo: wrap
    try {
      const { stdout, stderr } = await execAwait(
        `installer -pkg "${podmanPkgFilePath}" -target / -verbose`,
        { log: true, sudo: true },
      );
      sendMessageOnGrantPermissionToInstallPodman(true);
      console.log('sudo installer -pkg stdout, stderr', stdout, stderr);
    } catch (installErr) {
      // if user does not enter their password...
      //  installErr = "User did not grant permission"
      sendMessageOnGrantPermissionToInstallPodman(false);
      return {
        error:
          'Unable to install Podman. User denied granting NiceNode permission.',
      };
    }
    // start podman app
    await startOnMac();

    // todoo: delete pkg
    const { stdout, stderr } = await execAwait(`rm "${podmanPkgFilePath}"`, {
      log: true,
    });
    console.log('rm pkg file stdout, stderr', stdout, stderr);

    return true;
  } catch (err: any) {
    // console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    reportEvent('ErrorInstallPodman', {
      error: err.toString(),
      podmanVersion: version,
    });
    return { error: `Unable to install Podman. ${err}` };
  }
};

export default installOnMac;
