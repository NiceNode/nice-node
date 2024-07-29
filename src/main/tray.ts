import fs from 'node:fs/promises';
import {
  BrowserWindow,
  Menu,
  MenuItem,
  Tray,
  dialog,
  ipcMain,
  nativeTheme,
  screen,
} from 'electron';
import { NodeStoppedBy } from '../common/node.js';
import logger from './logger';
import { createWindow, fullQuit, getMainWindow } from './main';
import { stopAllNodePackages } from './nodePackageManager.js';
import { isLinux, isWindows, isMac } from './platform';
import { getPodmanDetails } from './podman/details.js';
import { getNiceNodeMachine, stopMachineIfCreated } from './podman/machine';
import { openPodmanModal } from './podman/podman.js';
import { getUserNodePackages } from './state/nodePackages';
import { openNodePackageScreen } from './state/nodePackages.js';

// Can't import from main because of circular dependency
let _getAssetPath: (...paths: string[]) => string;

let tray: Tray;
let trayWindow: BrowserWindow | null = null;

// Can get asynchronously updated separately
let nodePackageTrayMenu: { label: string; click: () => void }[] = [];
let podmanTrayMenu: MenuItem[] = [];
let openNiceNodeMenu: { label: string; click: () => void }[] = [];

// todo: define when to use alert icon. For notifications? For errors?
export const setTrayIcon = (style: 'Default' | 'Alert') => {
  if (_getAssetPath) {
    if (isWindows()) {
      // Windows icon docs: https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction#icon-scaling
      tray.setImage(_getAssetPath('icon.ico'));
    } else {
      tray.setImage(
        _getAssetPath('icons', 'tray', `NNIcon${style}InvertedTemplate.png`),
      );
    }
  }
};

const openOrFocusWindow = () => {
  const mainWindow = getMainWindow();
  if (mainWindow === null) {
    // Create a new window if none exists
    createWindow();
  } else {
    // Show and focus on the existing window
    mainWindow.show();
    if (mainWindow.isMinimized()) {
      mainWindow.restore(); // Restore if minimized
    }
    mainWindow.focus(); // Focus on the window
  }
};

