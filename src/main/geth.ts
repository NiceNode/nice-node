// import { promises as streamPromises } from 'stream';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
// import fetch from 'node-fetch';

import { createWriteStream } from 'fs';
import { access, chmod, mkdir } from 'fs/promises';
import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import sleep from 'await-sleep';

import logger, { gethLogger } from './logger';
import { send, CHANNELS, MESSAGES } from './messenger';
import { execAwait } from './execHelper';
import { getNNDirPath, gethDataDir } from './files';
import {
  getGethDownloadURL,
  gethBuildNameForPlatformAndArch,
} from './gethDownload';
import { isWindows } from './platform';
import { getIsStartOnLogin } from './store';
import { registerChildProcess } from './processExit';
import { httpGet } from './httpReq';

const streamPipeline = promisify(pipeline);
// const axios = require('axios').default;
// const fetch = (...args: any) => {
//   // eslint-disable-next-line @typescript-eslint/no-shadow
//   // eslint-disable-next-line promise/catch-or-return, @typescript-eslint/no-shadow
//   import('node-fetch').then(({ default: fetch }) => fetch(...args));
// };
// const http = require('node:http');

let status = 'Uninitialized';
let gethProcess: ChildProcess;
let stopInitiatedAfterAStart = false; // For Windows lack of POSIX kill signals

export const downloadGeth = async () => {
  logger.info('initializing geth');
  status = 'initializing';
  send(CHANNELS.geth, status);

  try {
    await access(gethDataDir());
  } catch {
    logger.info('making geth data dir...');
    await mkdir(gethDataDir());
  }

  try {
    let gethCompressedPath = `${getNNDirPath()}/geth.tar.gz`;
    if (isWindows()) {
      gethCompressedPath = `${getNNDirPath()}/geth.zip`;
    }
    await access(gethCompressedPath);
    status = 'downloaded';
    send(CHANNELS.geth, status);
  } catch (err) {
    logger.info('Geth not downloaded yet. downloading geth...');
    status = MESSAGES.downloading;
    send(CHANNELS.geth, status);

    try {
      logger.info('fetching geth binary from github...');
      // const res = await axios.get(getGethDownloadURL(), {
      //   responseType: 'stream',
      // });

      const response = await httpGet(getGethDownloadURL());

      // const res = await fetch(getGethDownloadURL());
      // if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
      logger.info('response from github ok');
      let fileOutPath = `${getNNDirPath()}/geth.tar.gz`;
      if (isWindows()) {
        fileOutPath = `${getNNDirPath()}/geth.zip`;
      }
      const fileWriteStream = createWriteStream(fileOutPath);
      // const { data } = res;
      // if (!data) {
      //   throw Error(`Error downloading geth`);
      // }
      // if (!res.body) {
      //   throw Error(`Error downloading geth`);
      // }
      logger.info('piping response from github to filestream');
      // await streamPromises.pipeline(data, fileWriteStream);
      await streamPipeline(response, fileWriteStream);
      logger.info('done piping response from github to filestream');
      await fileWriteStream.close();

      // allow anyone to read the file
      logger.info('closed file');
      await chmod(fileOutPath, 0o444);
      logger.info('modified file permissions');
    } catch (err2) {
      console.error(err2, 'error downloading geth');
      status = 'error downloading';
      send(CHANNELS.geth, status);
      throw err2;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await unzipGeth();
  return true;
};

export const unzipGeth = async () => {
  logger.info('geth download complete succeeded. unzipping...');
  status = MESSAGES.extracting;
  send(CHANNELS.geth, status);
  let tarCommand = `tar --directory "${getNNDirPath()}" -xf "${getNNDirPath()}/geth.tar.gz"`;
  // let tarCommand = `tar --extract --file ${getNNDirPath()}/geth.tar.gz --directory ${getNNDirPath()}`;
  if (isWindows()) {
    tarCommand = `tar -C ${getNNDirPath()} -xf ${getNNDirPath()}/geth.zip`;
  }
  const result = await execAwait(tarCommand);
  if (!result.err) {
    logger.info('geth unzip complete succeeded');
    status = MESSAGES.readyToStart;
    send(CHANNELS.geth, status);
  } else {
    console.error(result.err);
  }
};

export const startGeth = async () => {
  logger.info('Starting geth');
  stopInitiatedAfterAStart = false;

  // geth is killed if (killed || exitCode === null)
  if (gethProcess && !gethProcess.killed && gethProcess.exitCode === null) {
    logger.info('gethProcess', gethProcess);
    console.error('Geth process still running. Wait to stop or stop first.');
    status = 'error starting';
    send(CHANNELS.geth, status);
    return;
  }

  const gethDataPath = gethDataDir();
  const gethInput = [
    '--ws',
    '--ws.origins',
    'https://ethvis.xyz,nice-node://',
    '--ws.api',
    'admin,engine,net,eth,web3',
    '--http',
    '--http.corsdomain',
    'nice-node://',
    '--identity',
    'NiceNode-0.2.0-1',
    // '--syncmode',
    // 'light',
    '--datadir',
    gethDataPath,
  ];
  logger.info('Starting geth with input: ', gethInput);
  let execCommand = `./${gethBuildNameForPlatformAndArch()}/geth`;
  if (isWindows()) {
    execCommand = `${gethBuildNameForPlatformAndArch()}\\geth.exe`;
  }
  logger.info(execCommand);
  const options: SpawnOptions = {
    cwd: `${getNNDirPath()}`,
    stdio: ['inherit', 'pipe', 'pipe'],
    detached: false,
  };
  const childProcess = spawn(execCommand, gethInput, options);
  gethProcess = childProcess;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGethLogStream = (data: Buffer | string | any) => {
    const gethLogs = data?.toString().split('\n ');
    gethLogs.forEach((log: string) => {
      // console.log('getProcess:: log:: ', log);
      if (log.includes('ERROR')) {
        gethLogger.error(log);
      } else {
        gethLogger.info(log);
      }
    });
  };
  gethProcess.stderr?.on('data', handleGethLogStream);
  gethProcess.stdout?.on('data', handleGethLogStream);
  gethProcess.on('error', (data) => {
    console.error(`Geth::error:: `, data);
  });
  gethProcess.on('disconnect', () => {
    logger.info(`Geth::disconnect::`);
  });
  gethProcess.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`Geth::close:: ${code}`);
  });
  gethProcess.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`Geth::exit:: ${code}, ${signal}`);
    if (code === 1) {
      if (stopInitiatedAfterAStart && isWindows()) {
        logger.info('Windows un-smooth stop');
        return;
      }
      status = 'error starting';
      send(CHANNELS.geth, status);
      console.error('Geth exit error: ');
    }
  });
  // gethProcess.stderr?.on('data', (data) => {
  //   logger.info(`Geth::log:: ${data}`);
  // });
  // gethProcess.stdout?.on('data', (data) => {
  //   logger.info(`Geth::stdout:: ${data}`);
  // });
  logger.info('geth started successfully');
  status = 'running';
  send(CHANNELS.geth, status);
  // logger.info('geth childProcess:', childProcess);
  logger.info('geth childProcess pid:', childProcess.pid);
};

