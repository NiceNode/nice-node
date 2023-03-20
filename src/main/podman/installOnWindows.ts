import logger from '../logger';
import { execAwait } from '../execHelper';
import * as arch from '../arch';
import { downloadFile } from '../downloadFile';
import { getNNDirPath } from '../files';
import { sendMessageOnDownloadProgress } from './messageFrontEnd';
import { startOnWindows } from './start';

const iconv = require('iconv-lite');

/**
 * Download podman.msi, install podman, handle reboot, and start podman
 * @param version example: 4.4.2 (without a v prefix)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installOnWindows = async (version: string): Promise<any> => {
  logger.info(`Starting podman install of version ${version}...`);

  try {
    let stdout;
    let stderr;

    // download and install podman
    let downloadUrl;
    if (arch.isX86And64bit()) {
      downloadUrl = `https://github.com/containers/podman/releases/download/v${version}/podman-v${version}.msi`;
    } else {
      return {
        error:
          'Unable to install Podman. Unsupported computer hardware (CPU is non-x86_64).',
      };
    }
    logger.info(`Downloading Podman from url ${downloadUrl}`);
    const podmanMsiFilePath = await downloadFile(
      downloadUrl,
      getNNDirPath(),
      sendMessageOnDownloadProgress
    );
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(
      `msiexec /a ${podmanMsiFilePath} /qn /lv .\\log.txt`,
      { log: true, sudo: true }
    ));
    // todo: report logs if fails?
    console.log('podman install stdout, stderr', stdout, stderr);

    await startOnWindows();

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to install podman.');
    const errStr = iconv.decode(Buffer.from(err.toString()), 'ucs2');
    if (errStr.includes('system reboot is required')) {
      return { error: `Please reboot your computer.` };
    }
    return { error: `Unable to install Docker. ${errStr}` };
  }
};

export default installOnWindows;
