import { Docker, Options } from 'docker-cli-js';
import path from 'node:path';
import { spawn, SpawnOptions, ChildProcess } from 'node:child_process';
import sleep from 'await-sleep';
import * as readline from 'node:readline';
import { Readable, Writable } from 'node:stream';

import logger from './logger';
import { DockerNode, DockerOptions, NodeStatus } from './node';
import { setDockerNodeStatus } from './state/nodes';

// const options = {
//   machineName: undefined, // uses local docker
//   currentWorkingDirectory: undefined, // uses current working directory
//   echo: true, // echo command output to stdout/stderr
//   env: undefined,
//   stdin: undefined,
// };

const options = new Options(
  undefined,
  path.join(__dirname),
  true,
  undefined,
  undefined
);
let docker: Docker;

let dockerWatchProcess: ChildProcess;

const runCommand = async (command: string) => {
  logger.info(`Running docker ${command}`);
  const data = await docker.command(command);
  logger.info(`DOCKER ${command} data: ${JSON.stringify(data)}`);
  return data;
};

const watchDockerEvents = async () => {
  logger.info('Starting dockerWatchProcess');

  // dockerWatchProcess is killed if (killed || exitCode === null)
  if (dockerWatchProcess && !dockerWatchProcess.killed) {
    logger.error(
      'dockerWatchProcess process still running. Wait to stop or stop first.'
    );
    return;
  }
  const spawnOptions: SpawnOptions = {
    stdio: [null, 'pipe', 'pipe'],
    detached: false,
    shell: true,
  };
  const watchInput = ['--format', "'{{json .}}'"];
  const childProcess = spawn('docker events', watchInput, spawnOptions);
  dockerWatchProcess = childProcess;
  if (!dockerWatchProcess.stdout) {
    throw new Error('Docker watch events stdout stream is undefined.');
    return;
  }
  const rl = readline.createInterface({
    input: dockerWatchProcess.stdout,
  });

  rl.on('line', (log: string) => {
    // console.log(`readlinereadlinereadlinereadlinereadlineReceived: ${log}`);
    console.log('dockerWatchProcess event::::::', log);
    // {"status":"start","id":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","from":"nethermind/nethermind","Type":"container","Action":"start","Actor":{"ID":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","Attributes":{"git_commit":"2d3dd486d","image":"nethermind/nethermind","name":"magical_heyrovsky"}},"scope":"local","time":1651539480,"timeNano":1651539480501042702}
    // {"status":"die","id":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","from":"nethermind/nethermind","Type":"container","Action":"die","Actor":{"ID":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","Attributes":{"exitCode":"0","git_commit":"2d3dd486d","image":"nethermind/nethermind","name":"magical_heyrovsky"}},"scope":"local","time":1651539480,"timeNano":1651539480851573969}
    try {
      const dockerEvent = JSON.parse(log);
      // const dockerEvent = log;
      if (dockerEvent.Action === 'die' && dockerEvent.Type === 'container') {
        // mark node as stopped
        logger.info('Docker container die event');
        setDockerNodeStatus(dockerEvent.id, NodeStatus.stopped);
      } else if (
        dockerEvent.Action === 'start' &&
        dockerEvent.Type === 'container'
      ) {
        logger.info('Docker container start event');
        // mark node as started
        setDockerNodeStatus(dockerEvent.id, NodeStatus.running);
      }
    } catch (err) {
      logger.error(`Error parsing docker event log ${log}`, err);
    }
  });

  dockerWatchProcess.stderr?.on('data', (data) => {
    logger.error(`dockerWatchProcess::error:: `, data);
  });

  dockerWatchProcess.on('error', (data) => {
    logger.error(`dockerWatchProcess::error:: `, data);
  });
  dockerWatchProcess.on('disconnect', () => {
    logger.info(`dockerWatchProcess::disconnect::`);
  });
  // todo: restart?
  dockerWatchProcess.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`dockerWatchProcess::close:: ${code}`);
    if (code !== 0) {
      logger.error(`Error starting node (geth) ${code}`);
      // todo: determine the error and show geth error logs to user.
    }
  });
  dockerWatchProcess.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`dockerWatchProcess::exit:: ${code}, ${signal}`);
    if (code === 1) {
      logger.error('dockerWatchProcess::exit::error::');
    }
  });
};

// containerList: [
//   {
//     'container id': '041558a3fd96',
//     image: 'sigp/lighthouse',
//     command: '"lighthouse --networ…"',
//     created: '55 seconds ago',
//     status: 'Up 54 seconds',
//     ports: '127.0.0.1:5052->5052/tcp, 0.0.0.0:9000->9000/tcp, 0.0.0.0:9000->9000/udp, :::9000->9000/tcp, :::9000->9000/udp',
//     names: 'keen_vaughan',
//     size: '0B (virtual 196MB)'
//   }
// ]
export const getRunningContainers = async () => {
  const data = await runCommand(`ps --no-trunc`);
  console.log('DOCKER ps -s data: ', data);
  let containers = [];
  if (data?.containerList && Array.isArray(data.containerList)) {
    containers = data.containerList;
  }
  return containers;
};

export const getContainerDetails = async (containerId: string) => {
  const data = await runCommand(`inspect container ${containerId}`);
  let details;
  if (Array.isArray(data)) {
    // eslint-disable-next-line prefer-destructuring
    details = data[0];
  }
  return details;
};

