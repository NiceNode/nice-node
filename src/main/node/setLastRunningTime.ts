import Node, { NodeId, NodePackage, NodeStatus } from '../../common/node';
import logger from '../logger';
import { registerExitHandler } from '../processExit';
import { getNodePackage, updateNodePackage } from '../state/nodePackages';
import { getNode, updateNode } from '../state/nodes';

/**
 * The time used to determine that a node or nodeService
 *  is successfully running.
 * Current value: 30 seconds
 */
export const DEFINED_NODE_RUNNING_WAIT_TIME = 30000; // 30 seconds

const timeouts: ReturnType<typeof setTimeout>[] = [];

/**
 * This wait a specific amount of time and then check to see if a node
 * or nodeService is still running. If it is still running, then it
 * will set lastRunningTimestampMs on the node or nodeService.
 * see DEFINED_NODE_RUNNING_WAIT_TIME for the time used to determine
 * that it is successfully running.
 * @param nodeId
 * @param type
 */
export const setLastRunningTime = async (
  nodeId: NodeId,
  type: 'node' | 'nodeService',
) => {
  logger.info(`setLastRunningTime called for nodeId: ${nodeId}`);
  timeouts.push(
    setTimeout(() => {
      let node: NodePackage | Node | undefined;
      if (type === 'node') {
        node = getNodePackage(nodeId);
      }
      if (type === 'nodeService') {
        node = getNode(nodeId);
      }
      if (node !== undefined && node.status === NodeStatus.running) {
        logger.info(`setLastRunningTime, still running nodeId: ${nodeId}`);
        node.lastRunningTimestampMs = Date.now();
        if (type === 'node') {
          updateNodePackage(node as NodePackage);
        }
        if (type === 'nodeService') {
          updateNode(node as Node);
        }
      } else {
        logger.info(`setLastRunningTime, not running(!) nodeId: ${nodeId}`);
      }
    }, DEFINED_NODE_RUNNING_WAIT_TIME), // wait 30 seconds
  );
};

const onAppClose = () => {
  timeouts.forEach((timeout) => clearTimeout(timeout));
};

registerExitHandler(onAppClose);
