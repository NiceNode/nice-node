/* eslint-disable no-await-in-loop */
import path from 'path';
import { cp } from 'fs/promises';
import {
  NodePackageSpecification,
  NodeSpecification,
} from '../common/nodeSpec';
import logger from './logger';
import Node, {
  createNodePackage,
  NodeId,
  NodePackage,
  NodeRuntime,
  NodeService,
  NodeStatus,
} from '../common/node';
import * as nodePackageStore from './state/nodePackages';
import {
  deleteDisk,
  getNodeSpecificationsFolder,
  getNodesDirPath,
  makeNodeDir,
} from './files';
import { addNode, removeNode, startNode, stopNode } from './nodeManager';
import { createJwtSecretAtDirs } from './util/jwtSecrets';
import { ConfigValuesMap } from '../common/nodeConfig';

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
  settings: { storageLocation?: string },
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
  if (!node) {
    throw new Error(`Unable to start node package ${nodeId}. Not found.`);
  }
  logger.info(`Starting node ${JSON.stringify(node)}`);
  let nodePackageStatus = NodeStatus.starting;
  node.status = nodePackageStatus;
  nodePackageStore.updateNodePackage(node);

  nodePackageStatus = NodeStatus.running;
  for (let i = 0; i < node.services.length; i++) {
    const service = node.services[i];
    try {
      await startNode(service.node.id);
    } catch (e) {
      logger.error(`Unable to start node service: ${JSON.stringify(service)}`);
      nodePackageStatus = NodeStatus.errorStarting;
      // try to start all services, or stop other services?
      // todo: set as partially started?
      // throw e;
    }
  }
  // set node status
  node.status = nodePackageStatus;
  nodePackageStore.updateNodePackage(node);
};

export const stopNodePackage = async (nodeId: NodeId) => {
  const node = nodePackageStore.getNodePackage(nodeId);
  if (!node) {
    throw new Error(`Unable to stop node package ${nodeId}. Not found.`);
  }
  logger.info(`Stopping node ${JSON.stringify(node)}`);
  let nodePackageStatus = NodeStatus.stopping;
  node.status = nodePackageStatus;
  nodePackageStore.updateNodePackage(node);

  nodePackageStatus = NodeStatus.stopped;
  for (let i = 0; i < node.services.length; i++) {
    const service = node.services[i];
    try {
      await stopNode(service.node.id);
    } catch (e) {
      logger.error(`Unable to stop node service: ${JSON.stringify(service)}`);
      nodePackageStatus = NodeStatus.errorStopping;
      // try to start all services, or stop other services?
      // what to do here?
      // throw e;
    }
  }
  // set node status
  node.status = nodePackageStatus;
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
    await stopNodePackage(nodeId);
  } catch (err) {
    logger.info(
      'Unable to stop the node package before removing. Continuing with removal.',
    );
  }
  const node = nodePackageStore.getNodePackage(nodeId);
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
};
