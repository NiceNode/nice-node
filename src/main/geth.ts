import { promises as streamPromises } from 'stream';
import { createWriteStream } from 'fs';
import { access } from 'fs/promises';
import { ChildProcess, execFile } from 'child_process';
import sleep from 'await-sleep';

import { send, CHANNELS, MESSAGES } from './messenger';
import { exec, execAwait } from './execHelper';

const fetch = require('node-fetch');

export const prepareToStart = async () => {};

let status = 'Uninitialized';
let gethProcess: ChildProcess;

export const downloadGeth = async () => {
  console.log('downloading geth');
  status = 'initializing';
  send(CHANNELS.geth, status);
  try {
    await access('geth.tar.gz');
    status = 'downloaded';
    send(CHANNELS.geth, status);
  } catch (err) {
    console.log('Geth not downloaded yet. downloading geth...');
    status = MESSAGES.downloading;
    send(CHANNELS.geth, status);
    try {
      const res = await fetch(
        'https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.16-20356e57.tar.gz'
      );
      if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
      const filePath = createWriteStream('geth.tar.gz');
      const { body } = res;
      if (!body) {
        throw Error(`Error downloading get`);
      }
      await streamPromises.pipeline(body, filePath);
    } catch (err2) {
      console.error(err2, 'error extracting geth');
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
  const result = await execAwait('tar -xf geth.tar.gz');
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

  const childProcess = execFile(
    './geth-linux-amd64-1.10.16-20356e57/geth',
    [
      '--ws',
      '--ws.origins',
      'https://ethvis.xyz,http://localhost:3000',
      '--ws.api',
      '"engine,net,eth,web3,subscribe,miner,txpool"',
    ],
    (error, stdout, stderr) => {
      if (error) {
        console.error(`geth start exec error: ${error}`);
        status = 'error starting';
        send(CHANNELS.geth, status);
        return;
      }
      console.log(`geth start stdout: ${stdout}`);
      console.error(`geth start  stderr: ${stderr}`);
    }
  );
  gethProcess = childProcess;
  console.log('geth started successfully');
  status = 'running';
  send(CHANNELS.geth, status);
  console.log('geth childProcess:', childProcess);
  console.log('geth childProcess pid:', childProcess.pid);
};

export const stopGeth = async () => {
  console.log('Stopping geth');

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