export const initialize = async () => {
  docker = new Docker(options);
  let data = await docker.command('info');
  watchDockerEvents();
  // check the status of all the containers
  // console.log('DOCKER info DATA: ', data);

  // data = await docker.command('pull sigp/lighthouse:latest-modern');
  // console.log('DOCKER docker pull: ', data);

  // run beacon node
  // console.log('DOCKER info DATA: ', data);
  // data = await docker.command(
  //   'run -v $HOME/.lighthouse:/root/.lighthouse sigp/lighthouse lighthouse beacon'
  // );
  data = await docker.command(`ps --no-trunc`);
  console.log('DOCKER ps -s data: ', data);
  if (data?.containerList && data.containerList[0]) {
    // const containerId = data.containerList[0]['container id'];
    // data = await docker.command(`logs -f -n 100 ${containerId}`);
    console.log('DOCKER stop data: ', data);
    // data = await docker.command(`stop ${containerId}`);
    // console.log('DOCKER stop data: ', data);
  }
  // containerList: [
  //   {
  //     'container id': '041558a3fd96',
  //     image: 'sigp/lighthouse',
  //     command: '"lighthouse --networ…"',
  //     created: '55 seconds ago',
  //     status: 'Up 54 seconds',
  //     ports: '127.0.0.1:5052->5052/tcp, 0.0.0.0:9000->9000/tcp, 0.0.0.0:9000->9000/udp, :::9000->9000/tcp, :::9000->9000/udp',
  //     names: 'keen_vaughan',
  //     size: '0B (virtual 196MB)'
  //   }
  // ]

  // data = await docker.command(
  //   'run -d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052 -v $HOME/.lighthouse:/root/.lighthouse sigp/lighthouse lighthouse --network mainnet beacon --http --http-address 0.0.0.0'
  // );
  // console.log('DOCKER docker run data: ', data);
  // const { containerId, raw, command } = data;
  // console.log('containerId: ', containerId);
  // console.log('DOCKER docker run data: ', data);
  // wait x time
  // try {
  //   await sleep(20000);

  //   console.log('fetching beacon node data...');
  //   const parsedData = await httpGetJson(
  //     'http://localhost:5052/eth/v1/config/spec',
  //     true
  //   );
  //   console.log('beacon node data parsedData: ', parsedData);
  //   data = await docker.command(`ps -s`);
  //   console.log('DOCKER ps -s data: ', data);

  //   // data = await docker.command(`stop ${containerId}`);
  //   // console.log('DOCKER stop data: ', data);
  // } catch (err) {
  //   // data = await docker.command(`stop ${containerId}`);
  //   // console.log('DOCKER stop data: ', data);
  // }

  // get logs/rpc stats

  // kill
};

export const startDockerNode = async (node: DockerNode): Promise<string[]> => {
  // pull image
  const { imageName } = node;
  await runCommand(`pull ${imageName}`);

  // todo: custom setup: ex. create data directory
  // todo: check if there is a stopped container?

  // run
  // todo: use node options to create docker and node input
  const dockerInput =
    '-d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052 -v /home/johns/.lighthouse:/root/.lighthouse';
  const nodeInput =
    'lighthouse --network mainnet beacon --http --http-address 0.0.0.0';
  const runData = await runCommand(
    `run ${dockerInput} ${imageName} ${nodeInput}`
  );
  // const runData = await runCommand(
  //   'run -d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052 -v $HOME/.lighthouse:/root/.lighthouse sigp/lighthouse lighthouse --network mainnet beacon --http --http-address 0.0.0.0'
  // );
  // return docker conainter ids?
  const { containerId, raw, command } = runData;
  return [containerId];
};

export const stopDockerNode = async (node: DockerOptions) => {
  // run
  // todo: use node options to create docker and node input
  // todo: loop
  const containerId = node.containerIds[0];
  await runCommand(`stop ${containerId}`);
  return containerId;
};

// dockerWatchProcess event:::::: {"status":"kill","id":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","from":"sigp/lighthouse","Type":"container","Action":"kill","Actor":{"ID":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","Attributes":{"image":"sigp/lighthouse","name":"elegant_khayyam","signal":"15"}},"scope":"local","time":1651536242,"timeNano":1651536242735114306}

// May 03 00:04:03.156 WARN Unable to free worker                   error: channel closed, msg: did not free worker, shutdown may be underway
// May 03 00:04:03.176 INFO Saved beacon chain to disk              service: beacon
// dockerWatchProcess event:::::: {"status":"die","id":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","from":"sigp/lighthouse","Type":"container","Action":"die","Actor":{"ID":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","Attributes":{"exitCode":"0","image":"sigp/lighthouse","name":"elegant_khayyam"}},"scope":"local","time":1651536243,"timeNano":1651536243201021597}

// DOCKER stop data:  {
//   command: 'docker  logs -f -n 100 60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf',
//   raw: ''
// }
// dockerWatchProcess event:::::: {"Type":"network","Action":"disconnect","Actor":{"ID":"f36a1d78464cae94e9183a44dc51e1bcc30d15cd76dd4986ce6989ff0210de97","Attributes":{"container":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","name":"bridge","type":"bridge"}},"scope":"local","time":1651536243,"timeNano":1651536243425774193}

// dockerWatchProcess event:::::: {"status":"stop","id":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","from":"sigp/lighthouse","Type":"container","Action":"stop","Actor":{"ID":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","Attributes":{"image":"sigp/lighthouse","name":"elegant_khayyam"}},"scope":"local","time":1651536243,"timeNano":1651536243519391266}

// 60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf
// info: DOCKER stop 60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf data: {"command":"docker  stop 60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf","raw":"60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf\n"} {"service":"nice-node-service"}
// info: 60a8bd6d6b0ccaf1330f00f8949a334fdcddd6d4545e3d42f09392c2e39ddacf stopped {"service":"nice-node-service"}
