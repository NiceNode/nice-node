import { cpu } from "systeminformation";
import { runCommand } from "./podman";
import type { ContainerStats } from "./types";

/**
 * Gets all container metrics from Podman CLI, parses, and formats them
 * This will be switched to use the Podman API soon
 * @returns
 */
export const getAllContainerMetrics = async (): Promise<ContainerStats[]> => {
	let allContainerStats;
	try {
		// allContainerStats = await runCommand(
		// 	"stats --all --no-stream --no-trunc --format json",
		// );
		// --format "{{ json . }}"
		allContainerStats = await runCommand(
			`stats --all --no-stream --no-trunc --format \"{{ json . }}\"`,
		);
		try {
			// allContainerStats = JSON.parse(allContainerStats);
			allContainerStats = allContainerStats.split("\n").map(JSON.parse);
		} catch (e) {
			console.error("Error parsing allContainerStats", e);
		}
		const parsedContainerStats: ContainerStats[] = [];
		if (Array.isArray(allContainerStats)) {
			allContainerStats.forEach((containerStats) => {
				// Docker compatibility
				let containerId = containerStats.id ?? containerStats.ID;
				let name = containerStats.name ?? containerStats.Name;
				let cpuPercent = containerStats.cpu_percent;
				if (cpuPercent === undefined) {
					cpuPercent = containerStats.CPUPerc;
				}
				let memPercent = containerStats.mem_percent;
				if (memPercent === undefined) {
					memPercent = containerStats.MemPerc;
				}
				cpuPercent = Number.parseFloat(cpuPercent);
				memPercent = Number.parseFloat(memPercent);
				parsedContainerStats.push({
					ContainerID: containerId,
					Name: name,
					PercCPU: cpuPercent,
					MemPerc: memPercent,
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
