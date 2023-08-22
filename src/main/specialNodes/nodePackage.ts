import {
  NodePackageSpecification,
  NodeSpecification,
} from '../../common/nodeSpec';
import Node, { NodeConfig } from '../../common/node';
import { addNode } from '../nodeManager';
import { createJwtSecretAtDirs } from '../util/jwtSecrets';

// Created when adding a node and is used to pair a node spec and config
// for a specific node package service
export type AddNodePackageNodeServices = {
  serviceId: string;
  spec: NodeSpecification;
  config: NodeConfig;
};
/**
 * Creates an Ethereum Node instance in the user's nodes.
 * Algo: Create jwt secret file, and create EC and CC using the initial settings.
 * @param ecNodeSpec NodeSpecification
 * @param ccNodeSpec NodeSpecification
 * @param settings { storageLocation?: string }
 * @returns true if successful
 */
export const addNodePackage = async (
  spec: NodePackageSpecification,
  config: NodeConfig,
  services: AddNodePackageNodeServices,
  settings: { storageLocation?: string },
): Promise<{ ecNode: Node; ccNode: Node }> => {
  // const ecNode = await addNode(ecNodeSpec, settings.storageLocation);
  // const ccNode = await addNode(ccNodeSpec, settings.storageLocation);

  // todo: create userNodePackages storage key and addNodePackage there

  // todo: loop over services and call addNode

  // Creates the secret at root dir of the node
  //    node.runtime.dataDir + 'jwtsecret'
  await createJwtSecretAtDirs([ecNode.runtime.dataDir, ccNode.runtime.dataDir]);

  return { ecNode, ccNode };
};