export const setTrayMenu = () => {
  const menuTemplate = [
    // Podman status with start, stop, and delete?
    ...nodePackageTrayMenu,
    { type: 'separator' },
    ...podmanTrayMenu,
    { type: 'separator' },
    ...openNiceNodeMenu,
    {
      label: 'Quit',
      click: () => {
        // Show confirmation dialog before quitting
        // TODO: get translated strings for this
        dialog
          .showMessageBox({
            type: 'question',
            buttons: ['Yes', 'No'],
            defaultId: 1, // Focus on 'No' by default
            title: 'Confirm',
            message: 'Are you sure you want to quit? Nodes will stop syncing.',
            detail: 'Confirming will close the application.',
          })
          .then(async (result) => {
            if (result.response === 0) {
              // The 'Yes' button is at index 0
              await stopAllNodePackages(NodeStoppedBy.shutdown);
              await stopMachineIfCreated();
              fullQuit(); // app no longer runs in the background
            }
            // Do nothing if the user selects 'No'
          })
          .catch((err) => {
            logger.error('Error showing dialog:', err);
          });
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate(menuTemplate as MenuItem[]);

  if (tray) {
    tray.setContextMenu(contextMenu);
  }
};

const getOpenNiceNodeMenu = () => {
  openNiceNodeMenu = [
    {
      label: 'Open NiceNode',
      click: () => {
        openOrFocusWindow();
      },
    },
  ];
  setTrayMenu();
};

const getNodePackageListMenu = () => {
  const userNodes = getUserNodePackages();
  let isAlert = false;
  nodePackageTrayMenu = userNodes.nodeIds.map((nodeId) => {
    const nodePackage = userNodes.nodes[nodeId];
    if (nodePackage.status.toLowerCase().includes('error')) {
      isAlert = true;
    }
    return {
      label: `${nodePackage.spec.displayName} Node                ${nodePackage.status}`,
      click: () => {
        openOrFocusWindow();
        openNodePackageScreen(nodePackage.id);
        logger.info(`clicked on ${nodePackage.spec.displayName}`);
      },
    };
  });
  setTrayMenu();
  if (isAlert) {
    setTrayIcon('Alert');
  } else {
    setTrayIcon('Default');
  }
};

const getPodmanMenuItem = async () => {
  if (isLinux()) {
    podmanTrayMenu = [];
    return;
  }
  let status = 'Loading...';
  try {
    const podmanMachine = await getNiceNodeMachine();
    if (podmanMachine) {
      status = podmanMachine.Running ? 'Running' : 'Stopped';
      if (podmanMachine.Starting === true) {
        status = 'Starting';
      }
    }
  } catch (e) {
    console.error('tray podmanMachine error: ', e);
    status = 'Not found';
  }
  podmanTrayMenu = [
    new MenuItem({
      label: `Podman    ${status}`,
      click: () => {
        logger.info('clicked on podman machine');
        // stop or start?
        if (status === 'Running' || status === 'Starting') {
          // stop
          stopMachineIfCreated();
        } else {
          openOrFocusWindow();
          openPodmanModal();
          // startMachineIfCreated();
        }
      },
      type: 'checkbox',
      checked: status === 'Running',
    }),
  ];
  setTrayMenu();
};

export const updateTrayMenu = () => {
  getPodmanMenuItem();
  getNodePackageListMenu();
  getOpenNiceNodeMenu();
};

function createCustomTrayWindow() {
  trayWindow = new BrowserWindow({
    // width: 277,
    height: 100, // Initial height
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
    vibrancy: isMac() ? 'sidebar' : undefined,
  });

  trayWindow.loadURL(`file://${_getAssetPath('trayIndex.html')}`);

  trayWindow.on('blur', () => {
    if (trayWindow) {
      trayWindow.hide();
    }
  });

  nativeTheme.on('updated', () => {
    const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    trayWindow?.webContents.send('set-theme', theme);
  });

  trayWindow.webContents.on('did-finish-load', () => {
    updateCustomTrayMenu();
  });

  ipcMain.on('adjust-height', (event, height) => {
    if (trayWindow) {
      trayWindow.setSize(300, height);
    }
  });

  ipcMain.on('node-package-click', (event, id) => {
    openOrFocusWindow();
    openNodePackageScreen(id);
    logger.info(`clicked on node package with id ${id}`);
  });

  ipcMain.on('podman-click', async (event) => {
    const { status } = await getCustomPodmanMenuItem();
    logger.info('clicked on podman machine');
    if (status === 'Running' || status === 'Starting') {
      stopMachineIfCreated();
    } else {
      openOrFocusWindow();
      openPodmanModal();
    }
  });

  ipcMain.on('show-main-window', async (event) => {
    logger.info('clicked on show-main-window');
    openOrFocusWindow();
  });

  ipcMain.on('quit-app', (event) => {
    dialog
      .showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 1, // Focus on 'No' by default
        title: 'Confirm',
        message: 'Are you sure you want to quit? Nodes will stop syncing.',
        detail: 'Confirming will close the application.',
      })
      .then(async (result) => {
        if (result.response === 0) {
          // The 'Yes' button is at index 0
          await stopAllNodePackages(NodeStoppedBy.shutdown);
          await stopMachineIfCreated();
          fullQuit(); // app no longer runs in the background
        }
        // Do nothing if the user selects 'No'
      })
      .catch((err) => {
        logger.error('Error showing dialog:', err);
      });
  });
}

const getCustomNodePackageListMenu = () => {
  const userNodes = getUserNodePackages();
  let isAlert = false;
  const nodePackageTrayMenu = userNodes.nodeIds.map((nodeId) => {
    const nodePackage = userNodes.nodes[nodeId];
    if (nodePackage.status.toLowerCase().includes('error')) {
      isAlert = true;
    }
    return {
      //TODO: localization
      name: `${nodePackage.spec.displayName} Node`,
      status: nodePackage.status,
      id: nodePackage.id,
    };
  });

  console.log('getCustomNodePackageListMenu');
  return { nodePackageTrayMenu, isAlert };
};

const getCustomPodmanMenuItem = async () => {
  if (isLinux()) {
    return { status: 'N/A' };
  }
  let status = 'notInstalled';
  try {
    const podmanMachine = await getNiceNodeMachine();
    if (podmanMachine) {
      const podmanDetails = await getPodmanDetails();
      switch (true) {
        case !podmanDetails.isInstalled:
          status = 'notInstalled';
          break;
        case podmanDetails.isOutdated:
          status = 'isOutdated';
          break;
        case !podmanDetails.isRunning:
          status = 'notRunning';
          break;
        case podmanDetails.isRunning:
          status = 'isRunning';
          break;
        default:
          status = 'isRunning';
      }
    }
  } catch (e) {
    console.error('tray podmanMachine error: ', e);
    status = 'Not found';
  }
  return { status };
};

const svgCache = new Map<string, string>();

const readSVGContent = async (filePath: string) => {
  if (svgCache.has(filePath)) {
    return svgCache.get(filePath);
  }

  try {
    const data = await fs.readFile(filePath, 'utf8');
    svgCache.set(filePath, data);
    return data;
  } catch (error) {
    console.error(`Error reading file from path ${filePath}`, error);
    return '';
  }
};

export const updateCustomTrayMenu = async () => {
  const { nodePackageTrayMenu, isAlert } = getCustomNodePackageListMenu();
  const podmanMenuItem = await getCustomPodmanMenuItem();

  const statusIcons = {
    synced: await readSVGContent(
      _getAssetPath('icons', 'tray', 'status', 'synced.svg'),
    ),
    error: await readSVGContent(
      _getAssetPath('icons', 'tray', 'status', 'error.svg'),
    ),
    syncing: await readSVGContent(
      _getAssetPath('icons', 'tray', 'status', 'syncing.svg'),
    ),
    default: await readSVGContent(
      _getAssetPath('icons', 'tray', 'status', 'syncing.svg'),
    ),
    stopped: await readSVGContent(
      _getAssetPath('icons', 'tray', 'status', 'stopped.svg'),
    ),
  };

  if (trayWindow) {
    trayWindow.webContents.send('update-menu', {
      nodePackageTrayMenu,
      podmanMenuItem,
      statusIcons,
    });
  }
  setTrayIcon(isAlert ? 'Alert' : 'Default');
};

function toggleCustomTrayWindow() {
  if (trayWindow.isVisible()) {
    trayWindow.hide();
  } else {
    const trayBounds = tray.getBounds(); // Get the bounds of the tray icon
    const windowBounds = trayWindow.getBounds();
    let x;
    let y;

    if (isMac()) {
      x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
      );
      y = Math.round(trayBounds.y + trayBounds.height);
    } else if (isWindows()) {
      const display = screen.getPrimaryDisplay(); // Get the primary display details
      const workArea = display.workArea;
      x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
      );

      // Check if taskbar is at the bottom or the top
      if (workArea.y < trayBounds.y) {
        y = Math.round(trayBounds.y - windowBounds.height); // Taskbar is at the bottom
      } else {
        y = Math.round(trayBounds.y + trayBounds.height); // Taskbar is at the top
      }
    } else {
      // Assume Linux behaves like Windows in this context
      // This could require adjustments based on the Linux distro and environment
      const display = screen.getPrimaryDisplay();
      const workArea = display.workArea;
      x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
      );
      y =
        workArea.y < trayBounds.y
          ? Math.round(trayBounds.y - windowBounds.height)
          : Math.round(trayBounds.y + trayBounds.height);
    }

    trayWindow.setPosition(x, y, false);
    trayWindow.show();
    trayWindow.focus();
  }
}

export const initialize = (getAssetPath: (...paths: string[]) => string) => {
  logger.info('tray initializing...');
  _getAssetPath = getAssetPath;

  let icon = getAssetPath('icons', 'tray', 'NNIconDefaultInvertedTemplate.png');
  if (isWindows()) {
    icon = getAssetPath('icon.ico');
  }

  tray = new Tray(icon);
  if (isMac()) {
    createCustomTrayWindow();
  } else {
    updateTrayMenu();
  }

  tray.on('click', () => {
    // on windows, default is open/show window on click
    // on mac, default is open menu on click (no code needed)
    // on linux?
    if (isMac()) {
      toggleCustomTrayWindow();
      updateCustomTrayMenu();
    } else {
      updateTrayMenu();
    }

    if (isWindows()) {
      const window = getMainWindow();
      if (window) {
        // brings window to the foreground and/or maximizes
        window.show();
      } else {
        // and if no window open yet
        createWindow();
      }
    }
  });

  // on windows, the menu opens with a right click (no code needed)
  // also, the 'right-click' event is not triggered on windows

  logger.info('tray initialized');
};

// todo: handle a node status change
// this could include a new node, removed node, or just a status change
