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
      console.log('test1');
      if (Array.isArray(node?.runtime?.processIds)) {
        console.log('test2');
        try {
          const containerId = node.runtime.processIds[0];
          const matchedContainerMetrics = allContainerMetrics.find(
            (containerMetrics: ContainerStats) => {
              return containerMetrics.ContainerID === containerId;
            }
          );

          console.log('test3');
          if (matchedContainerMetrics) {
            if (
              node.runtime.usage.memoryBytes === undefined &&
              node.runtime.usage.cpuPercent === undefined
            ) {
              console.log('test4');
              node.runtime.usage.memoryBytes = [];
              node.runtime.usage.cpuPercent = [];
            }
            node.runtime.usage.memoryBytes.unshift({
              x: Date.now(), // timestamp
              y: matchedContainerMetrics.MemPerc, // percent
            });
            node.runtime.usage.cpuPercent.unshift({
              x: Date.now(), // timestamp
              y: matchedContainerMetrics.PercCPU, // percent
            });
          } else {
            console.log('test5');
            node.runtime.usage.memoryBytes = [];
            node.runtime.usage.cpuPercent = [];
          }
          // node.runtime.usage.memoryBytes = [];
          // node.runtime.usage.cpuPercent = [];
          console.log('cpuPercent', node.runtime.usage.cpuPercent);
          nodeStore.updateNode(node);
        } catch (err) {
          logger.error('Error setting metrics for a node', err);
        }
      } else {
        console.log('test6');
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
