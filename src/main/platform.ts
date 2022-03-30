import { platform } from 'process';

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
