/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDockerNode } from '../../common/node';
import * as nodeStore from '../state/nodes';

const watchProcessPollingInterval = 15000;
let monitoringInterval: NodeJS.Timer;
let runDockerCommand: (command: string) => Promise<any>;

const updateNodeUsage = async () => {
  // get all nodes and filter for binaries
  const nodes = nodeStore.getNodes();
  let allContainerStats;
  try {
    allContainerStats = await runDockerCommand(
      'stats --no-stream --no-trunc --format "{{ json . }}"'
    );
    allContainerStats = allContainerStats.trim();
    allContainerStats = `[${allContainerStats.split('\n').join(',')}]`;
    allContainerStats = JSON.parse(allContainerStats);
  } catch (err) {
    console.error('Error parsing podman stats: ', err);
    // logger.error('Error parsing podman stats: ', err);
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isDockerNode(node)) {
      if (Array.isArray(node?.runtime?.processIds)) {
        try {
          const containerId = node.runtime.processIds[0];
          const matchedContainerStats = allContainerStats.find(
            (containerStats: any) => {
              return containerStats.ID === containerId;
            }
          );

          if (matchedContainerStats) {
            if (matchedContainerStats.MemUsage) {
              const memUsage = matchedContainerStats.MemUsage.substring(
                0,
                matchedContainerStats.MemUsage.indexOf('/')
              );
              let dockerUnitScalorFromBytes = 1;
              if (memUsage.includes('KiB')) {
                dockerUnitScalorFromBytes = 1e3;
              }
              if (memUsage.includes('MiB')) {
                dockerUnitScalorFromBytes = 1e6;
              }
              if (memUsage.includes('GiB')) {
                dockerUnitScalorFromBytes = 1e9;
              }
              const memoryInBytes =
                parseFloat(memUsage) * dockerUnitScalorFromBytes;
              node.runtime.usage.memoryBytes = memoryInBytes;
            } else {
              node.runtime.usage.memoryBytes = undefined;
            }
            node.runtime.usage.cpuPercent =
              parseInt(matchedContainerStats.CPUPerc, 10) ?? undefined;
          } else {
            node.runtime.usage.memoryBytes = 0;
            node.runtime.usage.cpuPercent = 0;
          }
          nodeStore.updateNode(node);
        } catch (err) {
          console.error('Error setting monitoring stats for a node', err);
        }
      } else {
        // no processId for a node
      }
    }
  }
};

export const initialize = (
  runDockerCommandArg: (command: string) => Promise<any>
) => {
  runDockerCommand = runDockerCommandArg;
  monitoringInterval = setInterval(
    updateNodeUsage,
    watchProcessPollingInterval
  );
};

export const onExit = () => {
  clearInterval(monitoringInterval);
};
