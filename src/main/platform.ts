import { platform } from 'node:process';

export const isMac = () => {
  return platform === 'darwin';
};

export const isLinux = () => {
  return platform === 'linux';
};

export const isWindows = () => {
  return platform === 'win32';
};

export const getPlatform = () => {
  return platform;
};

export const doesStringIncludePlatform = (inputStr: string) => {
  const str = inputStr.toLowerCase();
  if (isWindows()) {
    return (
      str.toLowerCase().includes('win32') ||
      str.toLowerCase().includes('windows')
    );
  }
  if (isLinux()) {
    return str.toLowerCase().includes('linux');
  }
  if (isMac()) {
    return (
      str.toLowerCase().includes('darwin') || str.toLowerCase().includes('mac')
    );
  }
  return false;
};
