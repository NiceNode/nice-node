import { promises as streamPromises } from 'stream';
import { createWriteStream } from 'fs';
import { access, chmod, mkdir } from 'fs/promises';
import { ChildProcess, execFile } from 'child_process';
import sleep from 'await-sleep';

import { send, CHANNELS, MESSAGES } from './messenger';
import { execAwait } from './execHelper';
import { getNNDirPath, gethDataDir } from './files';
import {
  getGethDownloadURL,
  gethBuildNameForPlatformAndArch,
} from './gethDownload';
import { isWindows } from './platform';

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
      // const { body } = res;
      const { data } = res;
      if (!data) {
        throw Error(`Error downloading geth`);
      }
      console.log('piping response from github to filestream');
      await streamPromises.pipeline(data, fileWriteStream);
      console.log('done piping response from github to filestream');
      await fileWriteStream.close();
      // allow anyone to read the file
      await chmod(fileOutPath, 0o444);
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
  let tarCommand = `tar --extract --file ${getNNDirPath()}/geth.tar.gz --directory ${getNNDirPath()}`;
  if (isWindows()) {
    tarCommand = `tar -C ${getNNDirPath()} -xf ${getNNDirPath()}/geth.zip`;
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

  if (gethProcess && !gethProcess.killed) {
    console.error('Geth process still running. Wait to stop or stop first.');
    status = 'error starting';
    send(CHANNELS.geth, status);
    return;
  }

  const gethDataPath = gethDataDir();
  const gethInput = [
    '--ws',
    '--ws.origins',
    'https://ethvis.xyz,http://localhost:1212',
    '--ws.api',
    '"admin,engine,net,eth,web3,subscribe,miner,txpool"',
    '--identity',
    'NiceNode-0.0.5-1',
    '--datadir',
    gethDataPath,
  ];
  console.log('Starting geth with input: ', gethInput);
  let execCommand = `./${gethBuildNameForPlatformAndArch()}/geth`;
  if (isWindows()) {
    execCommand = `${gethBuildNameForPlatformAndArch()}\\geth.exe`;
  }
  console.log(execCommand);
  const childProcess = execFile(
    execCommand,
    gethInput,
    { cwd: `${getNNDirPath()}` },
    (error, stdout, stderr) => {
      if (error) {
        if (!(stopInitiatedAfterAStart && isWindows())) {
          console.error(`geth start exec error: `, error);
          console.error(`geth start exec error: `, stdout);
          console.error(`geth start exec error: `, stderr);
          status = 'error starting';
          send(CHANNELS.geth, status);
          return;
        }
      }
      console.log(`geth start stdout: ${stdout}`);
      console.error(`geth start  stderr: ${stderr}`);
    }
  );
  gethProcess = childProcess;
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
