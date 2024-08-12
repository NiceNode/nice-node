import { cp } from 'node:fs/promises';
import path from 'node:path';
import type Node from '../common/node';
import {
  type NodeId,
  type NodePackage,
  type NodeRuntime,
  type NodeService,
  NodeStatus,
  NodeStoppedBy,
  createNodePackage,
} from '../common/node';
import type { ConfigValuesMap } from '../common/nodeConfig';
import type {
  NodePackageSpecification,
  NodeSpecification,
} from '../common/nodeSpec';
import {
  deleteDisk,
  getNodeSpecificationsFolder,
  getNodesDirPath,
  makeNodeDir,
} from './files';
import logger from './logger';
import { setLastRunningTime } from './node/setLastRunningTime';
import { addNode, removeNode, startNode, stopNode } from './nodeManager';
import * as nodePackageStore from './state/nodePackages';
import * as nodeStore from './state/nodes';
import { createJwtSecretAtDirs } from './util/jwtSecrets';

// Created when adding a node and is used to pair a node spec and config
// for a specific node package service
export type AddNodePackageNodeService = {
  serviceId: string;
  serviceName: string;
  spec: NodeSpecification;
  initialConfigValues?: ConfigValuesMap;
};

export const addNodePackage = async (
  nodeSpec: NodePackageSpecification,
  services: AddNodePackageNodeService[],
  settings: { storageLocation?: string; configValues?: ConfigValuesMap },
): Promise<NodePackage> => {
  // use a timestamp postfix so the user can add multiple nodes of the same name
  const utcTimestamp = Math.floor(Date.now() / 1000);
  const dataDir = await makeNodeDir(
    `${nodeSpec.specId}-${utcTimestamp}`,
    settings.storageLocation ?? getNodesDirPath(),
  );
  console.log('adding node package with dataDir: ', dataDir);
  const nodeRuntime: NodeRuntime = {
    dataDir,
    usage: {
      diskGBs: [],
      memoryBytes: [],
      cpuPercent: [],
      syncedBlock: 0,
    },
  };
  const nodePackage: NodePackage = createNodePackage({
    spec: nodeSpec,
    runtime: nodeRuntime,
    initialConfigFromUser: settings.configValues,
  });
  nodePackageStore.addNodePackage(nodePackage);

  // todo: loop over services and call addNode, at the end add all node ids to the nodepackge.services
  const nodeServices: NodeService[] = [];
  const nodesThatRequireJwtSecret: Node[] = [];
  const nodesThatRequireFiles: Node[] = [];
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    try {
      const nodePackageServiceSpec = nodeSpec?.execution?.services?.find(
        (serviceSpec) => {
          return serviceSpec.serviceId === service.serviceId;
        },
      );
      if (nodePackageServiceSpec) {
        // Only create required nodes right now?
        const node = await addNode(
          service.spec,
          settings.storageLocation,
          service.initialConfigValues,
        );
        console.log(
          'nodePackageManager: adding node with initialConfigValues: ',
          node,
          service.initialConfigValues,
        );
        nodeServices.push({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          node,
        });
        if (nodePackageServiceSpec.requiresCommonJwtSecret) {
          nodesThatRequireJwtSecret.push(node);
        }
        if (nodePackageServiceSpec.requiresFiles) {
          nodesThatRequireFiles.push(node);
        }
      }
    } catch (e) {
      logger.error(`Unable to create node service: ${JSON.stringify(service)}`);
      throw e;
    }
  }
  nodePackage.services = nodeServices;
  nodePackageStore.updateNodePackage(nodePackage);
  // update nodePackageStore!

  // Creates the secret at root dir of the node
  //    node.runtime.dataDir + 'jwtsecret'
  await createJwtSecretAtDirs(
    nodesThatRequireJwtSecret.map((node) => node.runtime.dataDir),
  );

  // copy files from the Node Package dir "files" to nodesThatRequireFiles's
  //  dataDirs root dir
  if (nodesThatRequireFiles.length > 0) {
    const nodeSpecsPath = getNodeSpecificationsFolder();
    logger.info(`nodeSpecsPath: ${nodeSpecsPath}`);
    const waitProms = nodesThatRequireFiles.map((node) => {
      const source = path.join(nodeSpecsPath, nodePackage.spec.specId, 'files');
      const destination = node.runtime.dataDir;
      logger.info(`cp src dest:: ${source} ${destination}`);
      return cp(source, destination, { recursive: true });
    });
    await Promise.all(waitProms);
  }

  return nodePackage;
};

export const startNodePackage = async (nodeId: NodeId) => {
  const node = nodePackageStore.getNodePackage(nodeId);
  if (!node)
    throw new Error(`Unable to start node package ${nodeId}. Not found.`);

  logger.info(`Starting node package ${JSON.stringify(node)}`);
  node.status = NodeStatus.starting;
  node.lastStartedTimestampMs = Date.now();
  node.stoppedBy = undefined;
  nodePackageStore.updateNodePackage(node);

  const startService = async (service: any) => {
    try {
      await startNode(service.node.id);
    } catch (e) {
      logger.error(`Unable to start node service: ${JSON.stringify(service)}`);
      node.status = NodeStatus.errorStarting;
      nodePackageStore.updateNodePackage(node);
      return Promise.reject(e);
    }
  };

  if (node.spec.specId === 'ethereum') {
    const executionClient = node.services.find(
      (s) => s.serviceId === 'executionClient',
    );
    const consensusClient = node.services.find(
      (s) => s.serviceId === 'consensusClient',
    );

    if (executionClient) await startService(executionClient);
    if (consensusClient) await startService(consensusClient);
  } else {
    await Promise.all(node.services.map(startService));
  }

  if (node.status !== NodeStatus.errorStarting) {
    node.status = NodeStatus.running;
    setLastRunningTime(nodeId, 'node');
  }
  nodePackageStore.updateNodePackage(node);
};

