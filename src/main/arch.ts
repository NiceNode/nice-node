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
