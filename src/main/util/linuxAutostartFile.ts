import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

import { checkAndOrCreateDir, getAssetsFolder } from '../files';
import logger from '../logger';
import { isLinux } from '../platform';

const NN_DESKTOP_FILE_NAME = 'nice-node.desktop';
const NN_DESKTOP_DIR_PATH = path.join(
  app.getPath('home'),
  '.config',
  'autostart',
);
const NN_DESKTOP_FILE_PATH = path.join(
  NN_DESKTOP_DIR_PATH,
  NN_DESKTOP_FILE_NAME,
);
const NN_ICON_PATH = path.join(getAssetsFolder(), 'icon.png');
const NN_STARTUP_DESCRIPTION = 'Enable to start nodes at login';

/**
 *  Linux is not officially supported by Electron. This covers common
 *   linux distros and standards, but not all. Writes a
 *   nice-node.desktop at ~/.config/autostart/
 * @param shouldOpenAtStartup
 */
export const setOpenAtLoginLinux = async (shouldOpenAtStartup: boolean) => {
  logger.info(
    `setOpenAtLoginLinux(shouldOpenAtStartup):  ${shouldOpenAtStartup}`,
  );
  if (!isLinux()) {
    logger.error('setOpenAtLoginLinux called on non-linux os');
    throw new Error(
      'Tried to set linux autostart on login file while not on linux',
    );
  }

  // Write file
  // /assets/icon.png
  const fileContents = [
    '[Desktop Entry]',
    'Type=Application',
    'Exec=nice-node',
    'Hidden=false',
    'NoDisplay=false',
    `X-GNOME-Autostart-enabled=${shouldOpenAtStartup}`,
    'Name[en_US]=NiceNode',
    'Name=NiceNode',
    `Comment[en_US]=${NN_STARTUP_DESCRIPTION}`,
    `Comment=${NN_STARTUP_DESCRIPTION}`,
    `Icon=${NN_ICON_PATH}`,
  ];
  logger.info(`setOpenAtLoginLinux(fileContents):  ${fileContents}`);
  await checkAndOrCreateDir(NN_DESKTOP_DIR_PATH);
  const writeResult = await writeFileSync(
    NN_DESKTOP_FILE_PATH,
    fileContents.join('\n'),
  );
  console.log('writeResult', writeResult);
};