export const stopNodePackage = async (
  nodeId: NodeId,
  stoppedBy: NodeStoppedBy,
) => {
  const node = nodePackageStore.getNodePackage(nodeId);
  if (!node)
    throw new Error(`Unable to stop node package ${nodeId}. Not found.`);

  logger.info(`Stopping node package ${JSON.stringify(node)}`);
  node.status = NodeStatus.stopping;
  node.lastStoppedTimestampMs = Date.now();
  node.stoppedBy = stoppedBy;
  nodePackageStore.updateNodePackage(node);

  await Promise.all(
    node.services.map(async (service) => {
      try {
        await stopNode(service.node.id, stoppedBy);
      } catch (e) {
        logger.error(`Unable to stop node service: ${JSON.stringify(service)}`);
        node.status = NodeStatus.errorStopping;
        nodePackageStore.updateNodePackage(node);
      }
    }),
  );

  if (node.status !== NodeStatus.errorStopping) {
    node.status = NodeStatus.stopped;
  }
  nodePackageStore.updateNodePackage(node);
};

export const deleteNodePackageStorage = async (nodeId: NodeId) => {
  const node = nodePackageStore.getNodePackage(nodeId);
  const nodeDataDirPath = node.runtime.dataDir;
  const deleteDiskResult = await deleteDisk(nodeDataDirPath);
  logger.info(`Remove node package deleteDiskResult ${deleteDiskResult}`);
  return deleteDiskResult;
};

export const removeNodePackage = async (
  nodeId: NodeId,
  options: { isDeleteStorage: boolean },
): Promise<NodePackage> => {
  // Stop package if running (this makes delete files and other things smoother)
  logger.info(
    `Remove node package ${nodeId} and delete storage? ${options.isDeleteStorage}`,
  );
  try {
    // stoppedBy set to user as only users remove nodes
    await stopNodePackage(nodeId, NodeStoppedBy.user);
  } catch (err) {
    logger.info(
      'Unable to stop the node package before removing. Continuing with removal.',
    );
  }
  const node = nodePackageStore.getNodePackage(nodeId);
  node.status = NodeStatus.removing;
  nodePackageStore.updateNodePackage(node);
  for (let i = 0; i < node.services.length; i++) {
    const service = node.services[i];
    try {
      await removeNode(service.node.id, options);
    } catch (e) {
      logger.error(`Unable to remove node service: ${JSON.stringify(service)}`);
      // what to do here?
      // throw e;
    }
  }

  // delete the node package dataDir
  if (options?.isDeleteStorage) {
    await deleteNodePackageStorage(nodeId);
  }

  // todo: delete data optional
  const removedNode = await nodePackageStore.removeNodePackage(node.id);
  return removedNode;
};

/**
 * Removes all node packages, which removes all node services and deletes their storage data
 */
export const removeAllNodePackages = async () => {
  const nodes = nodePackageStore.getNodePackages();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    await removeNodePackage(node.id, { isDeleteStorage: true });
  }

  // Useful if the data in the store is stored/deleted improperly
  nodePackageStore.clear();
  nodeStore.clear();
};

export const stopAllNodePackages = async (stoppedBy: NodeStoppedBy) => {
  const nodes = nodePackageStore.getNodePackages();
  const stopPromises: Promise<any>[] = [];
  nodes.forEach((node) => {
    if (node.status === NodeStatus.running) {
      stopPromises.push(stopNodePackage(node.id, stoppedBy));
    }
  });
  await Promise.all(stopPromises);
};

// Stop all running nodes to prevent unclean shutdowns
//  and mark them as stopped by a shutdown
export const onShutDown = () => {
  // do not block and await, limited shutdown time given
  stopAllNodePackages(NodeStoppedBy.shutdown);
};

export const restartNodePackagesNotStoppedByUser = async () => {
  const nodesToRestart = nodePackageStore
    .getNodePackages()
    .filter(
      (node) =>
        node.stoppedBy !== NodeStoppedBy.user &&
        node.status !== NodeStatus.running,
    );
  if (nodesToRestart.length > 0) {
    logger.info(
      `restartNodes: ${nodesToRestart
        .map((node) => node.spec.displayName)
        .join(', ')}`,
    );
  }
  const startPromises: Promise<any>[] = [];
  nodesToRestart.forEach((node) => {
    startPromises.push(startNodePackage(node.id));
  });
  await Promise.all(startPromises);
};

/**
 * Restarts all of the nodes that were running prior to the previous
 * shutdown (ie. nodes.stoppedBy !== 'user') or app close.
 * Does not restart nodes that are already running.
 */
export const restartNodes = () => {
  restartNodePackagesNotStoppedByUser();
  // Todo: Create notification if a node restart fails
};
