/**
 * Based from macos-check in podman-desktop repo src/extensions/podman/
 */
import * as os from 'node:os';
import { FailSystemRequirements } from '../../minSystemRequirement';

import darwinToMacOsVersion from '../../util/macos-release';
import logger from '../../logger';

export const getFailSystemRequirements = (): FailSystemRequirements[] => {
  const failedRequirements: FailSystemRequirements[] = [];

  const MINIMUM_VERSION = '19.0.0';
  const userDarwinVersion = os.release();
  if (userDarwinVersion < MINIMUM_VERSION) {
    const userMacOs = darwinToMacOsVersion(userDarwinVersion);
    const readableUserOs = `${userMacOs.name} macOS ${userMacOs.version}`;
    const minimumMacOs = darwinToMacOsVersion(MINIMUM_VERSION);
    const readableMinimumOs = `${minimumMacOs.name} macOS ${minimumMacOs.version}`;

    failedRequirements.push({
      type: 'OS',
      value: readableUserOs,
      requirement: readableMinimumOs,
    });
  }

  const REQUIRED_MEM = 4 * 1024 * 1024 * 1024; // 4Gb
  const totalMem = os.totalmem();
  if (totalMem < REQUIRED_MEM) {
    failedRequirements.push({
      type: 'TotalMemory',
      value: totalMem,
      requirement: REQUIRED_MEM,
    });
  }

  const MIN_CPU_CORES = 2;
  const cpus = os.cpus().length;
  if (cpus < MIN_CPU_CORES) {
    failedRequirements.push({
      type: 'CpuCores',
      value: cpus,
      requirement: MIN_CPU_CORES,
    });
  }

  // // TESTS
  // failedRequirements.push({
  //   type: 'VirtualMachinePlatform',
  //   value: 'Disabled',
  //   requirement: 'Enabled',
  // });
  // failedRequirements.push({
  //   type: 'CpuArch',
  //   value: 'ia32',
  //   requirement: `amd64 or arm64`,
  // });

  logger.info(
    `Failed system requirements: ${JSON.stringify(failedRequirements)}`,
  );
  return failedRequirements;
};
