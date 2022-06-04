import { Docker, Options } from 'docker-cli-js';
import path from 'node:path';
import { spawn, SpawnOptions, ChildProcess } from 'node:child_process';
import * as readline from 'node:readline';

import { isWindows } from '../platform';
import logger from '../logger';
import Node, { NodeStatus } from '../../common/node';
import { DockerExecution } from '../../common/nodeSpec';
import { setDockerNodeStatus } from '../state/nodes';
import { buildCliConfig } from '../../common/nodeConfig';
import { send } from '../messenger';
import * as monitoring from './monitoring';

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
  false,
  undefined,
  undefined
);
let docker: Docker;

let dockerWatchProcess: ChildProcess;

const runCommand = async (command: string) => {
  if (!command.includes('stats')) {
    logger.info(`Running docker ${command}`);
  }
  const data = await docker.command(command);
  if (!command.includes('stats')) {
    logger.info(`DOCKER ${command} data: ${JSON.stringify(data)}`);
  }
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
  // --format '{{json .}}'
  // let watchInput = ['--format', "'{{json .}}'"];
  // if(isWindows()) {
  const watchInput = ['--format', '"{{json .}}"'];
  // }
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
    // console.log('dockerWatchProcess event::::::', log);
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
    `inspect ${containerIds.join(' ')} --format="{{json .}}"`
  );
  let details;
  if (data?.object) {
    // eslint-disable-next-line prefer-destructuring
    details = data?.object;
  }
  return details;
};

let sendLogsToUIProc: ChildProcess;
export const stopSendingLogsToUI = () => {
  // logger.info(`docker.stopSendingLogsToUI`);
  if (sendLogsToUIProc) {
    sendLogsToUIProc.kill();
  }
};
export const sendLogsToUI = (node: Node) => {
  logger.info(`Starting docker.sendLogsToUI for node ${node.spec.specId}`);

  // sendDockerLogsToUI is killed if (killed || exitCode === null)
  if (sendLogsToUIProc && !sendLogsToUIProc.killed) {
    logger.info(
      'sendLogsToUI process was running for another node. Killing that process.'
    );
    sendLogsToUIProc.kill();
  }
  const spawnOptions: SpawnOptions = {
    stdio: [null, 'pipe', 'pipe'],
    detached: false,
    shell: true,
  };
  const watchInput = [''];
  if (
    !Array.isArray(node.runtime.processIds) ||
    node.runtime.processIds.length < 1
  ) {
    logger.info('No logs to send if there is no container.');
    return;
  }
  const containerId = node.runtime.processIds[0];
  const childProcess = spawn(
    `docker logs -f -n 100 ${containerId}`,
    watchInput,
    spawnOptions
  );
  sendLogsToUIProc = childProcess;
  // todo some containers send to stderr, some send to stdout!
  //  ex. lighthouse sends logs to stderr
  if (!sendLogsToUIProc.stderr && !sendLogsToUIProc.stdout) {
    throw new Error('Docker watch events stdout stream is undefined.');
    return;
  }
  if (sendLogsToUIProc.stderr) {
    const rlStdErr = readline.createInterface({
      input: sendLogsToUIProc.stderr,
    });
    rlStdErr.on('line', (log: string) => {
      try {
        send('nodeLogs', log);
      } catch (err) {
        logger.error(`Error parsing docker event log ${log}`, err);
      }
    });
  }
  if (sendLogsToUIProc.stdout) {
    const rlStdOut = readline.createInterface({
      input: sendLogsToUIProc.stdout,
    });
    rlStdOut.on('line', (log: string) => {
      try {
        send('nodeLogs', log);
      } catch (err) {
        logger.error(`Error parsing docker event log ${log}`, err);
      }
    });
  }

  sendLogsToUIProc.stderr?.on('data', (data) => {
    // logger.error(`sendDockerLogsToUI::error:: `, data);
  });

  sendLogsToUIProc.on('error', (data) => {
    logger.error(`docker.sendLogsToUI::error:: `, data);
  });
  sendLogsToUIProc.on('disconnect', () => {
    logger.info(`docker.sendLogsToUI::disconnect::`);
  });
  // todo: restart?
  sendLogsToUIProc.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`docker.sendLogsToUI::close:: ${code}`);
    if (code !== 0) {
      logger.error(`Error starting node (geth) ${code}`);
      // todo: determine the error and show geth error logs to user.
    }
  });
  sendLogsToUIProc.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`docker.sendLogsToUI::exit:: ${code}, ${signal}`);
    if (code === 1) {
      logger.error('docker.sendLogsToUI::exit::error::');
    }
  });
};

