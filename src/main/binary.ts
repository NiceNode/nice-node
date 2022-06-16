import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import path from 'node:path';
import { createWriteStream } from 'fs';
import { access, chmod } from 'fs/promises';
import sleep from 'await-sleep';

import { ProcessDescription } from 'pm2';
import * as platform from './platform';
import * as arch from './arch';
import * as github from './github';
import { BinaryDownload, BinaryExecution } from '../common/nodeSpec';
import { buildCliConfig } from '../common/nodeConfig';
import Node, { isBinaryNode, NodeStatus } from '../common/node';
import logger from './logger';
import { httpGet } from './httpReq';
import { execAwait } from './execHelper';
import {
  getNodesDirPath,
  doesFileOrDirExist,
  checkAndOrCreateDir,
} from './files';
import { updateNode } from './state/nodes';
import {
  startProccess,
  getProcess as pm2GetProcess,
  stopProcess,
  initialize as initPm2Manager,
  onExit as onExitPm2Manager,
  sendLogsToUI as pm2SendLogsToUI,
  stopSendingLogsToUI as pm2StopSendingLogsToUI,
  deleteProcess,
} from './pm2Manager';
import * as nodeStore from './state/nodes';
import { escapePath } from './util/escapePath';

const streamPipeline = promisify(pipeline);

export const getProcess = pm2GetProcess;
export const sendLogsToUI = pm2SendLogsToUI;
export const stopSendingLogsToUI = pm2StopSendingLogsToUI;

const getDownloadUrl = (binaryDownload: BinaryDownload) => {
  // get platform & arch
  if (platform.isMac()) {
    return binaryDownload?.darwin?.amd64;
  }
  if (platform.isWindows()) {
    if (arch.isX86And32bit()) {
      return binaryDownload?.windows?.amd32;
    }
    if (arch.isX86And64bit()) {
      return binaryDownload?.windows?.amd64;
    }
    // No official Geth build for Windows on ARM
  } else if (platform.isLinux()) {
    if (arch.isX86And32bit()) {
      return binaryDownload?.linux?.amd32;
    }
    if (arch.isX86And64bit()) {
      return binaryDownload?.linux?.amd64;
    }
    if (arch.isArmAnd32bit()) {
      return binaryDownload?.linux?.arm7;
    }
    if (arch.isArmAnd64bit()) {
      return binaryDownload?.linux?.arm64;
    }
  }
  throw new Error(
    `Platform ${platform.getPlatform()} and arch ${arch.getArch()} is not supported by NiceNode.`
  );
};

export const getBinaryStatus = (proc: ProcessDescription): NodeStatus => {
  const procStatus = proc?.pm2_env?.status;
  if (proc && procStatus) {
    if (procStatus === 'online') {
      return NodeStatus.running;
    }
    if (procStatus === 'errored') {
      return NodeStatus.errorRunning;
    }
    if (procStatus === 'stopping') {
      return NodeStatus.stopping;
    }
    if (procStatus === 'launching') {
      return NodeStatus.starting;
    }
    if (procStatus === 'stopped') {
      return NodeStatus.stopped;
    }
  }
  console.log('unkown proc status! proc, procStatus', proc, procStatus);
  return NodeStatus.unknown;
};

const parseFileNameFromPath = (inPath: string, excludeExension?: boolean) => {
  // ex. 'C:\Windows\crazy\inPath'
  // ex. '/root/usr/yay.zip

  let pathSlash = '/';
  if (platform.isWindows()) {
    pathSlash = '\\';
  }
  if (excludeExension) {
    const tarGzIndex = inPath.lastIndexOf('.tar.gz');
    const zipIndex = inPath.lastIndexOf('.zip');
    const extensionIndex = tarGzIndex > 0 ? tarGzIndex : zipIndex;

    return inPath.substring(inPath.lastIndexOf(pathSlash) + 1, extensionIndex);
  }
  return inPath.substring(inPath.lastIndexOf(pathSlash) + 1);
};

