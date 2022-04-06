import * as platform from './platform';
import * as arch from './arch';

const baseURL = 'https://gethstore.blob.core.windows.net/builds/';
const macOS = 'geth-darwin-amd64-1.10.17-25c9b49f';
const windows32bit = 'geth-windows-386-1.10.17-25c9b49f';
const windows64bit = 'geth-windows-amd64-1.10.17-25c9b49f';
const linux32bit = 'geth-linux-386-1.10.17-25c9b49f';
const linux64bit = 'geth-linux-amd64-1.10.17-25c9b49f';
const linuxArm64 = 'geth-linux-arm64-1.10.17-25c9b49f';
const linuxArm32v7 = 'geth-linux-arm7-1.10.17-25c9b49f';

export const gethBuildNameForPlatformAndArch = () => {
  if (platform.isMac()) {
    return macOS;
  }
  if (platform.isWindows()) {
    if (arch.isX86And32bit()) {
      return windows32bit;
    }
    if (arch.isX86And64bit()) {
      return windows64bit;
    }
    // No official Geth build for Windows on ARM
  } else if (platform.isLinux()) {
    if (arch.isX86And32bit()) {
      return linux32bit;
    }
    if (arch.isX86And64bit()) {
      return linux64bit;
    }
    if (arch.isArmAnd32bit()) {
      return linuxArm32v7;
    }
    if (arch.isArmAnd64bit()) {
      return linuxArm64;
    }
  }
  throw new Error(
    `Platform ${platform.getPlatform()} and arch ${arch.getArch()} is not supported.`
  );
};

export const getCompressedExtension = () => {
  if (platform.isWindows()) {
    return '.zip';
  }
  return '.tar.gz';
};

export const gethFullBuildNameForPlatformAndArch = () => {
  let fullBuildName = gethBuildNameForPlatformAndArch();
  if (platform.isWindows()) {
    fullBuildName += '.zip';
  }
  fullBuildName += '.tar.gz';
  return fullBuildName;
};

export const getGethDownloadURL = () => {
  const gethBuildName = gethBuildNameForPlatformAndArch();
  let gethBuildFilename;
  if (platform.isWindows()) {
    gethBuildFilename = `${gethBuildName}.zip`;
  } else {
    gethBuildFilename = `${gethBuildName}.tar.gz`;
  }
  const gethDownloadURL = `${baseURL}${gethBuildFilename}`;
  console.log('gethDownloadURL: ', gethDownloadURL);
  return gethDownloadURL;
};
