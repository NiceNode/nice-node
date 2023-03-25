import { app } from 'electron';
import path from 'node:path';
import { getNNDirPath } from '../../files';
import logger from '../../logger';
import { execAwait } from '../../execHelper';
import { NICENODE_MACHINE_NAME } from '../machine';

const iconv = require('iconv-lite');

/**
 * Uninstall podman from Windows, and remove various configuration files
 * @param version example: 4.4.2 (without a v prefix)
 */
const uninstallOnWindows = async (
  version: string
): Promise<boolean | { error: string }> => {
  logger.info(`Starting podman uninstall of version ${version}...`);

  try {
    let stdout;
    let stderr;

    // may need to run wsl -t podman-nicenode-machine and wsl --unregister podman-nicenode-machine
    const deleteWslPodmanVm = `wsl --unregister podman-${NICENODE_MACHINE_NAME}`;
    ({ stdout, stderr } = await execAwait(deleteWslPodmanVm, {
      log: true,
    }));
    logger.info(`podman uninstall unregister wsl2 vm ${stdout}, ${stderr}`);

    // Returns C:\Users\<user> (Ex. C:\Users\johns)
    const userHome = app.getPath('home');
    const foldersToDelete = [
      `${userHome}/.local/share/containers/podman`,
      `${userHome}/.config/containers/podman`,
      `${userHome}/.ssh/*podman*`,
      `${userHome}/.ssh/*nicenode*`,
    ];
    foldersToDelete.forEach(async (folderPath) => {
      const rmCommand = `Remove-Item -Path ${folderPath} -Recurse -Force`;
      ({ stdout, stderr } = await execAwait(rmCommand, {
        log: true,
        shell: 'powershell.exe',
      }));
      logger.info(`podman uninstall rm ${folderPath} ${stdout}, ${stderr}`);
    });

    // This uninstall command is equivalent to the user going to Add & Remove programs UI
    // and clicking Uninstall. msi uninstall command requires sudo.
    const getPodmanAppIdCommand = `Get-WmiObject -Class Win32_Product -Filter "Name LIKE '%Podman%'" | Select-Object -ExpandProperty IdentifyingNumber`;
    ({ stdout, stderr } = await execAwait(getPodmanAppIdCommand, {
      log: true,
      shell: 'powershell.exe',
    }));
    const podmanAppId = stdout.replace(/(\r\n|\n|\r)/gm, '');
    logger.info(`podman uninstall podmanAppId ${stdout}, ${stderr}`);

    const uninstallCommand = `msiexec /x ${podmanAppId} /qn /lv ${path.join(
      getNNDirPath(),
      'podman-uninstall-log.txt'
    )}`;
    ({ stdout, stderr } = await execAwait(uninstallCommand, {
      log: true,
      sudo: true,
    }));
    logger.info(`podman uninstall app ${stdout}, ${stderr}`);

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    logger.error(err);
    logger.info('Unable to uninstall podman.');
    const errStr = iconv.decode(Buffer.from(err.toString()), 'ucs2');
    return { error: `Unable to uninstall podman. ${errStr}` };
  }
};

export default uninstallOnWindows;