const parseFileNameFromUrl = (url: string, excludeExension?: boolean) => {
  // ex. 'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.17-25c9b49f.tar.gz'

  if (excludeExension) {
    const tarGzIndex = url.lastIndexOf('.tar.gz');
    const zipIndex = url.lastIndexOf('.zip');
    const extensionIndex = tarGzIndex > 0 ? tarGzIndex : zipIndex;
    return url.substring(url.lastIndexOf('/') + 1, extensionIndex);
  }
  return url.substring(url.lastIndexOf('/') + 1);
};

export const unzipFile = async (filePath: string, directory: string) => {
  logger.info(`unzipFile ${filePath} to directory ${directory}`);
  // status = NODE_STATUS.extracting;
  // send(CHANNELS.geth, status);
  let tarCommand = `tar --directory "${directory}" -xf "${filePath}"`;
  const buildDir = path.join(directory, parseFileNameFromPath(filePath, true));
  await checkAndOrCreateDir(buildDir);
  if (filePath.includes('.zip')) {
    // unzip doesn't create a directory with the zipped filename like tar does
    tarCommand = `unzip "${filePath}" -d "${buildDir}"`;
  }
  // let tarCommand = `tar --extract --file ${getNNDirPath()}/geth.tar.gz --directory ${getNNDirPath()}`;
  if (platform.isWindows()) {
    tarCommand = `tar -C ${buildDir} -xf ${filePath}`;
    // tar to geth-windows.zip contains a buildDir already
    if (filePath.includes('.zip')) {
      tarCommand = `tar -C ${directory} -xf ${filePath}`;
    }
  }
  logger.info(`unzipFile running unzip command ${tarCommand}`);
  try {
    await execAwait(tarCommand);
    logger.info('unzipFile unzip complete succeeded');
  } catch (err) {
    logger.error('unzipFile unzip error');
    logger.error(err);
    throw new Error(`Extracting the file failed.`);
  }
};

/**
 * Downloads the file to directory. Unzips file if required.
 * @param downloadUrl
 * @param directory
 */
export const downloadBinary = async (
  downloadUrl: string,
  directory: string
) => {
  logger.info(`downloading binary ${downloadUrl}`);
  const downloadFileName = parseFileNameFromUrl(downloadUrl);
  logger.info(`binary full filename ${downloadFileName}`);
  const fileOutPath = path.join(directory, downloadFileName);

  // if fileOutPath exists, use it, but we should delete and retry...
  if (!(await doesFileOrDirExist(fileOutPath))) {
    try {
      const response = await httpGet(downloadUrl, {
        headers: [{ name: 'Accept', value: 'application/octet-stream' }],
      });

      // if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
      logger.info('http response received');

      // if (platform.isWindows()) {
      //   fileOutPath = `${directory}/geth.zip`;
      // }
      const fileWriteStream = createWriteStream(fileOutPath);

      logger.info('piping response to fileWriteStream');
      // await streamPromises.pipeline(data, fileWriteStream);
      await streamPipeline(response, fileWriteStream);
      logger.info(
        'done piping response to fileWriteStream. closing fileWriteStream.'
      );
      await fileWriteStream.close();

      // allow anyone to read the file
      logger.info('closed file');
      await chmod(fileOutPath, 0o444);
      logger.info('modified file permissions');
    } catch (err) {
      logger.error('error downloading binary', err);
      // status = NODE_STATUS.errorDownloading;
      // send(CHANNELS.geth, status);
      throw err;
    }
  } else {
    logger.info('Downloaded binary already exists');
  }

  await unzipFile(fileOutPath, directory);
};
/**
 * If required, downloads the latest version of binary
 * Uses node.spec and node.runtime
 * @calls checkLatestBinary, downloadFile, unzipFile
 * @modifies node.runtime.version/path if download succeeds
 */