export const initialize = async () => {
  logger.info('Connecting to local docker dameon...');
  try {
    docker = new Docker(options);
    watchDockerEvents();
    monitoring.initialize(runCommand);

    // todo: update docker node usages
  } catch (err) {
    console.error(err);
    // docker not installed?
    logger.info('Unable to initialize Docker. Docker may not be installed.');
  }
};

export const removeDockerNode = async (node: Node) => {
  logger.info(`removeDockerNode node specId ${node.spec.specId}`);
  let isRemoved = false;
  try {
    await runCommand(`container rm ${node.spec.specId}`);
    logger.info(
      `removeDockerNode container removed by name ${node.spec.specId}`
    );
    isRemoved = true;
  } catch (err) {
    logger.info('No containers to remove by name.');
  }
  if (isRemoved) {
    return true;
  }
  if (
    Array.isArray(node.runtime.processIds) &&
    node.runtime.processIds.length > 0
  ) {
    const containerIds = node.runtime.processIds;
    await runCommand(`container rm ${containerIds[0]}`);
    logger.info(`removeDockerNode container removed ${containerIds[0]}`);
    isRemoved = true;
  } else {
    logger.info('Unable to remove docker containers. No containerIds found.');
  }

  return isRemoved;
};

export const startDockerNode = async (node: Node): Promise<string[]> => {
  // pull image
  const { specId, execution } = node.spec;
  const { imageName, input } = execution as DockerExecution;
  // try catch? .. docker dameon might need to be restarted if a bad gateway error occurs
  await runCommand(`pull ${imageName}`);

  // todo: custom setup: ex. use network specific data directory?
  // todo: check if there is a stopped container?

  // (stop &) remove possible previous docker container for this node
  try {
    await removeDockerNode(node);
  } catch (err) {
    logger.info('Continuing start node.');
  }

  let dockerRawInput = '';
  let dockerVolumePath = '';
  let finalDockerInput = '';
  if (input?.docker) {
    dockerRawInput = input?.docker.raw ?? '';
    dockerVolumePath = input.docker.containerVolumePath;
    if (dockerRawInput) {
      finalDockerInput = dockerRawInput;
    }
    if (dockerVolumePath) {
      finalDockerInput = `-v "${node.runtime.dataDir}":${dockerVolumePath} ${finalDockerInput}`;
    }
  }
  let nodeInput = '';
  if (input?.docker?.forcedRawNodeInput) {
    nodeInput = input?.docker?.forcedRawNodeInput;
  }
  const cliConfigInput = buildCliConfig({
    configValuesMap: node.config.configValuesMap,
    configTranslationMap: node.spec.configTranslation,
    excludeConfigKeys: ['dataDir'],
  });
  nodeInput += ` ${cliConfigInput}`;

  const dockerCommand = `run -d --name ${specId} ${finalDockerInput} ${imageName} ${nodeInput}`;
  logger.info(`docker startNode command ${dockerCommand}`);
  // todo: test if input is empty string
  const runData = await runCommand(dockerCommand);

  const { containerId, raw, command } = runData;
  return [containerId];
};

export const stopDockerNode = async (node: Node) => {
  let containerIds;
  if (
    Array.isArray(node.runtime.processIds) &&
    node.runtime.processIds.length > 0
  ) {
    containerIds = node.runtime.processIds;
    await runCommand(`stop ${containerIds[0]}`);
  } else {
    throw new Error('Unable to stop the node. No containerIds found.');
  }

  return containerIds;
};

// todo: check docker version. check docker desktop is installed but not running
export const isDockerInstalled = async () => {
  let bIsDockerInstalled;
  logger.info('Checking isDockerInstalled...');
  try {
    const infoResult = await runCommand('-v');
    console.log('docker infoResult: ', infoResult);
    bIsDockerInstalled = true;
    logger.info(
      'Docker is installed. Docker version command did not throw error.'
    );
  } catch (err) {
    console.error(err);
    bIsDockerInstalled = false;
    // docker not installed?
    logger.info('Docker install not found.');
  }
  logger.info(`isDockerInstalled: ${bIsDockerInstalled}`);
  return bIsDockerInstalled;
};

export const onExit = () => {
  monitoring.onExit();
  if (dockerWatchProcess) {
    dockerWatchProcess.kill();
  }
  if (sendLogsToUIProc) {
    sendLogsToUIProc.kill();
  }
};
