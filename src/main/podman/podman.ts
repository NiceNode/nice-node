import { spawn, SpawnOptions, ChildProcess } from 'node:child_process';
import * as readline from 'node:readline';

import logger from '../logger';
import Node, { NodeStatus } from '../../common/node';
import { DockerExecution as PodmanExecution } from '../../common/nodeSpec';
import { setDockerNodeStatus as setPodmanNodeStatus } from '../state/nodes';
import { buildCliConfig } from '../../common/nodeConfig';
import { send } from '../messenger';
import * as monitoring from './monitoring';
import { killChildProcess } from '../processExit';
import { parseDockerLogMetadata as parsePodmanLogMetadata } from '../util/nodeLogUtils';
import { execPromise as podmanExecPromise } from './podman-desktop/podman-cli';

let podmanWatchProcess: ChildProcess;

const runCommand = async (command: string) => {
  if (!command.includes('stats') && !command.includes('info')) {
    logger.info(`Running podman ${command}`);
  }
  const data = await podmanExecPromise(`podman ${command}`);
  if (!command.includes('stats') && !command.includes('info')) {
    logger.info(`Podman ${command} data: ${JSON.stringify(data)}`);
  }
  return data;
};

const watchPodmanEvents = async () => {
  logger.info('Starting podmanWatchProcess');

  // podmanWatchProcess is killed if (killed || exitCode === null)
  if (podmanWatchProcess && !podmanWatchProcess.killed) {
    logger.error(
      'podmanWatchProcess process still running. Wait to stop or stop first.'
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
  const childProcess = spawn('podman events', watchInput, spawnOptions);
  podmanWatchProcess = childProcess;
  if (!podmanWatchProcess.stdout) {
    throw new Error('Podman watch events stdout stream is undefined.');
    return;
  }
  const rl = readline.createInterface({
    input: podmanWatchProcess.stdout,
  });

  rl.on('line', (log: string) => {
    console.log('podmanWatchProcess event::::::', log);
    /**
     * {"Name":"docker.io/hyperledger/besu:latest",
     *    "Status":"pull","Time":"2023-03-07T11:24:33.736404783-08:00","Type":"image",
     *      "Attributes":{"podId":""}}
              {
              "ID":"1fb9cc9d810b1481cd0e4a380f1b47a4f3ff1b3771a069f3a382e0f90bfc6bb4",
              "Image":"docker.io/hyperledger/besu:latest",
              "Name":"besu",
              "Status":"start",
              "Time":"2023-03-07T11:26:30.597007105-08:00",
              "Type":"container",
              "Attributes":{
                  "org.label-schema.build-date":"2023-02-17T08:07Z",
                  "org.label-schema.description":"Enterprise Ethereum client",
                  "org.label-schema.name":"Besu",
                  "org.label-schema.schema-version":"1.0",
                  "org.label-schema.url":"https://besu.hyperledger.org/",
                  "org.label-schema.vcs-ref":"79c1a97f",
                  "org.label-schema.vcs-url":"https://github.com/hyperledger/besu.git",
                  "org.label-schema.vendor":"Hyperledger",
                  "org.label-schema.version":"23.1.0",
                  "org.opencontainers.image.ref.name":"ubuntu",
                  "org.opencontainers.image.version":"20.04",
                  "podId":""
              }
        }
     */
    // a die without a stop or kill is a crash
    try {
      const podmanEvent = JSON.parse(log);
      if (podmanEvent.Status === 'died' && podmanEvent.Type === 'container') {
        // mark node as stopped
        logger.info('Podman container die event');
        setPodmanNodeStatus(podmanEvent.ID, NodeStatus.stopped);
      } else if (
        podmanEvent.Status === 'start' &&
        podmanEvent.Type === 'container'
      ) {
        logger.info('Podman container start event');
        // mark node as started
        setPodmanNodeStatus(podmanEvent.ID, NodeStatus.running);
      }
    } catch (err) {
      logger.error(`Error parsing podman event log ${log}`, err);
    }
  });

  podmanWatchProcess.stderr?.on('data', (data) => {
    logger.error(`podmanWatchProcess::error:: `, data);
  });

  podmanWatchProcess.on('error', (data) => {
    logger.error(`podmanWatchProcess::error:: `, data);
  });
  podmanWatchProcess.on('disconnect', () => {
    logger.info(`podmanWatchProcess::disconnect::`);
  });
  // todo: restart?
  podmanWatchProcess.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    rl.close();
    logger.info(`podmanWatchProcess::close:: ${code}`);
    if (code !== 0) {
      logger.error(
        `podmanWatchProcess::close:: with non-zero exit code ${code}`
      );
      // todo: determine the error and show geth error logs to user.
    }
  });
  podmanWatchProcess.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`podmanWatchProcess::exit:: ${code}, ${signal}`);
    if (code === 1) {
      logger.error('podmanWatchProcess::exit::error::');
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
  console.log('podman ps -s data: ', data);
  // let containers = [];
  // if (data?.containerList && Array.isArray(data.containerList)) {
  //   containers = data.containerList;
  // }
  return data;
};

