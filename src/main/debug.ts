import os from 'node:os';
import { app } from 'electron';

import { getArch } from './arch';
import { getPlatform } from './platform';
import { getInstalledPodmanVersion } from './podman/install/install';
import { getOperatingSystemInfo } from './systemInfo.js';

export default async function getDebugInfo() {
  let niceNodeVersion = app.getVersion();
  const podmanVersion = await getInstalledPodmanVersion();

  if (process.env.NODE_ENV === 'development') {
    niceNodeVersion = `Dev-${niceNodeVersion}`;
  }

  const { distro, release } = await getOperatingSystemInfo();

  // todo: make human readable (version)
  return {
    platform: getPlatform(),
    platformRelease: os.release(),
    distro: distro,
    release: release,
    arch: getArch(),
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    podmanVersion,
    niceNodeVersion,
  };
}

const getDebugInfoShort = async () => {
  let niceNodeVersion = app.getVersion();
  const podmanVersion = await getInstalledPodmanVersion();

  if (process.env.NODE_ENV === 'development') {
    niceNodeVersion = `Dev-${niceNodeVersion}`;
  }

  const { distro, release } = await getOperatingSystemInfo();

  return {
    platform: getPlatform(),
    platformRelease: os.release(),
    distro: distro,
    release: release,
    arch: getArch(),
    totalMemory: os.totalmem(),
    podmanVersion,
    niceNodeVersion,
  };
};

export const getDebugInfoString = async () => {
  try {
    return JSON.stringify(await getDebugInfo(), null, 2);
  } catch (err) {
    return 'No system details.';
  }
};

export const getDebugInfoShortString = async () => {
  try {
    const formattedString = JSON.stringify(await getDebugInfoShort(), null, 2)
      .replace(/[{}"]/g, '')
      .replace(/:/g, ': ')
      .replace(/,\n/g, '\n')
      .replace(/(^|\n)\s*\w/g, (s) => s.toUpperCase());

    return formattedString;
  } catch (err) {
    return 'No system details.';
  }
};

export const getGithubIssueProblemURL = async () => {
  const url = new URL('https://github.com/NiceNode/nice-node/issues/new');
  const debugInfo = await getDebugInfoShortString();
  url.searchParams.set(
    'body',
    `Problem description\n-\n<!-- Describe your problem on the next line! Thank you -->\n\n\nFor NiceNode developers\n-\n${debugInfo}`,
  );
  return url.toString();
};
