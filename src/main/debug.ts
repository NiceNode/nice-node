import os from 'node:os';
import { app } from 'electron';

import { getArch } from './arch';
import { getPlatform } from './platform';
import { getOperatingSystemInfo } from './systemInfo.js';

export default async function getDebugInfo() {
  let niceNodeVersion = app.getVersion();

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
    niceNodeVersion,
  };
}

const getDebugInfoShort = () => {
  let niceNodeVersion = app.getVersion();

  if (process.env.NODE_ENV === 'development') {
    niceNodeVersion = `Dev-${niceNodeVersion}`;
  }

  return {
    platform: getPlatform(),
    platformRelease: os.release(),
    arch: getArch(),
    totalMemory: os.totalmem(),
    niceNodeVersion,
    // ethereumNodeVersion: gethBuildNameForPlatformAndArch(),
  };
};

export const getDebugInfoString = async () => {
  try {
    return JSON.stringify(await getDebugInfo(), null, 2);
  } catch (err) {
    return 'No system details.';
  }
};

export const getDebugInfoShortString = () => {
  try {
    return JSON.stringify(getDebugInfoShort(), null, 2);
  } catch (err) {
    return 'No system details.';
  }
};

export const getGithubIssueProblemURL = () => {
  const url = new URL('https://github.com/jgresham/nice-node/issues/new');
  url.searchParams.set(
    'body',
    `Problem description\n-\n<!-- Describe your problem on the next line! Thank you -->\n\n\nFor NiceNode developers\n-\n${getDebugInfoShortString()}`,
  );

  return url.toString();
};
