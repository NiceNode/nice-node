import { Menu, Tray, nativeImage } from 'electron';
import logger from './logger';
import { fullQuit } from './main';

let tray;

export const initialize = (getAssetPath: (...paths: string[]) => string) => {
  logger.info('tray initializing...');
  const icon = nativeImage.createFromPath(
    getAssetPath('icons', 'trayIconTemplate.png'),
  );
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    // { label: 'Item1', type: 'radio' },
    // { label: 'Item3', type: 'radio', checked: true },
    // {
    //   label: 'Show App',
    //   click: () => {
    //     createWindow();
    //   },
    // },
    {
      label: 'Full Quit',
      click: () => {
        fullQuit(); // app no longer runs in the background
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  logger.info('tray initialized');
};
