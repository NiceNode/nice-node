/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUsedDiskSpace } from '../files';
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

          if (matchedContainerMetrics) {
            if (
              node.runtime.usage.memoryBytes === undefined &&
              node.runtime.usage.cpuPercent === undefined &&
              node.runtime.usage.diskGBs === undefined
            ) {
              node.runtime.usage.memoryBytes = [];
              node.runtime.usage.cpuPercent = [];
              node.runtime.usage.diskGBs = [];
            }
            node.runtime.usage.memoryBytes.unshift({
              x: Date.now(), // timestamp
              y: matchedContainerMetrics.MemPerc, // percent
            });
            node.runtime.usage.cpuPercent.unshift({
              x: Date.now(), // timestamp
              y: matchedContainerMetrics.PercCPU, // percent
            });

            const getUsedDiskSpaceFunc = async () => {
              const { dataDir } = node.runtime;
              return getUsedDiskSpace(dataDir) || 0;
            };
            // eslint-disable-next-line no-await-in-loop
            const diskGBs = await getUsedDiskSpaceFunc();
            node.runtime.usage.diskGBs.unshift({
              x: Date.now(), // timestamp
              y: parseFloat(diskGBs.toPrecision(1)), // GBs
            });
          } else {
            node.runtime.usage.memoryBytes = [];
            node.runtime.usage.cpuPercent = [];
            node.runtime.usage.diskGBs = [];
          }
          nodeStore.updateNode(node);
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
  updateAllNodeMetrics();
  monitoringInterval = setInterval(
    updateAllNodeMetrics,
    METRICS_POLLING_INTERVAL
  );
};

export const onExit = () => {
  clearInterval(monitoringInterval);
};
