/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUsedDiskSpace } from '../files';
import logger from '../logger';
import { MetricData, isDockerNode } from '../../common/node';
import * as nodeStore from '../state/nodes';
import { getAllContainerMetrics } from './metrics';
import { ContainerStats } from './types';

const METRICS_POLLING_INTERVAL = 15000; // 15 seconds
let monitoringInterval: NodeJS.Timer;

const removeOldItems = (data: MetricData[] | []) => {
  if (data.length === 0) {
    return;
  }
  const now = Date.now();
  const msIn24Hours = 24 * 60 * 60 * 1000;

  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i];
    if (now - item.x > msIn24Hours) {
      data.pop();
    } else {
      break;
    }
  }
};

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
            node.runtime.usage.memoryBytes =
              node.runtime.usage.memoryBytes || [];
            node.runtime.usage.cpuPercent = node.runtime.usage.cpuPercent || [];
            node.runtime.usage.diskGBs = node.runtime.usage.diskGBs || [];

            removeOldItems(node.runtime.usage.memoryBytes);
            removeOldItems(node.runtime.usage.cpuPercent);
            removeOldItems(node.runtime.usage.diskGBs);

            (node.runtime.usage.memoryBytes as MetricData[]).unshift({
              x: Date.now(), // timestamp
              y: matchedContainerMetrics.MemPerc, // percent
            });
            (node.runtime.usage.cpuPercent as MetricData[]).unshift({
              x: Date.now(), // timestamp
              y: matchedContainerMetrics.PercCPU, // percent
            });

            const getUsedDiskSpaceFunc = async () => {
              const { dataDir } = node.runtime;
              return getUsedDiskSpace(dataDir) || 0;
            };
            // eslint-disable-next-line no-await-in-loop
            const diskGBs = (await getUsedDiskSpaceFunc()) as number;
            (node.runtime.usage.diskGBs as MetricData[]).unshift({
              x: Date.now(), // timestamp
              y: parseFloat(diskGBs.toFixed(2)), // GBs
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
