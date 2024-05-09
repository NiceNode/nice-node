import logger from '../logger';
import type { FailSystemRequirements } from '../minSystemRequirement';
import { getOperatingSystemInfo } from '../systemInfo';

export const getFailSystemRequirements = async (): Promise<
  FailSystemRequirements[]
> => {
  const failedRequirements: FailSystemRequirements[] = [];

  const { distro, release } = await getOperatingSystemInfo();
  logger.info(
    `linux-check: getFailSystemRequirements distro and release: ${distro} & ${release} ...`,
  );
  const lcDistro = distro.toLowerCase();

  let minOsRelease = '';
  if (lcDistro.includes('ubuntu')) {
    minOsRelease = '22.04';
  } else if (lcDistro.includes('debian')) {
    minOsRelease = '12';
  } else if (lcDistro.includes('fedora')) {
    minOsRelease = '37';
  } else if (lcDistro.includes('manjaro')) {
    minOsRelease = '22';
  } else if (lcDistro.includes('linuxmint')) {
    minOsRelease = '21'; // v21 is based on ubuntu 22.04
  } else {
    logger.info('No minimum os version known for this distro.');
  }

  logger.info(
    `linux-check: minOsRelease required is: ${minOsRelease} and user release is ${release}`,
  );
  if (release < minOsRelease) {
    const readableUserOs = `${distro} ${release}`;
    const readableMinimumOs = `${distro} ${minOsRelease}`;

    failedRequirements.push({
      type: 'OS',
      value: readableUserOs,
      requirement: readableMinimumOs,
    });
  }

  // const REQUIRED_MEM = 4 * 1024 * 1024 * 1024; // 4Gb
  // const totalMem = os.totalmem();
  // if (totalMem < REQUIRED_MEM) {
  //   failedRequirements.push({
  //     type: 'TotalMemory',
  //     value: totalMem,
  //     requirement: REQUIRED_MEM,
  //   });
  // }

  // const MIN_CPU_CORES = 2;
  // const cpus = os.cpus().length;
  // if (cpus < MIN_CPU_CORES) {
  //   failedRequirements.push({
  //     type: 'CpuCores',
  //     value: cpus,
  //     requirement: MIN_CPU_CORES,
  //   });
  // }

  // // TESTS
  // failedRequirements.push({
  //   type: 'VirtualMachinePlatform',
  //   value: 'Disabled',
  //   requirement: 'Enabled',
  // });
  logger.info(
    `Failed system requirements: ${JSON.stringify(failedRequirements)}`,
  );
  return failedRequirements;
};
