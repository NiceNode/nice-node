// todo: windows only
import logger from '../logger';
import { execAwait } from '../execHelper';

const { StringDecoder } = require('node:string_decoder');
const iconv = require('iconv-lite');

/**
 * Install WSL, download docker.exe, install docker, start docker
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installDocker = async (): Promise<any> => {
  // install ws
  // run "docker-compose --version"
  logger.info(`Starting docker install...`);

  try {
    // check if wsl is installed and install
    let { stdout, stderr } = await execAwait('wsl -l -v', { log: true });
    console.log('stdout', stdout);
    // const decoder = new StringDecoder('utf8');
    const stdoutStr = iconv.decode(Buffer.from(stdout), 'ucs2');
    // const stdoutStr = decoder.end();
    // console.log('stdoutStr', stdoutStr);

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

    // download docker
    // win, amd64: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
  } catch (err) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to install docker.');
  }
};

export default installDocker;
