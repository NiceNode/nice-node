import { arch, platform } from 'node:process';
import { app } from "electron";
import type { AppUpdaterEvents } from './main';
import { downloadFile } from '../downloadFile';
import { getNNDirPath } from '../files';
import { spawnSync } from 'node:child_process';
import { setFullQuitForNextQuit } from '../main';
import logger from '../logger';
import path from 'node:path';

const repo = 'NiceNode/test-nice-node-updater';
// const repo = 'NiceNode/nice-node';

let latestDownloadFilePath = '';
export const getLatestVersion = async () => {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
  const data = await res.json();
  // remove prefix 'v' from tag_name
  return data.tag_name.replace(/^v/, '');
}

export const checkForUpdates = async (emit: (e: any, args?: any) => void) => {
  // if latest version is greater than current version
  // download
  emit('checking-for-update');
  const currentVersion = app.getVersion();
  logger.info(`currentVersion: ${currentVersion}`);
  const latestVersion = await getLatestVersion();
  logger.info(`latestVersion: ${latestVersion}`);

  // if no github releases, return error
  if(latestVersion === undefined) {
    emit('error', new Error('No github releases found'));
    return
  }
  // if versions equal, return no update
  if(currentVersion === latestVersion) {
    emit('update-not-available');
    return;
  }
  if(currentVersion < latestVersion) {
    emit('update-available');
    // download
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    const data = await res.json();

    // loop over data.assets, check asset.name and parse out the ones we want to show in the UI.
    // get asset.browser_download_url
    logger.info("Github releases api data: ", data);
    let downloadUrl = '';
    let fileName = '';
    const arch = process.arch === 'x64' ? 'amd64' : 'arm64';
    const releaseNotes = data.body;
    const releaseDate = data.published_at;
    for(const val of data.assets) {
      if(val.name.endsWith(`${arch}.deb`)) {
        downloadUrl = val.browser_download_url;
        logger.info(`val.url: ${val.url}`);
        fileName = val.name;
        logger.info(`val.name: ${val.name}`);
        break;
      }
    };

    if(! downloadUrl || !fileName) {
      emit('error', new Error('No github release found matching this architecture'));
      return;
    }

    latestDownloadFilePath = await downloadFile(downloadUrl, getNNDirPath());
    //latestDownloadFilePath = path.join(latestDownloadFilePath, fileName);
    logger.info(`latestDownloadFilePath: ${latestDownloadFilePath}`);
    emit('update-downloaded', [{}, releaseNotes, fileName, releaseDate, downloadUrl]);
  // install downloaded and quit
  // {
  //   url: 'https://api.github.com/repos/NiceNode/test-nice-node-updater/releases/assets/162903620',
  //   id: 162903620,
  //   node_id: 'RA_kwDOLvIOVs4JtbZE',
  //   name: 'NiceNode-linux-arm64-5.4.1-alpha.zip',
  //   label: '',
  //   uploader: [Object],
  //   content_type: 'application/zip',
  //   state: 'uploaded',
  //   size: 136035837,
  //   download_count: 0,
  //   created_at: '2024-04-18T17:12:26Z',
  //   updated_at: '2024-04-18T17:12:29Z',
  //   browser_download_url: 'https://github.com/NiceNode/test-nice-node-updater/releases/download/v5.4.1-alpha/NiceNode-linux-arm64-5.4.1-alpha.zip'
  // },
    return;
  }

}
const wrapSudo = () => {
  const installComment = `"${app.name} would like to update"`
  const sudo = spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu")
  const command = [sudo]
  if (/kdesudo/i.test(sudo)) {
    command.push("--comment", installComment)
    command.push("-c")
  } else if (/gksudo/i.test(sudo)) {
    command.push("--message", installComment)
  } else if (/pkexec/i.test(sudo)) {
    command.push("--disable-internal-agent")
  }
  return command.join(" ")
}

const spawnSyncLog = (cmd: string, args: string[] = [], env = {}): string =>  {
  logger.info(`Executing: ${cmd} with args: ${args}`)
  const response = spawnSync(cmd, args, {
    env: { ...process.env, ...env },
    encoding: "utf-8",
    shell: true,
  })
  return response.stdout.trim()
}

export const quitAndInstall = () => {
  logger.info('quitAndInstall called')
  // add quit handler, call quit, install in quitHandler

  // sudo dpkg -i /latestDownloadFilePath
  const sudo = wrapSudo();
  logger.info(`sudo cmd  ${sudo}`);
  const wrapper = /pkexec/i.test(sudo) ? "" : `"`
  const cmd = ["dpkg", "-i", latestDownloadFilePath, "||", "apt-get", "install", "-f", "-y"]
  logger.info(`quitAndInstall cmd: ${cmd.join(" ")}`);
  spawnSyncLog(sudo, [`${wrapper}/bin/bash`, "-c", `'${cmd.join(" ")}'${wrapper}`])
  //if (options.isForceRunAfter) {
  logger.info('quitAndInstall install done. relaunching ');
  setFullQuitForNextQuit(true);
  app.relaunch();
  app.quit();
  //}
  // app.restart();
}


console.log("CACHE DIR (sessionData): ", app.getPath("sessionData"));
console.log("TEMP DIR: ", app.getPath("temp"));
