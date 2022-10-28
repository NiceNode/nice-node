import { Systeminformation } from 'systeminformation';
import { SystemData } from '../../../main/systemInfo';

export type SystemStorageLocation = {
  type: string;
  name: string;
  freeSpaceGBs: number;
};

/**
 * The mounted storage partition and storage device are found by
 * matching the location to one of the storage mounts in systemData
 * @param systemData
 * @param nodeStorageLocation
 */
export const findSystemStorageDetailsAtALocation = (
  systemData: SystemData,
  nodeStorageLocation: string
): SystemStorageLocation | undefined => {
  // From blockDevices…If( storageLoc.startsWith(mountPath) && highest Char match)
  // ignore mountPath “/“ case, if no match, assume?

  if (!systemData) {
    return undefined;
  }

  let longestMountPathMatch = -1;
  let longestMatchBlockDevice: Systeminformation.BlockDevicesData | undefined;
  systemData.blockDevices?.forEach((blockDevice) => {
    if (nodeStorageLocation.startsWith(blockDevice.mount)) {
      if (blockDevice.mount.length > longestMountPathMatch) {
        longestMountPathMatch = blockDevice.mount.length;
        longestMatchBlockDevice = blockDevice;
      }
    }
  });

  if (longestMatchBlockDevice === undefined) {
    throw new Error(
      `No storage device found for location ${nodeStorageLocation}`
    );
  }

  // Find free storage
  let matchedFileSystemSizes: Systeminformation.FsSizeData | undefined;
  systemData.fsSize?.forEach((fileSystemSizes) => {
    if (longestMatchBlockDevice?.mount === fileSystemSizes.mount) {
      matchedFileSystemSizes = fileSystemSizes;
    }
  });

  if (matchedFileSystemSizes === undefined) {
    throw new Error(`No filesystem found for location ${nodeStorageLocation}`);
  }

  return {
    type: longestMatchBlockDevice.physical,
    name: longestMatchBlockDevice.label,
    freeSpaceGBs: matchedFileSystemSizes.available * 1e-9,
  };
};
