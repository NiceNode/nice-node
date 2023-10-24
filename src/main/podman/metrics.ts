import { runCommand } from './podman';
import { ContainerStats } from './types';

/**
 * Gets all container metrics from Podman CLI, parses, and formats them
 * This will be switched to use the Podman API soon
 * @returns
 */
export const getAllContainerMetrics = async (): Promise<ContainerStats[]> => {
  let allContainerStats;
  try {
    allContainerStats = await runCommand(
      'stats --all --no-stream --no-trunc --format json',
    );
    allContainerStats = JSON.parse(allContainerStats);
    const parsedContainerStats: ContainerStats[] = [];
    if (Array.isArray(allContainerStats)) {
      allContainerStats.forEach((containerStats) => {
        parsedContainerStats.push({
          ContainerID: containerStats.id,
          Name: containerStats.name,
          PercCPU: parseFloat(containerStats.cpu_percent),
          MemPerc: parseFloat(containerStats.mem_percent),
        });
      });
    }
    return parsedContainerStats;
  } catch (err) {
    // Podman is likely not running
    // console.error('Unable to get podman container stats');
  }
  return [];
};
