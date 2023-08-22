/* eslint-disable no-await-in-loop */
import {
  NodePackageSpecification,
  NodeSpecification,
} from '../common/nodeSpec';
import logger from './logger';
import Node, {
  createNodePackage,
  NodePackage,
  NodeRuntime,
  NodeService,
} from '../common/node';
import * as nodePackageStore from './state/nodePackages';
import { getNodesDirPath, makeNodeDir } from './files';
import { addNode } from './nodeManager';
import { createJwtSecretAtDirs } from './util/jwtSecrets';

// Created when adding a node and is used to pair a node spec and config
// for a specific node package service
export type AddNodePackageNodeService = {
  serviceId: string;
  serviceName: string;
  spec: NodeSpecification;
};

export const addNodePackage = async (
  nodeSpec: NodePackageSpecification,
  services: AddNodePackageNodeService[],
  settings: { storageLocation?: string },
): Promise<NodePackage> => {
  // use a timestamp postfix so the user can add multiple nodes of the same name
  const utcTimestamp = Math.floor(Date.now() / 1000);
  const storageLocation = settings.storageLocation;
  const dataDir = await makeNodeDir(
    `${nodeSpec.specId}-${utcTimestamp}`,
    storageLocation ?? getNodesDirPath(),
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
  for (const service of services) {
    try {
      const nodePackageServiceSpec = nodeSpec?.execution?.services?.find(
        (serviceSpec) => {
          return serviceSpec.serviceId === service.serviceId;
        },
      );
      if (nodePackageServiceSpec) {
        // Only create required nodes right now?
        const node = await addNode(service.spec, settings.storageLocation);
        nodeServices.push({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          node,
        });
        if (nodePackageServiceSpec.requiresCommonJwtSecret) {
          nodesThatRequireJwtSecret.push(node);
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

  return nodePackage;
};
