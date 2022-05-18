import { BrowserWindow, dialog } from 'electron';

import { NodeId } from '../common/node';
import { getNodesDirPath } from './files';
import logger from './logger';
// eslint-disable-next-line import/no-cycle
import { getMainWindow } from './main';
import { getNode, updateNode } from './state/nodes';

export const openDialogForNodeDataDir = async (nodeId: NodeId) => {
  const node = getNode(nodeId);
  if (!node) {
    logger.error(
      `Unable to open dialog to select node data dir. No node found for node id ${nodeId}`
    );
    return;
  }
  const mainWindow: BrowserWindow | null = getMainWindow();
  if (!mainWindow) {
    logger.error(
      'Unable to open dialog to select node data dir. mainWindow is null.'
    );
    return;
  }
  let defaultPath;
  if (node.runtime.dataDir) {
    defaultPath = node.runtime.dataDir;
  } else {
    defaultPath = getNodesDirPath();
  }
  const result = await dialog.showOpenDialog(mainWindow, {
    title: `Select folder for ${node.spec.displayName} storage`,
    defaultPath,
    properties: ['openDirectory'],
  });
  console.log('dir select result: ', result);
  if (result.canceled) {
    return;
  }
  if (result.filePaths) {
    if (result.filePaths.length > 0) {
      const newDataDir = result.filePaths[0];
      node.runtime.dataDir = newDataDir;
      node.config.configValuesMap.dataDir = newDataDir;
      updateNode(node);
    }
  }
  // .then(async (buttonIndex) => {
  //   if (buttonIndex.response === 0) {
  //     console.log('update accepted by user');
  //     console.log('starting download');
  //     autoUpdater.downloadUpdate();
  //     dialog.showMessageBox(browserWindow, {
  //       type: 'info',
  //       title: 'Updates for NiceNode available',
  //       message: `Downloading NiceNode update...`,
  //     });
  //   } else {
  //     console.log('update checkbox not checked');
  //   }
  // })
  // .catch((err) => {
  //   console.error('error in update available diaglog: ', err);
  // });
};
