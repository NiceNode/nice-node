import { arch } from 'process';

export const isX86And32bit = () => {
  return arch === 'ia32';
};

export const isX86And64bit = () => {
  return arch === 'x64';
};

export const isArmAnd32bit = () => {
  return arch === 'arm';
};

export const isArmAnd64bit = () => {
  return arch === 'arm64';
};

export const getArch = () => {
  return arch;
};

export const doesStringIncludeArch = (inputStr: string) => {
  const str = inputStr.toLowerCase();
  if (isX86And32bit()) {
    return str.toLowerCase().includes('ia32');
  }
  if (isX86And64bit()) {
    return (
      str.toLowerCase().includes('x64') || str.toLowerCase().includes('amd64')
    );
  }
  if (isArmAnd64bit()) {
    return (
      str.toLowerCase().includes('arm64') ||
      str.toLowerCase().includes('aarch64')
    );
  }
  if (isArmAnd32bit()) {
    return str.toLowerCase().includes('arm32');
  }
  return false;
};

// export const getCompressedExtension = () => {
//   if (platform.isWindows()) {
//     return '.zip';
//   }
//   return '.tar.gz';
// };

// export const gethFullBuildNameForPlatformAndArch = () => {
//   let fullBuildName = gethBuildNameForPlatformAndArch();
//   if (platform.isWindows()) {
//     fullBuildName += '.zip';
//   }
//   fullBuildName += '.tar.gz';
//   return fullBuildName;
// };
