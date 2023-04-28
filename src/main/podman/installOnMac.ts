import { getNNDirPath } from '../files';
import * as arch from '../arch';
import logger from '../logger';
import { execAwait } from '../execHelper';
import { downloadFile } from '../downloadFile';
import {
  sendMessageOnDownloadProgress,
  sendMessageOnGrantPermissionToInstallPodman,
} from './messageFrontEnd';
import { startOnMac } from './start';

/**
 * Download podman-arch-verson.pkg, install podman, start podman
 * @param version example: 4.4.3 (without a v prefix)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installOnMac = async (version: string): Promise<any> => {
  logger.info(`Starting podman install...`);
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
      sendMessageOnDownloadProgress
    );
    let stdout;
    let stderr;
    // todo: wrap
    // eslint-disable-next-line prefer-const
    try {
      ({ stdout, stderr } = await execAwait(
        `installer -pkg "${podmanPkgFilePath}" -target / -verbose`,
        { log: true, sudo: true }
      ));
      sendMessageOnGrantPermissionToInstallPodman(true);
    } catch (installErr) {
      // if user does not enter their password...
      //  installErr = "User did not grant permission"
      sendMessageOnGrantPermissionToInstallPodman(false);
      return {
        error: `Unable to install Podman. User denied granting NiceNode permission.`,
      };
    }
    console.log('sudo installer -pkg stdout, stderr', stdout, stderr);
    // start podman app
    await startOnMac();

    // todoo: delete pkg
    ({ stdout, stderr } = await execAwait(`rm "${podmanPkgFilePath}"`, {
      log: true,
    }));
    console.log('rm pkg file stdout, stderr', stdout, stderr);

    return true;
  } catch (err) {
    // console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    return { error: `Unable to install Podman. ${err}` };
  }
};

export default installOnMac;
