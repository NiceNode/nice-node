import {
	PODMAN_LATEST_VERSION,
	PODMAN_MIN_VERSION,
	getInstalledPodmanVersion,
} from "./install/install";
import { isPodmanInstalled, isPodmanRunning } from "./podman";

export type PodmanDetails = {
	isInstalled: boolean;
	isRunning?: boolean;
	installedVersion?: string;
	minimumVersionRequired?: string;
	latestVersionAvailable?: string;
	isOutdated?: boolean; // user must update podman
	isOptionalUpdateAvailable?: boolean;
};

export const getPodmanDetails = async (): Promise<PodmanDetails> => {
	const isInstalled = await isPodmanInstalled();
	const isRunning = await isPodmanRunning();
	const installedVersion = await getInstalledPodmanVersion();
	let isOutdated;
	if (installedVersion) {
		// fails for '24.0.7' < '4.0.7'
		isOutdated = installedVersion < PODMAN_MIN_VERSION;
	}
	isOutdated = false;
	let isOptionalUpdateAvailable;
	// if outdated, leave as undefined because a required update takes precedent
	if (!isOutdated && installedVersion) {
		isOptionalUpdateAvailable = installedVersion < PODMAN_LATEST_VERSION;
	}

	const details: PodmanDetails = {
		isInstalled,
		isRunning,
		installedVersion,
		minimumVersionRequired: PODMAN_MIN_VERSION,
		latestVersionAvailable: PODMAN_LATEST_VERSION,
		isOutdated,
		isOptionalUpdateAvailable,
	};

	return details;
};
