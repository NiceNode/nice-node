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
    let isWslInstalled = false;
    try {
      ({ stdout, stderr } = await execAwait('wsl -l -v', { log: true }));
      logger.info(`wsl list verbose output: ${stdout} ${stderr}`);
      const stdoutStr = iconv.decode(Buffer.from(stdout), 'ucs2');

      console.log('stdoutStr', JSON.stringify(stdoutStr));
      if (stdoutStr.includes('docker-desktop')) {
        console.log('docker desktop already installed');
        // use docker-cli isInsatll check too?
        return {
          message: 'Docker already installed!',
          isDockerInstalled: true,
        };
      }

      if (stdoutStr.includes('Ubuntu')) {
        isWslInstalled = true;
      }
    } catch (err) {
      console.log('wsl -l -v error: ', err);
    }

    if (!isWslInstalled) {
      // skip to docker install
      ({ stdout, stderr } = await execAwait('wsl --install', {
        log: true,
        sudo: true,
      }));
      console.log('wsl install stdout', stdout);
      console.log('wsl install stderr', stderr);
      logger.info(`wsl install output: ${stdout} ${stderr}`);
      const stdoutStr = iconv.decode(Buffer.from(stdout), 'ucs2');
      console.log('wsl install stdoutStr', JSON.stringify(stdoutStr));
      const stderrStr = iconv.decode(Buffer.from(stderr), 'ucs2');
      console.log('wsl install stderrStr', JSON.stringify(stderrStr));

      if (stderrStr.includes('is success')) {
        return {
          step: 'wsl_installed_without_reboot_or_user',
          message:
            'Install part 1 completed. Please restart your computer. After the restart, you will be prompted to enter a username and password. Once complete, open NiceNode for part 2.',
        };
      }
      return {
        error: `Unable to install part 1. Error message: ${stderrStr}`,
      };

      // verify Ubuntu exists
      // ({ stdout, stderr } = await execAwait('wsl --install', { log: true }));
      // if (!stdout.includes('Ubuntu')) {
      //   return { error: 'Failed installing wsl' };
      // }
    }
    logger.info('WSL installed. Skipping WSL install.');

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to install docker.');
    const errStr = iconv.decode(Buffer.from(err.toString()), 'ucs2');
    if (errStr.includes('system reboot is required')) {
      return { error: `Please reboot your computer.` };
    }
    return { error: `Unable to install Docker. ${errStr}` };
  }
};

export default installOnWindows;