export const stopGeth = async () => {
  logger.info('Stopping geth');
  stopInitiatedAfterAStart = true;

  if (!gethProcess) {
    console.error("geth hasn't been started");
    return;
  }
  // logger.info('Calling gethProcess.kill(). GethProcess: ', gethProcess);
  let killResult = gethProcess.kill();
  if (killResult && gethProcess.killed) {
    logger.info('geth stopped successfully');
    status = 'stopped';
    send(CHANNELS.geth, status);
  } else {
    logger.info('sleeping 5s to confirm if geth stopped');
    await sleep(5000);
    if (!gethProcess.killed) {
      logger.info("SIGTERM didn't kill get in 5 seconds. sending SIGKILL");
      killResult = gethProcess.kill(9);
      if (killResult) {
        logger.info('geth stopped successfully from SIGKILL');
        status = 'stopped';
        send(CHANNELS.geth, status);
      } else {
        status = 'error stopping';
        send(CHANNELS.geth, status);
        console.error('error stopping geth');
      }
    } else {
      logger.info('geth stopped successfully from SIGTERM');
      status = 'stopped';
      send(CHANNELS.geth, status);
    }
  }
};

export const getStatus = () => {
  return status;
};

export const initialize = async () => {
  // make sure geth is downloaded and ready to go
  await downloadGeth();
  // check if geth should be auto started
  logger.info('process.env.NN_AUTOSTART_NODE: ', process.env.NN_AUTOSTART_NODE);
  if (getIsStartOnLogin() || process.env.NN_AUTOSTART_NODE === 'true') {
    startGeth();
  }
  registerChildProcess(gethProcess);
};