export const getContainerDetails = async (containerIds: string[]) => {
  const data = await runCommand(
    `inspect ${containerIds.join(' ')} --format="{{json .}}"`
  );
  // console.log('getContainerDetails containerIds: ', data);
  // let details;
  // if (data?.object) {
  //   // eslint-disable-next-line prefer-destructuring
  //   details = data?.object;
  // }
  return JSON.parse(data);
};

let sendLogsToUIProc: ChildProcess;
export const stopSendingLogsToUI = () => {
  // logger.info(`podman.stopSendingLogsToUI`);
  if (sendLogsToUIProc) {
    logger.info(
      'sendLogsToUI process was running for another node. Killing that process.'
    );
    killChildProcess(sendLogsToUIProc);
  }
};
export const sendLogsToUI = (node: Node) => {
  logger.info(`Starting podman.sendLogsToUI for node ${node.spec.specId}`);

  stopSendingLogsToUI();
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
    `podman logs --follow --timestamps --tail 100 ${containerId}`,
    watchInput,
    spawnOptions
  );
  sendLogsToUIProc = childProcess;
  // todo some containers send to stderr, some send to stdout!
  //  ex. lighthouse sends logs to stderr
  if (!sendLogsToUIProc.stderr && !sendLogsToUIProc.stdout) {
    throw new Error('Podman watch events stdout stream is undefined.');
    return;
  }
  let rlStdErr: readline.Interface;
  if (sendLogsToUIProc.stderr) {
    rlStdErr = readline.createInterface({
      input: sendLogsToUIProc.stderr,
    });
    // some nodes, such as geth, send all logs over stderr
    rlStdErr.on('line', (log: string) => {
      // logger.info(`podman log read for ${node.spec.specId}`);
      try {
        send('nodeLogs', parsePodmanLogMetadata(log));
      } catch (err) {
        logger.error(`Error parsing podman event log ${log}`, err);
      }
    });
  }
  let rlStdOut: readline.Interface;
  if (sendLogsToUIProc.stdout) {
    rlStdOut = readline.createInterface({
      input: sendLogsToUIProc.stdout,
    });
    rlStdOut.on('line', (log: string) => {
      // logger.info(`podman log read for ${node.spec.specId}`);

      // can use these logs to generate tests
      // console.log('log metadata without:', log);
      // logger.info('log metadata:', parsePodmanLogMetadata(log));
      try {
        // parse log metadata before sending to the UI
        send('nodeLogs', parsePodmanLogMetadata(log));
        // send('nodeLogs', log);
      } catch (err) {
        logger.error(`Error parsing podman event log ${log}`, err);
      }
    });
  }

  sendLogsToUIProc.on('error', (data) => {
    logger.error(`podman.sendLogsToUI::error:: `, data);
  });
  sendLogsToUIProc.on('disconnect', () => {
    logger.info(`podman.sendLogsToUI::disconnect::`);
  });
  // todo: restart?
  sendLogsToUIProc.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    if (rlStdErr) {
      rlStdErr.close();
    }
    if (rlStdOut) {
      rlStdOut.close();
    }
    logger.info(`podman.sendLogsToUI::close:: ${code}`);
    if (code !== 0) {
      logger.error(
        `podman.sendLogsToUI::close:: with non-zero exit code ${code}`
      );
      // todo: determine the error and show geth error logs to user.
    }
  });
  sendLogsToUIProc.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`podman.sendLogsToUI::exit:: ${code}, ${signal}`);
    if (code === 1) {
      logger.error('podman.sendLogsToUI::exit::error::');
    }
  });
};

export const initialize = async () => {
  logger.info('Connecting to local podman dameon...');
  try {
    // podman = new Podman(options);
    watchPodmanEvents();
    monitoring.initialize(runCommand);
    // todo: update podman node usages
    // runCommand('-v');
  } catch (err) {
    console.error(err);
    // podman not installed?
    logger.info('Unable to initialize Podman. Podman may not be installed.');
  }
};

