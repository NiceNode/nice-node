/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '../logger';
import { isDockerNode } from '../../common/node';
import * as nodeStore from '../state/nodes';
import { getAllContainerMetrics } from './metrics';
import { ContainerStats } from './types';

const METRICS_POLLING_INTERVAL = 15000; // 15 seconds
let monitoringInterval: NodeJS.Timer;

const updateAllNodeMetrics = async () => {
  // get all nodes and filter for container nodes (isDocker legacy naming)
  const nodes = nodeStore.getNodes();
  const allContainerMetrics = await getAllContainerMetrics();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isDockerNode(node)) {
      if (Array.isArray(node?.runtime?.processIds)) {
        try {
          const containerId = node.runtime.processIds[0];
          const matchedContainerMetrics = allContainerMetrics.find(
            (containerMetrics: ContainerStats) => {
              return containerMetrics.ContainerID === containerId;
            }
          );

          if (matchedContainerMetrics) {
            // save metrics
          } else {
            // save a null data point? undefined/error data point?
          }

          // electronStore.saveSomething();
          // nodeStore.updateNode(node);
        } catch (err) {
          logger.error('Error setting metrics for a node', err);
        }
      } else {
        // no containerId for a node
        // save a null data point? undefined/error data point?
      }
    }
  }
};

export const initialize = () => {
  monitoringInterval = setInterval(
    updateAllNodeMetrics,
    METRICS_POLLING_INTERVAL
  );
};

export const onExit = () => {
  clearInterval(monitoringInterval);
};
