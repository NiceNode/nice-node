import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  clipboard,
} from 'electron';
import {
  getSetHasSeenSplashscreen,
  getSetHasSeenAlphaModal,
} from './state/settings';

import { getDebugInfoString, getGithubIssueProblemURL } from './debug';
import { checkForUpdates } from './updater';
import uninstallPodman from './podman/uninstall/uninstall';
import nuclearUninstall from './nuclearUninstall';
import { getFailSystemRequirements } from './minSystemRequirement';
import { removeAllNodePackages } from './nodePackageManager';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'NiceNode',
      submenu: [
        {
          label: 'About NiceNode',
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          label: 'Check for updates...',
          click() {
            checkForUpdates(true);
          },
        },
        { type: 'separator' },
        {
          label: 'Hide NiceNode',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    // For users to copy and paste with keyboard shortcuts, this is required
    // to be in the menu on macOS.
    // https://pracucci.com/atom-electron-enable-copy-and-paste.html
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'NiceNode Website',
          click() {
            shell.openExternal('https://nicenode.xyz');
          },
        },
        { type: 'separator' },
        {
          label: 'Report Problems',
          click() {
            shell.openExternal(getGithubIssueProblemURL());
          },
        },
        {
          label: 'Copy Configuration Details to Clipboard',
          click() {
            clipboard.writeText(getDebugInfoString());
          },
        },
        { type: 'separator' },
        {
          label: 'Show Splash Screen On Launch',
          click() {
            getSetHasSeenSplashscreen(false);
          },
        },
        { type: 'separator' },
        {
          label: 'Show Alpha Modal',
          click() {
            getSetHasSeenAlphaModal(false);
          },
        },
        { type: 'separator' },
        {
          label: 'Remove all nodes and data',
          click() {
            removeAllNodePackages();
          },
        },
        {
          label: 'Uninstall podman',
          click() {
            uninstallPodman();
          },
        },
        {
          label: 'Nuclear uninstall (unistall podman and delete all NN data)',
          click() {
            nuclearUninstall();
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&NiceNode',
        submenu: [
          {
            label: 'Check for updates...',
            click() {
              checkForUpdates(true);
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: '&Close',
                  accelerator: 'Ctrl+W',
                  click: () => {
                    this.mainWindow.close();
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'NiceNode Website',
            click() {
              shell.openExternal('https://nicenode.xyz');
            },
          },
          {
            label: 'Report Problems',
            click() {
              shell.openExternal(getGithubIssueProblemURL());
            },
          },
          {
            label: 'Copy Configuration Details to Clipboard',
            click() {
              clipboard.writeText(getDebugInfoString());
            },
          },
          {
            label: 'Remove all nodes and data',
            click() {
              removeAllNodePackages();
            },
          },
          {
            label: 'Uninstall podman',
            click() {
              uninstallPodman();
            },
          },
          {
            label: 'Nuclear uninstall (unistall podman and delete all NN data)',
            click() {
              nuclearUninstall();
            },
          },
          {
            label: 'Log minimum system requirement check',
            click() {
              getFailSystemRequirements();
            },
          },
          {
            label: 'Show Splash Screen On Launch',
            click() {
              getSetHasSeenSplashscreen(false);
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
