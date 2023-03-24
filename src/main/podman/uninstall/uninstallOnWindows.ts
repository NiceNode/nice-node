import { app } from 'electron';
import logger from '../../logger';
import { execAwait } from '../../execHelper';

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
      }));
      logger.info(`podman uninstall rm ${folderPath} ${stdout}, ${stderr}`);
    });

    // This uninstall command is equivalent to the user going to Add & Remove programs UI
    // and clicking Uninstall. Command requires sudo.
    // get the name of the application
    const getPodmanAppName = `Get-WmiObject -Class Win32_Product -Filter "Name LIKE '%Podman%'" | Select-Object -ExpandProperty Name`;
    ({ stdout, stderr } = await execAwait(getPodmanAppName, {
      log: true,
    }));
    const appName = stdout;
    logger.info(`podman uninstall getPodmanAppName ${stdout}, ${stderr}`);

    const uninstallCommand = `(Get-WmiObject -Class Win32_Product -Filter "Name = '${appName}'").Uninstall()`;
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
