import type { BinaryDownload } from '../common/nodeSpec';
import * as arch from './arch';
import { httpGetJson } from './httpReq';
import logger from './logger';
import * as platform from './platform';

export const getLatestReleaseUrl = async (binaryDownload: BinaryDownload) => {
  console.log('getLatestReleaseUrl');
  if (!binaryDownload.latestVersionUrl) {
    console.log('No latestVersionUrl found to get latest releases.');
    throw new Error('No latestVersionUrl found to get latest releases.');
  }
  const releaseJson = await httpGetJson(binaryDownload.latestVersionUrl);
  console.log('getLatestReleaseUrl releaseJson', releaseJson);
  const platformLowercase = platform.getPlatform();
  const archLowercase = arch.getArch();
  if (Array.isArray(releaseJson?.assets)) {
    const matchedAsset = releaseJson?.assets.find((asset: any) => {
      if (typeof asset?.name === 'string') {
        const assetNameLowercase = asset.name.toLowerCase();
        console.log(platformLowercase, archLowercase, assetNameLowercase);
        // doesStringIncludePlatform checks for variations of the platform and arch in the asset names
        //  ex. a windows release asset can have win32 or windows in the name
        if (
          platform.doesStringIncludePlatform(assetNameLowercase) &&
          arch.doesStringIncludeArch(assetNameLowercase)
        ) {
          // check if it should exclude a value
          if (
            binaryDownload?.excludeNameWith &&
            assetNameLowercase.includes(binaryDownload.excludeNameWith)
          ) {
            return false;
          }
          return true;
        }
      }
      return false;
    });
    logger.info(
      `Release matchedAsset ${matchedAsset} found for ${platformLowercase} ${archLowercase}`,
    );
    if (matchedAsset?.browser_download_url) {
      logger.info(
        `Release URL ${matchedAsset?.browser_download_url} found for ${platformLowercase} ${archLowercase}`,
      );
      return matchedAsset?.browser_download_url;
    }
    // if no asset is found, fallback?
    logger.error(
      `Unable to find a release for ${platformLowercase} ${archLowercase}`,
    );
  }

  // get platform & arch
  // if (platform.isMac()) {
  //   return binaryDownload?.darwin?.amd64;
  // }
  // if (platform.isWindows()) {
  //   if (arch.isX86And32bit()) {
  //     return binaryDownload?.windows?.amd32;
  //   }
  //   if (arch.isX86And64bit()) {
  //     return binaryDownload?.windows?.amd64;
  //   }
  //   // No official Geth build for Windows on ARM
  // } else if (platform.isLinux()) {
  //   if (arch.isX86And32bit()) {
  //     return binaryDownload?.linux?.amd32;
  //   }
  //   if (arch.isX86And64bit()) {
  //     return binaryDownload?.linux?.amd64;
  //   }
  //   if (arch.isArmAnd32bit()) {
  //     return binaryDownload?.linux?.arm7;
  //   }
  //   if (arch.isArmAnd64bit()) {
  //     return binaryDownload?.linux?.arm64;
  //   }
  // }
  throw new Error(
    `Platform ${platform.getPlatform()} and arch ${arch.getArch()} is not supported by NiceNode.`,
  );
};
