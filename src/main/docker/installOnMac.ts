import * as arch from '../arch';
import { downloadFile } from '../downloadFile';
import { execAwait } from '../execHelper';
import { getNNDirPath } from '../files';
import logger from '../logger';
import { sendMessageOnDownloadProgress } from './messageFrontEnd';
import { startOnMac } from './start';

/**
 * Download docker.dmg, install docker, start docker
 */
const installOnMac = async (): Promise<any> => {
  logger.info('Starting docker install...');
  try {
    let downloadUrl;
    if (arch.isArmAnd64bit()) {
      downloadUrl = 'https://desktop.docker.com/mac/main/arm64/Docker.dmg';
    } else if (arch.isX86And64bit()) {
      downloadUrl = 'https://desktop.docker.com/mac/main/amd64/Docker.dmg';
    } else {
      return {
        error: 'Unable to install docker. Unknown computer architecture.',
      };
    }
    logger.info(`Downloading Docker from url ${downloadUrl}`);
    const dockerDmgFilePath = await downloadFile(
      downloadUrl,
      getNNDirPath(),
      sendMessageOnDownloadProgress,
    );

    const { stdout, stderr } = await execAwait(
      `hdiutil attach "${dockerDmgFilePath}" && /Volumes/Docker/Docker.app/Contents/MacOS/install --accept-license && hdiutil detach /Volumes/Docker`,
      { log: true, sudo: true },
    );
    console.log(
      'sudo hdiutil attach, install, detach stdout, stderr',
      stdout,
      stderr,
    );
    // start docker app
    await startOnMac();

    // todo: reboot needed?
    console.log('open docker app stdout, stderr', stdout, stderr);
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to install docker.');
    return { error: `Unable to install Docker. ${err}` };
  }
};

export default installOnMac;
