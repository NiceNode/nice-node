import { Menu, Tray, MenuItem } from 'electron';
import logger from './logger';
import { createWindow, fullQuit, getMainWindow } from './main';
import { getUserNodePackages } from './state/nodePackages';
import { isLinux, isWindows } from './platform';
import {
  getNiceNodeMachine,
  startMachineIfCreated,
  stopMachineIfCreated,
} from './podman/machine';

// Can't import from main because of circular dependency
// eslint-disable-next-line no-underscore-dangle
let _getAssetPath: (...paths: string[]) => string;

let tray: Tray;

// Can get asyncronously updated separately
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

export const setTrayMenu = () => {
  const menuTemplate = [
    // todo: change icon if there are any status errors
    ...nodePackageTrayMenu,
    { type: 'separator' },
    // todo: show in developer mode

    // todo: add podman status with start, stop, and delete?
    ...openNiceNodeMenu,
    {
      label: 'Full Quit',
      click: () => {
        fullQuit(); // app no longer runs in the background
      },
    },
  ];
  if (process.env.NODE_ENV === 'development') {
    menuTemplate.push(...podmanTrayMenu, { type: 'separator' });
  }
  const contextMenu = Menu.buildFromTemplate(menuTemplate as MenuItem[]);

  if (tray) {
    tray.setContextMenu(contextMenu);
  }
};

const getOpenNiceNodeMenu = () => {
  if (getMainWindow() === null) {
    openNiceNodeMenu = [
      {
        label: 'Open NiceNode',
        click: () => {
          createWindow(); // app no longer runs in the background
        },
      },
    ];
  } else {
    openNiceNodeMenu = [];
  }
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
      label: `${nodePackage.spec.displayName} Node    ${nodePackage.status}`,
      click: () => {
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
          // try to start if any other start
          startMachineIfCreated();
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

export const initialize = (getAssetPath: (...paths: string[]) => string) => {
  logger.info('tray initializing...');
  _getAssetPath = getAssetPath;
  let icon = getAssetPath('icons', 'tray', 'NNIconDefaultInvertedTemplate.png');
  if (isWindows()) {
    icon = getAssetPath('icon.ico');
  }

  tray = new Tray(icon);
  // on windows, show a colored icon, 64x64 default icon seems ok
  updateTrayMenu();
  // Update the status of everything in the tray when it is opened
  tray.on('click', () => {
    // on windows, default is open/show window on click
    // on mac, default is open menu on click (no code needed)
    // on linux?
    updateTrayMenu();
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
