import { FileDownloadProgress } from '../downloadFile';
import { CHANNELS, send } from '../messenger';

export interface IpcMessage {
  messageId: string;
  value: unknown;
}

export class MessageGrantPermissionToInstallPodman {
  messageId = 'isGrantedPermission';
  value = false;
}

export const sendMessageOnDownloadProgress = (
  downloadProgress: FileDownloadProgress,
) => {
  send(CHANNELS.podman, downloadProgress);
};

export const sendMessageOnGrantPermissionToInstallPodman = (
  isGrantedPermission: boolean,
) => {
  const message: MessageGrantPermissionToInstallPodman =
    new MessageGrantPermissionToInstallPodman();
  message.messageId = 'isGrantedPermission';
  message.value = isGrantedPermission;
  send(CHANNELS.podmanInstall, message);
};

export const sendMessageOnThemeChange = () => {
  send(CHANNELS.theme, 'themeChange');
};
