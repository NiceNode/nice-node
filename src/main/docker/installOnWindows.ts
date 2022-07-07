import { spawn } from 'node:child_process';
import logger from '../logger';
import { execAwait } from '../execHelper';
import * as arch from '../arch';
import { downloadFile } from '../downloadFile';
import { getNNDirPath } from '../files';

const iconv = require('iconv-lite');

/**
 * Install WSL, download docker.exe, install docker, start docker
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installOnWindows = async (): Promise<any> => {
  logger.info(`Starting docker install...`);

  try {
    // check if wsl is installed and install
    let stdout;
    let stderr;
    ({ stdout, stderr } = await execAwait('wsl -l -v', { log: true }));
    console.log('stdout', stdout);
    const stdoutStr = iconv.decode(Buffer.from(stdout), 'ucs2');

    console.log('stdoutStr', JSON.stringify(stdoutStr));
    console.log('tet', JSON.stringify('test'));
    if (stdoutStr.includes('docker-desktop')) {
      console.log('docker desktop already installed');
      // use docker-cli isInsatll check too?
      return { message: 'Docker already installed!', isDockerInstalled: true };
    }
    if (!stdoutStr.includes('Ubuntu')) {
      // skip to docker install
      logger.info(`wsl list verbose output: ${stdout} ${stderr}`);
      ({ stdout, stderr } = await execAwait('wsl --install', { log: true }));
      console.log('stdout', stdout);
      console.log('stderr', stderr);
      logger.info(`wsl install output: ${stdout} ${stderr}`);

      // verify Ubuntu exists
      ({ stdout, stderr } = await execAwait('wsl --install', { log: true }));
      if (!stdout.includes('Ubuntu')) {
        return { error: 'Failed installing wsl' };
      }
    }

    // download and install docker
    let downloadUrl;
    if (arch.isX86And64bit()) {
      downloadUrl =
        'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe';
    } else {
      return {
        error:
          'Unable to install docker. Unsupported computer hardware (CPU is non-x86_64).',
      };
    }
    logger.info(`Downloading Docker from url ${downloadUrl}`);
    const dockerExeFilePath = await downloadFile(downloadUrl, getNNDirPath());
    ({ stdout, stderr } = await execAwait(
      `start /w "" "${dockerExeFilePath}" install --quiet --accept-license --backend=wsl-2`,
      { log: true }
    ));
    console.log('docker install stdout, stderr', stdout, stderr);
    // To start an exe does not return after it starts.
    //  It returns when the exe stops, in this case, we don't want to wait.
    //  Use spawn here so that if NiceNode is closed, Docker continues running
    spawn('C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe', [], {
      detached: true,
      stdio: 'ignore',
    });
    console.log('docker exe start stdout, stderr', stdout, stderr);
    return true;
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to install docker.');
    return { error: `Unable to install Docker. ${err}` };
  }
};

export default installOnWindows;
