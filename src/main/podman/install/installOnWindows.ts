import * as arch from '../../arch';
import { downloadFile } from '../../downloadFile';
import { reportEvent } from '../../events';
import { execAwait } from '../../execHelper';
import { getNNDirPath } from '../../files';
import logger from '../../logger';
import { sendMessageOnDownloadProgress } from '../messageFrontEnd';
import { startOnWindows } from '../start';

/**
 * Download podman.msi, install podman, handle reboot, and start podman
 * @param version example: 4.4.3 (without a v prefix)
 */
const installOnWindows = async (version: string): Promise<any> => {
  logger.info(`Starting podman install of version ${version}...`);

  try {
    // download and install podman
    let downloadUrl;
    if (arch.isX86And64bit()) {
      // ex: https://github.com/containers/podman/releases/download/v4.7.1/podman-4.7.1-setup.exe
      downloadUrl = `https://github.com/containers/podman/releases/download/v${version}/podman-${version}-setup.exe`;
    } else {
      return {
        error:
          'Unable to install Podman. Unsupported computer hardware (CPU is non-x86_64).',
      };
    }
    logger.info(`Downloading Podman from url ${downloadUrl}`);
    const podmanExeFilePath = await downloadFile(
      downloadUrl,
      getNNDirPath(),
      sendMessageOnDownloadProgress,
    );
    // const logFilePath = path.join(
    //   getNNDirPath(),
    //   'podman-install-log.txt',
    // );
    // don't delete the exe as it is used in the uninstall process here

    const { stdout, stderr } = await execAwait(
      `Start-Process -FilePath '${podmanExeFilePath}' -ArgumentList "-Silent -Quiet" -Wait -NoNewWindow -PassThru`,
      { log: true, shell: 'powershell.exe' },
    );

    // todo: find a way to see if the user gave the podman.exe permission to install
    // no way of knowing right now. nothing in stdout or stderr
    console.log(
      'podman install stdout, stderr ================ ',
      stdout,
      stderr,
    );

    const startResult = await startOnWindows();

    // could be from the user denying podman.exe permissions to install
    if (startResult?.error) {
      throw startResult?.error;
    }
    reportEvent('InstallPodmanSuccess', {
      podmanVersion: version,
    });

    return true;
  } catch (err: any) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    reportEvent('ErrorInstallPodman', {
      error: err.toString(),
      podmanVersion: version,
    });
    if (err.includes('system reboot is required')) {
      return { error: 'Please reboot your computer.' };
    }
    return { error: `Unable to install Podman. ${err}` };
  }
};

export default installOnWindows;
