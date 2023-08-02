/* eslint-disable consistent-return */
import { BrowserWindow, dialog } from 'electron';

import Node, { NodeId } from '../common/node';
import {
  getNodesDirPath,
  CheckStorageDetails,
  getSystemFreeDiskSpace,
} from './files';
import logger from './logger';
// eslint-disable-next-line import/no-cycle
import { getMainWindow } from './main';
import { getNode, updateNode } from './state/nodes';

export const updateNodeDataDir = async (node: Node, newDataDir: string) => {
  node.runtime.dataDir = newDataDir;
  node.config.configValuesMap.dataDir = newDataDir;
  updateNode(node);
};

export const openDialogForNodeDataDir = async (nodeId: NodeId) => {
  const node = getNode(nodeId);
  if (!node) {
    logger.error(
      `Unable to open dialog to select node data dir. No node found for node id ${nodeId}`,
    );
    return;
  }
  const mainWindow: BrowserWindow | null = getMainWindow();
  if (!mainWindow) {
    logger.error(
      'Unable to open dialog to select node data dir. mainWindow is null.',
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
      return result.filePaths[0];
    }
  }
  // eslint-disable-next-line no-useless-return
  return;
};

export const openDialogForStorageLocation = async (): Promise<
  CheckStorageDetails | undefined
> => {
  const mainWindow: BrowserWindow | null = getMainWindow();
  if (!mainWindow) {
    logger.error(
      'Unable to open dialog to select storage location. mainWindow is null.',
    );
    return;
  }
  const defaultPath = getNodesDirPath();
  const result = await dialog.showOpenDialog(mainWindow, {
    title: `Select a folder for storing node data`,
    defaultPath,
    properties: ['openDirectory'],
  });
  console.log('dir select result: ', result);
  if (result.canceled) {
    return;
  }
  if (result.filePaths) {
    if (result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      const freeStorageGBs = await getSystemFreeDiskSpace(folderPath);
      return {
        folderPath,
        freeStorageGBs,
      };
    }
  }
  // eslint-disable-next-line no-useless-return
  return;
};
