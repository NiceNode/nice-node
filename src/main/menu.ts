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
import { checkNodePortsAndNotify } from './ports';
import { reportEvent } from './events';
import { onResume, onShutdown, onSuspend } from './power';
import { i18nMain } from './i18nMain';
import logger from './logger';
import { checkForPodmanUpdate } from './podman/update';
import { runBenchmark } from './benchbuddy/runBenchmark';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

interface CommonMenuItemConstructorOptions {
  label: string;
  submenu: { label: string; click: () => void; accelerator?: string }[];
}

const developerMenu: CommonMenuItemConstructorOptions = {
  label: 'Developer',
  submenu: [
    {
      label: 'Simulate Shutdown',
      click: () => {
        onShutdown();
      },
    },
    {
      label: 'Simulate Suspend',
      click: () => {
        onSuspend();
      },
    },
    {
      label: 'Simulate Resume',
      click: () => {
        onResume();
      },
    },
    {
      label: 'Run Benchmark',
      click: () => {
        runBenchmark();
      },
    },
  ],
};
const t = i18nMain.getFixedT(null, 'windowMenu');
export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    logger.info('Building menu. Current Lang is : ', i18nMain.language);
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

  // ============================
  // ======== macOS Menu ========
  // ============================
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'NiceNode',
      submenu: [
        {
          label: t('AboutNiceNode'),
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          label: t('CheckForUpdates'),
          click() {
            reportEvent('UserCheckForUpdateNN');
            checkForUpdates(true);
          },
        },
        { type: 'separator' },
        {
          label: t('HideNiceNode'),
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        { type: 'separator' },
        {
          label: t('Quit'),
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
      label: t('Edit'),
      submenu: [
        { label: t('Undo'), accelerator: 'Command+Z', selector: 'undo:' },
        { label: t('Redo'), accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: t('Cut'), accelerator: 'Command+X', selector: 'cut:' },
        { label: t('Copy'), accelerator: 'Command+C', selector: 'copy:' },
        { label: t('Paste'), accelerator: 'Command+V', selector: 'paste:' },
        {
          label: t('Select All'),
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: t('View'),
      submenu: [
        {
          label: t('Reload'),
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: t('ToggleFullScreen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: t('ToggleDeveloperTools'),
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
          label: t('ToggleFullScreen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: t('Window'),
      submenu: [
        {
          label: t('Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: t('Close'),
          accelerator: 'Command+W',
          selector: 'performClose:',
        },
        { type: 'separator' },
        { label: t('Bring All to Front'), selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: t('Help'),
      submenu: [
        {
          label: t('NiceNodeWebsite'),
          click() {
            shell.openExternal('https://nicenode.xyz');
          },
        },
        { type: 'separator' },
        {
          label: t('ReportAProblem'),
          async click() {
            const url = await getGithubIssueProblemURL();
            shell.openExternal(url);
          },
        },
        {
          label: t('CopyConfigurationDetailsToClipboard'),
          click() {
            clipboard.writeText(getDebugInfoString());
          },
        },
        { type: 'separator' },
        {
          label: t('ShowSplashScreenAgain'),
          click() {
            getSetHasSeenSplashscreen(false);
          },
        },
        { type: 'separator' },
        {
          label: t('Show Alpha Modal'),
          click() {
            getSetHasSeenAlphaModal(false);
          },
        },
        { type: 'separator' },
        {
          label: t('Check Ports'),
          click() {
            checkNodePortsAndNotify();
          },
        },
        { type: 'separator' },
        {
          label: t('RemoveAllNodesAndData'),
          click() {
            removeAllNodePackages();
          },
        },
        {
          label: t('UninstallPodman'),
          click() {
            uninstallPodman();
          },
        },
        {
          label: t('NuclearUninstall'),
          click() {
            nuclearUninstall();
          },
        },
        { type: 'separator' },
        {
          label: t('Update Podman'),
          click() {
            checkForPodmanUpdate();
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    const menus = [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp,
    ];
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      menus.push(developerMenu);
    }
    return menus;
  }

  // ============================
  // ====== non-macOS Menu ======
  // ============================
  // Prefix '&' for Alt-<char> keyboard shortcuts
  // Example: &File allows Alt-F to open File menu
  // more: https://www.electronjs.org/docs/latest/api/menu
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: 'NiceNode',
        submenu: [
          {
            label: t('CheckForUpdates'),
            click() {
              reportEvent('UserCheckForUpdateNN');
              checkForUpdates(true);
            },
          },
        ],
      },
      {
        label: `&${t('View')}`,
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: t('Reload'),
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: t('ToggleFullScreen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: t('ToggleDeveloperTools'),
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: t('ToggleFullScreen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: `&${t('Close')}`,
                  accelerator: 'Ctrl+W',
                  click: () => {
                    this.mainWindow.close();
                  },
                },
              ],
      },
      {
        label: t('Help'),
        submenu: [
          {
            label: t('NiceNodeWebsite'),
            click() {
              shell.openExternal('https://nicenode.xyz');
            },
          },
          {
            label: t('ReportAProblem'),
            async click() {
              const url = await getGithubIssueProblemURL();
              shell.openExternal(url);
            },
          },
          {
            label: t('CopyConfigurationDetailsToClipboard'),
            click() {
              clipboard.writeText(getDebugInfoString());
            },
          },
          {
            label: t('RemoveAllNodesAndData'),
            click() {
              removeAllNodePackages();
            },
          },
          {
            label: t('UninstallPodman'),
            click() {
              uninstallPodman();
            },
          },
          {
            label: t('NuclearUninstall'),
            click() {
              nuclearUninstall();
            },
          },
          {
            label: t('LogMinimumSystemRequirementCheck'),
            click() {
              getFailSystemRequirements();
            },
          },
          {
            label: t('ShowSplashScreenAgain'),
            click() {
              getSetHasSeenSplashscreen(false);
            },
          },
          {
            label: t('Show Alpha Modal'),
            click() {
              getSetHasSeenAlphaModal(false);
            },
          },
          {
            label: t('Check Ports'),
            click() {
              checkNodePortsAndNotify();
            },
          },
          {
            label: t('Update Podman'),
            click() {
              checkForPodmanUpdate();
            },
          },
        ],
      },
    ];

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      templateDefault.push(developerMenu);
    }

    return templateDefault;
  }
}