export const checkOrDownloadLatestBinary = async (node: Node) => {
  logger.info(`checkOrDownloadLatestBinary started`);
  node.status = NodeStatus.checkingForUpdates;
  updateNode(node);
  const { spec, runtime } = node;
  const binaryExecution = spec.execution as BinaryExecution;
  let latestBuildUrl;
  if (binaryExecution.binaryDownload?.type === 'static') {
    latestBuildUrl = getDownloadUrl(binaryExecution.binaryDownload);
  } else if (binaryExecution.binaryDownload?.type === 'githubReleases') {
    logger.info(`checkOrDownloadLatestBinary github`);
    latestBuildUrl = await github.getLatestReleaseUrl(
      binaryExecution.binaryDownload
    );
  }
  if (!latestBuildUrl) {
    throw new Error(
      `The node does not have a build for platform ${platform.getPlatform()} and arch ${arch.getArch()}.`
    );
  }
  const excludeExension = true;
  const latestBuildName = parseFileNameFromUrl(latestBuildUrl, excludeExension);
  if (runtime.build === latestBuildName) {
    return;
  }
  // check if already downloaded and skip to chmod
  try {
    const buildPath = path.join(runtime.dataDir, latestBuildName);
    await access(buildPath);
    logger.info('latest build is already downloaded and extracted');
    runtime.build = latestBuildName;
    updateNode(node);
    return;
  } catch {
    // build is not downloaded and extracted
  }
  // download newer build
  node.status = NodeStatus.downloading;
  updateNode(node);
  await downloadBinary(latestBuildUrl, runtime.dataDir);
  runtime.build = latestBuildName;
  updateNode(node);
};

/**
 * Given a node, starts the binary for the plat/arch
 * Optionally, updates the binary before starting
 * Uses node.spec and node.runtime
 * @calls downloadBinary
 */
export const startBinary = async (node: Node) => {
  // const { sepc, runtime } = node;
  await checkOrDownloadLatestBinary(node);

  // execute runtime.build + runtime.execPath
  // set child proc, etc.
  node.status = NodeStatus.starting;
  updateNode(node);
  logger.info(`checkOrDownloadLatestBinary completed. Running binary`);
  // no pids to check if running... assume stopped for now
  // stopInitiatedAfterAStart = false;

  // geth is killed if (killed || exitCode === null)
  // if (gethProcess && !gethProcess.killed && gethProcess.exitCode === null) {
  //   logger.error('Geth process still running. Wait to stop or stop first.');
  //   status = NODE_STATUS.errorStarting;
  //   send(CHANNELS.geth, status);
  //   return;
  // }

  // await checkAndOrCreateGethDataDir(); .. `${getNNDirPath()}/geth-mainnet
  const { spec, runtime } = node;
  const nodeSpecId = spec.specId;
  const execution = spec.execution as BinaryExecution;
  const nodeInput = buildCliConfig({
    configValuesMap: node.config.configValuesMap,
    configTranslationMap: spec.configTranslation,
  });
  logger.info(
    `Starting binary with input: ${nodeInput} and runtime: ${JSON.stringify(
      runtime
    )} and execution: ${JSON.stringify(execution)}`
  );
  // let execFileAbsolutePath = path.join(
  //   getNNDirPath(),
  //   gethBuildNameForPlatformAndArch(),
  //   'geth'
  // );
  let execScript = execution.execPath;
  if (platform.isWindows()) {
    execScript += '.exe';
  }
  if (!runtime.build) {
    logger.error(`Unable to start ${nodeSpecId} binary. No build found.`);
    throw new Error(`Unable to start ${nodeSpecId} binary. No build found.`);
  }
  logger.info(
    `Making binary exec path: ${getNodesDirPath()} ${spec.specId} ${
      runtime.build
    } ${execScript}`
  );
  const execFileAbsolutePath = path.join(
    getNodesDirPath(),
    spec.specId,
    runtime.build,
    execScript
  );
  logger.info(`${execFileAbsolutePath} ${nodeInput}`);

  let pmId;
  try {
    const pm2ScriptPath = escapePath(execFileAbsolutePath);
    pmId = await startProccess(pm2ScriptPath, nodeInput, spec.specId);
  } catch (err) {
    logger.error('Errors starting binary: ', err);
    node.status = NodeStatus.errorStarting;
    updateNode(node);
    return;
  }

  if (pmId !== undefined) {
    node.runtime.processIds = [pmId.toString()];
    updateNode(node);
  } else {
    logger.error(`No pid for ${nodeSpecId} binary child process! Lost child!`);
  }
  logger.info(`binary ${nodeSpecId} started successfully`);
  node.status = NodeStatus.running;
  updateNode(node);
  logger.info(`${nodeSpecId} childProcess pid: ${pmId}`);
};

