import os from 'os';
import { app } from 'electron';

import { getArch } from './arch';
import { getPlatform } from './platform';
import { getInstalledPodmanVersion } from './podman/install/install';

export default async function getDebugInfo() {
  let niceNodeVersion = app.getVersion();
  let podmanVersion = await getInstalledPodmanVersion();

  if (process.env.NODE_ENV === 'development') {
    niceNodeVersion = `Dev-${niceNodeVersion}`;
  }

  return {
    platform: getPlatform(),
    platformRelease: os.release(),
    arch: getArch(),
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    podmanVersion,
    niceNodeVersion,
  };
}

const getDebugInfoShort = async () => {
  let niceNodeVersion = app.getVersion();
  let podmanVersion = await getInstalledPodmanVersion();

  if (process.env.NODE_ENV === 'development') {
    niceNodeVersion = `Dev-${niceNodeVersion}`;
  }

  return {
    platform: getPlatform(),
    platformRelease: os.release(),
    arch: getArch(),
    totalMemory: os.totalmem(),
    podmanVersion,
    niceNodeVersion,
  };
};

export const getDebugInfoString = () => {
  try {
    return JSON.stringify(getDebugInfo(), null, 2);
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

export const getGithubIssueProblemURL = () => {
  return getDebugInfoShortString().then((debugInfo) => {
    const url = new URL('https://github.com/jgresham/nice-node/issues/new');
    url.searchParams.set(
      'body',
      `Problem description\n-\n<!-- Describe your problem on the next line! Thank you -->\n\n\nFor NiceNode developers\n-\n${debugInfo}`,
    );

    return url.toString();
  });
};
