/**
 * Downloads the file to directory.
 * @param downloadUrl
 * @param directory
 */
export const downloadFile = async (downloadUrl: string, directory: string) => {
  logger.info(`downloading binary ${downloadUrl}`);
  const downloadFileName = parseFileNameFromUrl(downloadUrl);
  logger.info(`binary full filename ${downloadFileName}`);
  const fileOutPath = path.join(directory, downloadFileName);

  // if fileOutPath exists, use it, but we should delete and retry...
  if (!(await doesFileOrDirExist(fileOutPath))) {
    try {
      const response = await httpGet(downloadUrl, {
        headers: [{ name: 'Accept', value: 'application/octet-stream' }],
      });

      // if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
      logger.info('http response received');

      // if (platform.isWindows()) {
      //   fileOutPath = `${directory}/geth.zip`;
      // }
      const fileWriteStream = createWriteStream(fileOutPath);

      logger.info('piping response to fileWriteStream');
      // await streamPromises.pipeline(data, fileWriteStream);
      await streamPipeline(response, fileWriteStream);
      logger.info(
        'done piping response to fileWriteStream. closing fileWriteStream.'
      );
      await fileWriteStream.close();

      // allow anyone to read the file
      logger.info('closed file');
      await chmod(fileOutPath, 0o444);
      logger.info('modified file permissions');
    } catch (err) {
      logger.error('error downloading binary', err);
      // status = NODE_STATUS.errorDownloading;
      // send(CHANNELS.geth, status);
      throw err;
    }
  } else {
    logger.info('Downloaded binary already exists');
  }

  await unzipFile(fileOutPath, directory);
};
