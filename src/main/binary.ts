import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import path from 'node:path';
import { createWriteStream } from 'fs';
import { chmod } from 'fs/promises';
import { ChildProcess, spawn, SpawnOptions } from 'child_process';

import * as platform from './platform';
import * as arch from './arch';
import { BinaryDownload, BinaryExecution } from '../common/nodeSpec';
import Node, { NodeStatus } from '../common/node';
import logger, { gethLogger } from './logger';
import { httpGet } from './httpReq';
import { execAwait } from './execHelper';
import { getNodesDirPath } from './files';
import { updateNode } from './state/nodes';

const streamPipeline = promisify(pipeline);

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

const parseFileNameFromDownloadURL = (
  url: string,
  excludeExension?: boolean
) => {
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
  const tarCommand = `tar --directory "${directory}" -xf "${filePath}"`;
  // let tarCommand = `tar --extract --file ${getNNDirPath()}/geth.tar.gz --directory ${getNNDirPath()}`;
  // if (isWindows()) {
  //   tarCommand = `tar -C ${getNNDirPath()} -xf ${getNNDirPath()}/geth.zip`;
  // }
  logger.info(`unzipFile running unzip command ${tarCommand}`);
  const result = await execAwait(tarCommand);
  if (!result.err) {
    logger.info('unzipFile unzip complete succeeded');
    // status = NODE_STATUS.readyToStart;
    // send(CHANNELS.geth, status);
  } else {
    logger.error('unzipFile unzip error');
    logger.error(result.err);
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
  const downloadFileName = parseFileNameFromDownloadURL(downloadUrl);
  logger.info(`binary full filename ${downloadFileName}`);
  const fileOutPath = path.join(directory, downloadFileName);
  // check if already downloaded and skip to chmod
  try {
    const response = await httpGet(downloadUrl);

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
  if (binaryExecution.binaryDownload?.type === 'static') {
    const latestBuildUrl = getDownloadUrl(binaryExecution.binaryDownload);
    if (!latestBuildUrl) {
      throw new Error(
        `The node does not have a build for platform ${platform.getPlatform()} and arch ${arch.getArch()}.`
      );
    }
    const excludeExension = true;
    const latestBuildName = parseFileNameFromDownloadURL(
      latestBuildUrl,
      excludeExension
    );
    if (runtime.build === latestBuildName) {
      return;
    }
    // download newer build
    node.status = NodeStatus.downloading;
    updateNode(node);
    await downloadBinary(latestBuildUrl, runtime.dataDir);
    runtime.build = latestBuildName;
    updateNode(node);
  }
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
  const { input } = execution;
  let nodeInput: string[] = [];
  if (input?.default) {
    nodeInput = input.default;
  }
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
  // if (isWindows()) {
  if (!runtime.build) {
    logger.error(`Unable to start ${nodeSpecId} binary. No build found.`);
    throw new Error(`Unable to start ${nodeSpecId} binary. No build found.`);
  }
  const execFileAbsolutePath = path.join(
    getNodesDirPath(),
    spec.specId,
    runtime.build,
    execution.execPath
  );
  // `${gethBuildNameForPlatformAndArch()}\\geth.exe`;
  logger.info(execFileAbsolutePath);
  const options: SpawnOptions = {
    stdio: [null, 'pipe', 'pipe'],
    detached: false,
  };
  const childProcess = spawn(execFileAbsolutePath, [], options);
  // gethProcess = childProcess;
  if (childProcess.pid) {
    node.runtime.processIds = [childProcess.pid.toString()];
    updateNode(node);
  } else {
    logger.error(`No pid for ${nodeSpecId} binary child process! Lost child!`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogStream = (data: Buffer | string | any) => {
    const logs = data?.toString().split('\n ');
    logs.forEach((log: string) => {
      // logger.log('getProcess:: log:: ', log);
      if (log.includes('ERROR')) {
        gethLogger.error(log);
      } else {
        gethLogger.info(log);
      }
    });
  };
  childProcess.stderr?.on('data', handleLogStream);
  childProcess.stdout?.on('data', handleLogStream);
  childProcess.on('error', (data) => {
    logger.error(`${nodeSpecId}::error:: `, data);
  });
  childProcess.on('disconnect', () => {
    logger.info(`${nodeSpecId}::disconnect::`);
  });
  childProcess.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`${nodeSpecId}::close:: ${code}`);
    if (code !== 0) {
      node.status = NodeStatus.errorStarting;
      updateNode(node);
      logger.error(`Error starting node ${nodeSpecId} code ${code}`);
      // todo: determine the error and show geth error logs to user.
    }
  });
  childProcess.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`${nodeSpecId}::exit:: ${code}, ${signal}`);
    if (code === 1) {
      // if (stopInitiatedAfterAStart && isWindows()) {
      //   logger.info('Windows un-smooth stop');
      //   return;
      // }
      node.status = NodeStatus.errorStarting;
      updateNode(node);
      logger.error('Geth::exit::error::');
    }
  });
  logger.info(`binary ${nodeSpecId} started successfully`);
  node.status = NodeStatus.running;
  updateNode(node);
  // logger.info('geth childProcess:', childProcess);
  logger.info(`${nodeSpecId} childProcess pid: ${childProcess.pid}`);
};
