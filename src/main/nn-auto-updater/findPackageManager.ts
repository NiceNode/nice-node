import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

export type PackageType = 'deb' | 'pacman' | 'rpm';
export type PackageManager = 'dpkg' | 'dnf' | 'pacman' | 'yum' | 'zypper';

interface PackageManagerMap {
  [key: string]: PackageManager;
}

interface PackageManagerToTypeMap {
  [key: string]: PackageType;
}

const packageManagers: PackageManagerMap = {
  'apt-get': 'dpkg', // "deb (apt)",
  dnf: 'dnf', // "rpm (dnf)",
  pacman: 'pacman',
  yum: 'yum', // "rpm (yum)",
  zypper: 'zypper', // "rpm (zypper)"
};

const packageTypes: PackageManagerToTypeMap = {
  'apt-get': 'deb', // "deb (apt)",
  dnf: 'rpm', // "rpm (dnf)",
  pacman: 'pacman',
  yum: 'rpm', // "rpm (yum)",
  zypper: 'rpm', // "rpm (zypper)"
};

export const findPackageManager = async (): Promise<PackageManager | null> => {
  for (const pkgManager of Object.keys(packageManagers)) {
    try {
      const { stdout } = await exec(`command -v ${pkgManager}`);
      if (stdout.trim()) {
        return packageManagers[pkgManager];
      }
    } catch (error) {
      // Command not found, continue checking the next
    }
  }
  // "Package manager not found.";
  return null;
};

export const findPackageType = async (): Promise<PackageType | null> => {
  for (const pkgManager of Object.keys(packageManagers)) {
    try {
      const { stdout } = await exec(`command -v ${pkgManager}`);
      if (stdout.trim()) {
        return packageTypes[pkgManager];
      }
    } catch (error) {
      // Command not found, continue checking the next
    }
  }
  // "Package manager not found.";
  return null;
};

// (async () => {
//   const result = await findPackageManager();
//   console.log("+++++++++++++++++++++++++", result);
// })();
