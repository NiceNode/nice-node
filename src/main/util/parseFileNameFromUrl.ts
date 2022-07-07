export const parseFileNameFromUrl = (
  url: string,
  excludeExension?: boolean
) => {
  // ex. 'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.17-25c9b49f.tar.gz'
  let urlEncodedFilename;
  if (excludeExension) {
    const tarGzIndex = url.lastIndexOf('.tar.gz');
    const zipIndex = url.lastIndexOf('.zip');
    const extensionIndex = tarGzIndex > 0 ? tarGzIndex : zipIndex;
    urlEncodedFilename = url.substring(
      url.lastIndexOf('/') + 1,
      extensionIndex
    );
  } else {
    urlEncodedFilename = url.substring(url.lastIndexOf('/') + 1);
  }
  const filename = urlEncodedFilename.replaceAll('%20', '');
  return filename;
};
