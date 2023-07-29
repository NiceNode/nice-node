import { isMac, isWindows } from './platform';
import { getFailSystemRequirements as macOsGetFailSystemRequirements } from './podman/podman-desktop/macos-check';
import { getFailSystemRequirements as winGetFailSystemRequirements } from './podman/podman-desktop/windows-check';

export type FailSystemRequirements = {
  type:
    | 'OS'
    | 'CpuCores'
    | 'TotalMemory'
    | 'VirtualMachinePlatform'
    | 'CpuArch';
  value: string | number;
  requirement: string | number;
};

export type FailSystemRequirementsData = {
  operatingSystem: 'macOS' | 'Windows' | 'Linux';
  failedRequirements: FailSystemRequirements[];
};

/**
 *  These are the bare minimum system requirements for using NiceNode, primarily
 *  running any type of container. The user may be able to navigate the app with requirements
 *  less than these.
 *  Right now it is just based on Podman requirements
 * @returns FailSystemRequirementsData
 */
export const getFailSystemRequirements =
  async (): Promise<FailSystemRequirementsData> => {
    if (isMac()) {
      return {
        operatingSystem: 'macOS',
        failedRequirements: macOsGetFailSystemRequirements(),
      };
    }
    if (isWindows()) {
      return {
        operatingSystem: 'Windows',
        failedRequirements: await winGetFailSystemRequirements(),
      };
    }
    // no minimum system requirements for linux at the moment
    return {
      operatingSystem: 'Linux',
      failedRequirements: [],
    };
  };