export const stopPodmanNode = async (node: Node) => {
  // todo: could try stopping container by name using node spec
  let isRemoved = false;
  try {
    await runCommand(`stop ${node.spec.specId}`);
    logger.info(`stopPodmanNode container stopped by name ${node.spec.specId}`);
    isRemoved = true;
  } catch (err) {
    // todo: returns an error?
    logger.info('No containers to stop by name.');
  }
  if (isRemoved) {
    return true;
  }
  let containerIds;
  if (
    Array.isArray(node.runtime.processIds) &&
    node.runtime.processIds.length > 0
  ) {
    containerIds = node.runtime.processIds;
    await runCommand(`stop ${containerIds[0]}`);
  } else {
    throw new Error('Unable to stop the node. No containerIds found.');
    // marked as stopped?
  }

  return containerIds;
};

export const removePodmanNode = async (node: Node) => {
  logger.info(`removePodmanNode node specId ${node.spec.specId}`);
  let isRemoved = false;
  // (stop &) remove possible previous podman container for this node
  try {
    await stopPodmanNode(node);
  } catch (err) {
    logger.error(err);
    logger.info('Error in stopping podman node. Continuing remove node.');
  }
  try {
    await runCommand(`container rm ${node.spec.specId}`);
    logger.info(
      `removePodmanNode container removed by name ${node.spec.specId}`
    );
    isRemoved = true;
  } catch (err) {
    // todo: returns an error when the container is running
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
    logger.info(`removePodmanNode container removed ${containerIds[0]}`);
    isRemoved = true;
  } else {
    logger.info('Unable to remove podman containers. No containerIds found.');
  }

  return isRemoved;
};

export const createRunCommand = (node: Node): string => {
  const { specId, execution } = node.spec;
  const { imageName, input } = execution as PodmanExecution;
  // try catch? .. podman dameon might need to be restarted if a bad gateway error occurs

  let podmanRawInput = '';
  let podmanVolumePath = '';
  let finalPodmanInput = '';
  if (input?.docker) {
    podmanRawInput = input?.docker.raw ?? '';
    podmanVolumePath = input.docker.containerVolumePath;
    if (podmanRawInput) {
      finalPodmanInput = podmanRawInput;
    }
    if (podmanVolumePath) {
      finalPodmanInput = `-v "${node.runtime.dataDir}":${podmanVolumePath} ${finalPodmanInput}`;
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

  // -q quiets podman logs (pulling new image logs) so we can parse the containerId
  const podmanCommand = `run -q -d --name ${specId} ${finalPodmanInput} ${imageName} ${nodeInput}`;
  logger.info(`podman run command ${podmanCommand}`);
  return podmanCommand;
};

export const startPodmanNode = async (node: Node): Promise<string[]> => {
  // pull image
  const { execution } = node.spec;
  const { imageName } = execution as PodmanExecution;
  // try catch? .. podman dameon might need to be restarted if a bad gateway error occurs
  await runCommand(`pull ${imageName}`);

  // todo: custom setup: ex. use network specific data directory?
  // todo: check if there is a stopped container?

  // (stop &) remove possible previous podman container for this node
  try {
    await removePodmanNode(node);
  } catch (err) {
    logger.info('Continuing start node.');
  }

  const podmanCommand = createRunCommand(node);
  // todo: test if input is empty string
  const runData = await runCommand(podmanCommand);
  // todoo: get containerId by container name?
  const containerId = runData;
  return [containerId];
};

export const isPodmanInstalled = async () => {
  let bIsPodmanInstalled;
  logger.info('Checking isPodmanInstalled...');
  try {
    const infoResult = await runCommand('-v');
    console.log('podman infoResult: ', infoResult);
    bIsPodmanInstalled = true;
    logger.info(
      'Podman is installed. Podman version command did not throw error.'
    );
  } catch (err) {
    logger.error(err);
    bIsPodmanInstalled = false;
    // podman not installed?
    logger.info('Podman install not found.');
  }
  logger.info(`isPodmanInstalled: ${bIsPodmanInstalled}`);
  return bIsPodmanInstalled;
};

export const isPodmanRunning = async () => {
  let bIsPodmanRunning;
  logger.info('Checking isPodmanRunning...');
  try {
    // Podman is running if the info command did not throw error.
    await runCommand('info');
    bIsPodmanRunning = true;
  } catch (err) {
    // [mac verified] "error cannot connect to the podman dameon"
    logger.error(err);
    bIsPodmanRunning = false;
    logger.info('Podman engine not found.');
  }
  if (!bIsPodmanRunning) {
    logger.info(`isPodmanRunning: ${bIsPodmanRunning}`);
  }
  return bIsPodmanRunning;
};

// todoo
// setTimeout(() => {
//   isPodmanRunning();
// }, 5000);

export const onExit = () => {
  monitoring.onExit();
  if (podmanWatchProcess) {
    killChildProcess(podmanWatchProcess);
  }
  stopSendingLogsToUI();
};
