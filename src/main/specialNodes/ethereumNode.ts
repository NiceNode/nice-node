import { NodeSpecification } from '../../common/nodeSpec';
import Node from '../../common/node';
import { addNode } from '../nodeManager';
import { createJwtSecretAtDirs } from '../util/jwtSecrets';

/**
 * Creates an Ethereum Node instance in the user's nodes.
 * Algo: Create jwt secret file, and create EC and CC using the initial settings.
 * @param ecNodeSpec NodeSpecification
 * @param ccNodeSpec NodeSpecification
 * @param settings { storageLocation?: string }
 * @returns true if successful
 */
export const addEthereumNode = async (
  ecNodeSpec: NodeSpecification,
  ccNodeSpec: NodeSpecification,
  settings: { storageLocation?: string },
): Promise<{ ecNode: Node; ccNode: Node }> => {
  const ecNode = await addNode(ecNodeSpec, settings.storageLocation);
  const ccNode = await addNode(ccNodeSpec, settings.storageLocation);

  // Creates the secret at root dir of the node
  //    node.runtime.dataDir + 'jwtsecret'
  await createJwtSecretAtDirs([ecNode.runtime.dataDir, ccNode.runtime.dataDir]);

  return { ecNode, ccNode };
};