/**
 * Given a node, starts the binary for the plat/arch
 * Optionally, updates the binary before starting
 * Uses node.spec and node.runtime
 * @calls downloadBinary
 */
export const stopBinary = async (node: Node) => {
  logger.info(`stopBinary called for node ${node.spec.specId}`);
  // stopInitiatedAfterAStart = true;

  if (
    Array.isArray(node?.runtime?.processIds) &&
    node.runtime.processIds.length > 0
  ) {
    const pid = parseInt(node.runtime.processIds[0], 10);
    // try nice kill first
    // const signalSentResult = kill(pid, 'SIGINT');
    const signalSentResult = await stopProcess(pid);
    console.log('killSignalSent?', signalSentResult);
    await sleep(2000);
    try {
      const proc = await getProcess(pid);
      if (proc) {
        const nodeStatus = getBinaryStatus(proc);
        const proccessUsage = proc.monit;
        if (proccessUsage) {
          node.runtime.usage.memoryBytes = proccessUsage.memory ?? undefined;
          node.runtime.usage.cpuPercent = proccessUsage.cpu ?? undefined;
        }
        node.status = nodeStatus;
        nodeStore.updateNode(node);
      } else {
        // todo: fix: this happens on computer restart
        logger.error(
          `Unable to get process details. Proccess pid ${pid} not found.`
        );
        node.status = NodeStatus.unknown;
        updateNode(node);
      }
    } catch (err) {
      // successfully stopped
      node.status = NodeStatus.stopped;
      updateNode(node);
    }
  } else {
    // no processId for node
    console.error(`stopBinary no pid found for node ${node.spec.specId}`);
    node.status = NodeStatus.errorStopping;
    updateNode(node);
  }
};

// eslint-disable-next-line consistent-return
export const removeBinaryNode = async (node: Node) => {
  if (
    Array.isArray(node.runtime.processIds) &&
    node.runtime.processIds[0] !== undefined
  ) {
    // assume only one process
    const pmId = node.runtime.processIds[0];
    return deleteProcess(parseInt(pmId, 10));
  }
};

const watchProcessPollingInterval = 15000;
let watchProcessesInterval: NodeJS.Timer;

const watchBinaryProcesses = async () => {
  // get all nodes and filter for binaries
  const nodes = nodeStore.getNodes();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isBinaryNode(node)) {
      if (
        Array.isArray(node?.runtime?.processIds) &&
        node.runtime.processIds.length > 0
      ) {
        try {
          const pid = parseInt(node.runtime.processIds[0], 10);
          // eslint-disable-next-line no-await-in-loop
          const proc = await getProcess(pid);
          if (proc) {
            const nodeStatus = getBinaryStatus(proc);
            const proccessUsage = proc.monit;
            if (proccessUsage) {
              node.runtime.usage.memoryBytes =
                proccessUsage.memory ?? undefined;
              node.runtime.usage.cpuPercent = proccessUsage.cpu ?? undefined;
            }
            // logger.info(`NodeStatus for ${node.spec.specId} is ${nodeStatus}`);
            node.status = nodeStatus;
            nodeStore.updateNode(node);
          } else {
            // todo: fix: this happens on computer restart
            logger.error(
              `Unable to get process details. Proccess pid ${pid} not found.`
            );
            node.status = NodeStatus.unknown;
            updateNode(node);
          }
        } catch (err) {
          // error getting proc status
          node.status = NodeStatus.unknown;
          updateNode(node);
        }
      } else {
        // no processId for a node
        node.status = NodeStatus.stopped;
        nodeStore.updateNode(node);
      }
    }
  }
};
// todoMemoryLeak delete interval
export const initialize = () => {
  initPm2Manager();
  // watchPmProcesses
  logger.info('Start watching binary processes...');
  watchProcessesInterval = setInterval(
    watchBinaryProcesses,
    watchProcessPollingInterval
  );
};

// nicenode app close
export const onExit = () => {
  onExitPm2Manager();
  clearInterval(watchProcessesInterval);
};
