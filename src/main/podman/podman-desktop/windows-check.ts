/**
 * Based from WinCheck in podman-desktop repo src/extensions/podman/podman-install
 */
import * as os from 'node:os';
import { FailSystemRequirements } from '../../minSystemRequirement';
import { execPromise } from './podman-cli';

export const getFailSystemRequirements = async (): Promise<
  FailSystemRequirements[]
> => {
  const failedRequirements: FailSystemRequirements[] = [];

  const MIN_BUILD = 18362;
  const winRelease = os.release();
  let winBuild;
  if (winRelease.startsWith('10.0.')) {
    const splitRelease = winRelease.split('.');
    // eslint-disable-next-line prefer-destructuring
    winBuild = splitRelease[2];
  }
  if (!winBuild || Number.parseInt(winBuild, 10) < MIN_BUILD) {
    failedRequirements.push({
      type: 'OS',
      value: winRelease,
      requirement: `10.0.${MIN_BUILD}`,
    });
  }

  let isVmpEnabled = false;
  // set CurrentUICulture to force output in english
  try {
    const res = await execPromise('powershell.exe', [
      '(Get-WmiObject -Query "Select * from Win32_OptionalFeature where InstallState = \'1\'").Name | select-string VirtualMachinePlatform',
    ]);
    if (res.indexOf('VirtualMachinePlatform') >= 0) {
      isVmpEnabled = true;
    }
  } catch (err) {
    // ignore error, it means it is disabled
  }

  if (!isVmpEnabled) {
    failedRequirements.push({
      type: 'VirtualMachinePlatform',
      value: 'Disabled',
      requirement: 'Enabled',
    });
  }

  const REQUIRED_MEM = 6 * 1024 * 1024 * 1024; // 6Gb
  const totalMem = os.totalmem();
  if (totalMem < REQUIRED_MEM) {
    failedRequirements.push({
      type: 'TotalMemory',
      value: totalMem,
      requirement: REQUIRED_MEM,
    });
  }

  const ARCH_X64 = 'x64';
  const ARCH_ARM = 'arm64';
  const userArch = process.arch;
  if (ARCH_X64 !== userArch && ARCH_ARM !== userArch) {
    failedRequirements.push({
      type: 'CpuArch',
      value: userArch,
      requirement: `${ARCH_X64} or ${ARCH_ARM}`,
    });
  }

  return failedRequirements;
};
