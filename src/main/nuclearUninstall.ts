import { removeAllNodes } from './nodeManager';
import uninstallPodman from './podman/uninstall/uninstall';

/**
 * Uninstalls and deletes dependencies, removes all nodes and delets their data.
 * The only thing it keeps are NiceNode app settings.
 * Technicals:
 * podman machine rm nicenode-machine
 * remove files at podman path
 * remove all nodes
 * delete nodes directory
 * todo: (linux) remove source from package thingy?
 * todo: (windows) unregister fedora wsl2 distro?
 */
const nuclearUninstall = async () => {
  // remove all nodes
  await removeAllNodes();
  // todo: delete nodes dir or other NN data (preferences?)
  await uninstallPodman();
};

export default nuclearUninstall;
