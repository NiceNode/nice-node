import { type BrowserWindow, dialog } from 'electron';

import type Node from '../common/node';
import type { NodeId } from '../common/node';
import {
  type CheckStorageDetails,
  getNodesDirPath,
  getSystemFreeDiskSpace,
} from './files';
import i18nMain from './i18nMain';
import logger from './logger';
import { getMainWindow } from './main';
import { getNode, updateNode } from './state/nodes';

const t = i18nMain.getFixedT(null, 'dialog');

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
    title: t('SelectFolderForStorage', {
      storageForName: node.spec.displayName,
    }),
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
    title: t('SelectNodeFolder'),
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

  return;
};
