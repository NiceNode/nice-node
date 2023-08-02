import * as platform from '../platform';

export const parseFileNameFromPath = (
  inPath: string,
  excludeExension?: boolean,
) => {
  // ex. 'C:\Windows\crazy\inPath'
  // ex. '/root/usr/yay.zip
  let pathSlash = '/';
  if (platform.isWindows()) {
    pathSlash = '\\';
  }
  if (excludeExension) {
    const tarGzIndex = inPath.lastIndexOf('.tar.gz');
    const zipIndex = inPath.lastIndexOf('.zip');
    const extensionIndex = tarGzIndex > 0 ? tarGzIndex : zipIndex;

    return inPath.substring(inPath.lastIndexOf(pathSlash) + 1, extensionIndex);
  }
  return inPath.substring(inPath.lastIndexOf(pathSlash) + 1);
};
