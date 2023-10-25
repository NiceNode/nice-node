import path from 'node:path';
import { app } from 'electron';
import { getNNDirPath } from '../../files';
import logger from '../../logger';
import { execAwait } from '../../execHelper';
import { NICENODE_MACHINE_NAME } from '../machine';
import { PODMAN_VERSION } from '../install/install';
import { reportEvent } from '../../events';

/**
 * Uninstall podman from Windows, and remove various configuration files
 */
const uninstallOnWindows = async (): Promise<boolean | { error: string }> => {
  logger.info(`Starting Windows specific podman uninstall steps...`);

  try {
    let stdout;
    let stderr;

    try {
      // may need to run wsl -t podman-nicenode-machine and wsl --unregister podman-nicenode-machine
      const deleteWslPodmanVm = `wsl --unregister podman-${NICENODE_MACHINE_NAME}`;
      ({ stdout, stderr } = await execAwait(deleteWslPodmanVm, {
        log: true,
      }));
      logger.info(`podman uninstall unregister wsl2 vm ${stdout}, ${stderr}`);
    } catch (err) {
      logger.error(`wsl --unregister podman-nicenode-machine error: ${err}`);
    }

    try {
      // Returns C:\Users\<user> (Ex. C:\Users\johns)
      const userHome = app.getPath('home');
      const foldersToDelete = [
        `${userHome}/.local/share/containers/podman`,
        `${userHome}/.config/containers/podman`,
        `${userHome}/.ssh/*podman*`,
        `${userHome}/.ssh/*nicenode*`,
      ];
      foldersToDelete.forEach(async (folderPath) => {
        try {
          const rmCommand = `Remove-Item -Path ${folderPath} -Recurse -Force`;
          ({ stdout, stderr } = await execAwait(rmCommand, {
            log: true,
            shell: 'powershell.exe',
          }));
          logger.info(`podman uninstall rm ${folderPath} ${stdout}, ${stderr}`);
        } catch (errInner) {
          logger.error(`remove podman dirs & files error: ${errInner}`);
        }
      });
    } catch (err) {
      logger.error(`remove podman dirs & files error: ${err}`);
    }

    // This uninstall command is equivalent to the user going to Add & Remove programs UI
    // and clicking Uninstall. The exe uninstall command will prompt the user for permission.
    const podmanExeFilePath = await path.join(
      getNNDirPath(),
      `podman-${PODMAN_VERSION}-setup.exe`,
    );
    // todo: fix logging
    // const logFilePath = path.join(
    //   getNNDirPath(),
    //   'podman-install-log.txt',
    // );
    // eslint-disable-next-line prefer-const
    ({ stdout, stderr } = await execAwait(
      `Start-Process -FilePath '${podmanExeFilePath}' -ArgumentList "/uninstall -Silent -Quiet" -Wait`,
      { log: true, shell: 'powershell.exe' },
    ));
    // todo: report event if fails. Requires podman.exe specific parsing or a clever way to see
    // if the user gave permissions to uninstall
    console.log('podman install stdout, stderr', stdout, stderr);

    return true;
    // eslint-disable-next-line
  } catch (err: any) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to uninstall podman.');
    reportEvent('ErrorUninstallPodman', {
      error: err.toString(),
      podmanVersion: PODMAN_VERSION,
    });
    return { error: `Unable to uninstall podman. ${err}` };
  }
};

export default uninstallOnWindows;
