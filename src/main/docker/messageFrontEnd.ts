import type { FileDownloadProgress } from '../downloadFile';
import { CHANNELS, send } from '../messenger';

export const sendMessageOnDownloadProgress = (
  downloadProgress: FileDownloadProgress,
) => {
  send(CHANNELS.podman, downloadProgress);
};

export const sendMessageOnThemeChange = () => {
  send(CHANNELS.theme, 'themeChange');
};
