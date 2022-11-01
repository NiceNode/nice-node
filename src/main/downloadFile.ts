import path from 'node:path';
import { pipeline, Transform } from 'node:stream';
import { promisify } from 'node:util';
import { createWriteStream } from 'fs';
import { chmod } from 'fs/promises';
import { throttle } from 'throttle-debounce';

import { doesFileOrDirExist } from './files';
import logger from './logger';
import { parseFileNameFromUrl } from './util/parseFileNameFromUrl';
import { httpGet } from './httpReq';

const streamPipeline = promisify(pipeline);

export type FileDownloadProgress = {
  totalBytes: number;
  downloadedBytes: number;
};
/**
 * Downloads the file to directory.
 * @param downloadUrl
 * @param directory
 * @returns path of the downloaded file
 */
export const downloadFile = async (
  downloadUrl: string,
  directory: string,
  progressListener?: (progress: FileDownloadProgress) => void
): Promise<string> => {
  logger.info(`downloading file ${downloadUrl}`);
  // todo: return error if no file in url
  const downloadFileName = parseFileNameFromUrl(downloadUrl);
  logger.info(`file full filename ${downloadFileName}`);
  const fileOutPath = path.join(directory, downloadFileName);

  // if fileOutPath exists, use it, but we should delete and retry...?
  if (!(await doesFileOrDirExist(fileOutPath))) {
    try {
      const response = await httpGet(downloadUrl, {
        headers: [{ name: 'Accept', value: 'application/octet-stream' }],
      });
      // if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
      logger.info('http response received');
      logger.info('http response', response);
      console.log(
        'http response content-length',
        response.headers['content-length']
      );
      console.log(
        'http response Content-Length',
        response.headers['Content-Length']
      );
      let totalBytes = 0;
      if (response.headers['content-length']) {
        totalBytes = parseInt(response.headers['content-length'], 10);
      }
      const fileWriteStream = createWriteStream(fileOutPath);

      logger.info('piping response to fileWriteStream');

      let downloadedBytes = 0;
      const throttleProgressListener = throttle(1000, (currBytes: number) => {
        const update: FileDownloadProgress = {
          totalBytes,
          downloadedBytes: currBytes,
        };
        console.log('update: ', update);
        if (progressListener) {
          progressListener(update);
        }
      });
      const streamProgress = new Transform({
        transform(chunk, _encoding, callback) {
          downloadedBytes += chunk.length;
          throttleProgressListener(downloadedBytes);
          this.push(chunk);
          callback();
        },
      });
      await streamPipeline(response, streamProgress, fileWriteStream);
      // } else {
      //   await streamPipeline(response, fileWriteStream);
      // }
      logger.info(
        'done piping response to fileWriteStream. closing fileWriteStream.'
      );
      await fileWriteStream.close();

      // allow anyone to read the file
      logger.info('closed file');
      await chmod(fileOutPath, 0o444);
      logger.info('modified file permissions');
    } catch (err) {
      logger.error('error downloading file', err);
      throw err;
    }
  } else {
    logger.info('Downloaded file already exists');
  }
  return fileOutPath;
};
