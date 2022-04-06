import { promises as streamPromises } from 'stream';
// import { pipeline } from 'node:stream';
// import { promisify } from 'node:util';
import { createWriteStream } from 'fs';
import { access, chmod, mkdir } from 'fs/promises';
import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import sleep from 'await-sleep';

import { send, CHANNELS, MESSAGES } from './messenger';
import { execAwait } from './execHelper';
import { getNNDirPath, gethDataDir } from './files';
import {
  getGethDownloadURL,
  gethBuildNameForPlatformAndArch,
} from './gethDownload';
import { isWindows, isMac } from './platform';
import { getIsStartOnLogin } from './store';
import { registerChildProcess } from './processExit';

// const streamPipeline = promisify(pipeline);
const axios = require('axios').default;

let status = 'Uninitialized';
let gethProcess: ChildProcess;
let stopInitiatedAfterAStart = false; // For Windows lack of POSIX kill signals

export const downloadGeth = async () => {
  console.log('initializing geth');
  status = 'initializing';
  send(CHANNELS.geth, status);

  try {
    await access(gethDataDir());
  } catch {
    console.log('making geth data dir...');
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
    console.log('Geth not downloaded yet. downloading geth...');
    status = MESSAGES.downloading;
    send(CHANNELS.geth, status);
    try {
      console.log('fetching geth binary from github...');
      const res = await axios.get(getGethDownloadURL(), {
        responseType: 'stream',
      });
      // if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
      console.log('response from github ok');
      let fileOutPath = `${getNNDirPath()}/geth.tar.gz`;
      if (isWindows()) {
        fileOutPath = `${getNNDirPath()}/geth.zip`;
      }
      const fileWriteStream = createWriteStream(fileOutPath);
      const { data } = res;
      if (!data) {
        throw Error(`Error downloading geth`);
      }
      console.log('piping response from github to filestream');
      await streamPromises.pipeline(data, fileWriteStream);
      // await streamPipeline(data, fileWriteStream);
      console.log('done piping response from github to filestream');
      await fileWriteStream.close();
      // allow anyone to read the file
      console.log('closed file');
      await chmod(fileOutPath, 0o444);
      console.log('modified file permissions');
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
  console.log('geth download complete succeeded. unzipping...');
  status = MESSAGES.extracting;
  send(CHANNELS.geth, status);
  let tarCommand = `tar --directory ${getNNDirPath()} -xf ${getNNDirPath()}/geth.tar.gz`;
  // let tarCommand = `tar --extract --file ${getNNDirPath()}/geth.tar.gz --directory ${getNNDirPath()}`;
  if (isWindows()) {
    tarCommand = `tar -C ${getNNDirPath()} -xf ${getNNDirPath()}/geth.zip`;
  } else if (isMac()) {
    tarCommand = `tar --extract --file "${getNNDirPath()}/geth.tar.gz" --directory "${getNNDirPath()}"`;
  }
  const result = await execAwait(tarCommand);
  if (!result.err) {
    console.log('geth unzip complete succeeded');
    status = MESSAGES.readyToStart;
    send(CHANNELS.geth, status);
  } else {
    console.error(result.err);
  }
};

export const startGeth = async () => {
  console.log('Starting geth');
  stopInitiatedAfterAStart = false;

  // geth is killed if (killed || exitCode === null)
  if (gethProcess && !gethProcess.killed && gethProcess.exitCode === null) {
    console.log('gethProcess', gethProcess);
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
    '--identity',
    'NiceNode-0.0.6-1',
    // '--syncmode',
    // 'light',
    '--datadir',
    gethDataPath,
  ];
  console.log('Starting geth with input: ', gethInput);
  let execCommand = `./${gethBuildNameForPlatformAndArch()}/geth`;
  if (isWindows()) {
    execCommand = `${gethBuildNameForPlatformAndArch()}\\geth.exe`;
  }
  console.log(execCommand);
  const options: SpawnOptions = {
    cwd: `${getNNDirPath()}`,
    stdio: 'inherit',
    detached: false,
  };
  const childProcess = spawn(execCommand, gethInput, options);
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       if (!(stopInitiatedAfterAStart && isWindows())) {
  //         console.error(`geth start exec error: `, error);
  //         console.error(`geth start exec error: `, stdout);
  //         console.error(`geth start exec error: `, stderr);
  //         status = 'error starting';
  //         send(CHANNELS.geth, status);
  //         return;
  //       }
  //     }
  //     console.log(`geth start stdout: ${stdout}`);
  //     console.error(`geth start  stderr: ${stderr}`);
  //   }
  // );
  gethProcess = childProcess;
  gethProcess.on('error', (data) => {
    console.error(`Geth::error:: `, data);
  });
  gethProcess.on('disconnect', () => {
    console.log(`Geth::disconnect::`);
  });
  gethProcess.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    console.log(`Geth::close:: ${code}`);
  });
  gethProcess.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    console.log(`Geth::exit:: ${code}, ${signal}`);
    if (code === 1) {
      if (stopInitiatedAfterAStart && isWindows()) {
        console.log('Windows un-smooth stop');
        return;
      }
      status = 'error starting';
      send(CHANNELS.geth, status);
      console.error('Geth exit error: ');
    }
  });
  // gethProcess.stderr?.on('data', (data) => {
  //   console.log(`Geth::log:: ${data}`);
  // });
  // gethProcess.stdout?.on('data', (data) => {
  //   console.log(`Geth::stdout:: ${data}`);
  // });
  console.log('geth started successfully');
  status = 'running';
  send(CHANNELS.geth, status);
  // console.log('geth childProcess:', childProcess);
  console.log('geth childProcess pid:', childProcess.pid);
};

export const stopGeth = async () => {
  console.log('Stopping geth');
  stopInitiatedAfterAStart = true;

  if (!gethProcess) {
    console.error("geth hasn't been started");
    return;
  }
  console.log('Calling gethProcess.kill(). GethProcess: ', gethProcess);
  let killResult = gethProcess.kill();
  if (killResult && gethProcess.killed) {
    console.log('geth stopped successfully');
    status = 'stopped';
    send(CHANNELS.geth, status);
  } else {
    console.log('sleeping 5s to confirm if geth stopped');
    await sleep(5000);
    if (!gethProcess.killed) {
      console.log("SIGTERM didn't kill get in 5 seconds. sending SIGKILL");
      killResult = gethProcess.kill(9);
      if (killResult) {
        console.log('geth stopped successfully from SIGKILL');
        status = 'stopped';
        send(CHANNELS.geth, status);
      } else {
        status = 'error stopping';
        send(CHANNELS.geth, status);
        console.error('error stopping geth');
      }
    } else {
      console.log('geth stopped successfully from SIGTERM');
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
  console.log('process.env.NN_AUTOSTART_NODE: ', process.env.NN_AUTOSTART_NODE);
  if (getIsStartOnLogin() || process.env.NN_AUTOSTART_NODE === 'true') {
    startGeth();
  }
  registerChildProcess(gethProcess);
};
