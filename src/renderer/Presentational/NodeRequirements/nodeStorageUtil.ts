import type { Systeminformation } from 'systeminformation';
import type { SystemData } from '../../../main/systemInfo';

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
  nodeStorageLocation: string,
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
    console.error(
      `No storage device found for location ${nodeStorageLocation}`,
    );
    return undefined;
  }

  // Find free storage
  let matchedFileSystemSizes: Systeminformation.FsSizeData | undefined;
  systemData.fsSize?.forEach((fileSystemSizes) => {
    if (longestMatchBlockDevice?.mount === fileSystemSizes.mount) {
      matchedFileSystemSizes = fileSystemSizes;
    }
  });

  if (matchedFileSystemSizes === undefined) {
    console.error(`No filesystem found for location ${nodeStorageLocation}`);
    return undefined;
  }

  // Use matched file system or blockDevice to retrieve disk name
  console.log(
    'Matched Filesystem and BlockDevice',
    matchedFileSystemSizes,
    longestMatchBlockDevice,
    systemData.diskLayout,
  );
  let matchedDisk: Systeminformation.DiskLayoutData | undefined;
  systemData.diskLayout?.forEach((disk) => {
    if (longestMatchBlockDevice?.device === disk.device) {
      // windows and linux
      matchedDisk = disk;
    } else if (longestMatchBlockDevice?.device === `/dev/${disk.device}`) {
      // mac
      matchedDisk = disk;
    }
  });

  const storageName = matchedDisk
    ? matchedDisk.name
    : longestMatchBlockDevice.label;

  // Example types: 'NVMe SSD' (win), 'PCIe NVMe' (mac)
  const storageType = matchedDisk
    ? `${matchedDisk.interfaceType} ${matchedDisk.type}`
    : longestMatchBlockDevice.physical;

  // todo: add total disk space? disk.size
  return {
    type: storageType,
    name: storageName,
    freeSpaceGBs: matchedFileSystemSizes.available * 1e-9,
  };
};
