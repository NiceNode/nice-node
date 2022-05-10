import { Docker, Options } from 'docker-cli-js';
import path from 'node:path';
import { spawn, SpawnOptions, ChildProcess } from 'node:child_process';
import * as readline from 'node:readline';

import logger from './logger';
import Node, { NodeStatus } from '../common/node';
import { DockerExecution } from '../common/nodeSpec';
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
    console.log('dockerWatchProcess event::::::', log);
    // {"status":"start","id":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","from":"nethermind/nethermind","Type":"container","Action":"start","Actor":{"ID":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","Attributes":{"git_commit":"2d3dd486d","image":"nethermind/nethermind","name":"magical_heyrovsky"}},"scope":"local","time":1651539480,"timeNano":1651539480501042702}
    // {"status":"die","id":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","from":"nethermind/nethermind","Type":"container","Action":"die","Actor":{"ID":"0c60f8cc2c9a990d992aa1a1cfd5ffdc1190ca2191afe88036f5210609bc483c","Attributes":{"exitCode":"0","git_commit":"2d3dd486d","image":"nethermind/nethermind","name":"magical_heyrovsky"}},"scope":"local","time":1651539480,"timeNano":1651539480851573969}
    // a die without a stop or kill is a crash
    try {
      const dockerEvent = JSON.parse(log);
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

export const getContainerDetails = async (containerIds: string[]) => {
  const data = await runCommand(
    `inspect ${containerIds.join(' ')} --format='{{json .}}'`
  );
  let details;
  if (data?.object) {
    // eslint-disable-next-line prefer-destructuring
    details = data?.object;
  }
  return details;
};

export const initialize = async () => {
  docker = new Docker(options);
  // const data = await docker.command('info');
  // logger.info(`Docker info data: ${JSON.stringify(data)}`);
  watchDockerEvents();

  //   console.log('fetching beacon node data...');
  //   const parsedData = await httpGetJson(
  //     'http://localhost:5052/eth/v1/config/spec',
  //     true
  //   );
  //   console.log('beacon node data parsedData: ', parsedData);
};

export const startDockerNode = async (node: Node): Promise<string[]> => {
  // pull image
  const { imageName, input } = node.spec.execution as DockerExecution;
  await runCommand(`pull ${imageName}`);

  // todo: custom setup: ex. create data directory
  // todo: check if there is a stopped container?

  // run
  // todo: use node options to create docker and node input
  // const dockerInput =
  //   '-d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052 -v /home/johns/.lighthouse:/root/.lighthouse';
  // const nodeInput =
  //   'lighthouse --network mainnet beacon --http --http-address 0.0.0.0';
  let dockerInput = '';
  if (input?.docker) {
    dockerInput = input?.docker;
  }
  let nodeInput = '';
  if (input?.default) {
    nodeInput = input?.default.join(' ');
  }
  const runData = await runCommand(
    `run ${dockerInput} ${imageName} ${nodeInput}`
  );

  const { containerId, raw, command } = runData;
  return [containerId];
};

export const stopDockerNode = async (node: Node) => {
  // run
  // todo: use node options to create docker and node input
  // todo: loop
  let containerIds;
  if (
    Array.isArray(node.monitoring.processIds) &&
    node.monitoring.processIds.length > 0
  ) {
    containerIds = node.monitoring.processIds;
    await runCommand(`stop ${containerIds[0]}`);
  } else {
    throw new Error('Unable to stop the node. No containerIds found.');
  }

  return containerIds;
};
