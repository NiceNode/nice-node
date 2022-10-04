import { FileDownloadProgress } from '../downloadFile';
import { CHANNELS, send } from '../messenger';

export const sendMessageOnDownloadProgress = (
  downloadProgress: FileDownloadProgress
) => {
  send(CHANNELS.docker, downloadProgress);
};
