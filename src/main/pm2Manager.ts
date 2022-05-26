import { promisify } from 'node:util';
import { Proc, ProcessDescription } from 'pm2';

import logger from './logger';

const pm2 = require('pm2');

pm2.connect = promisify(pm2.connect);
pm2.describe = promisify(pm2.describe);

pm2.start = promisify(pm2.start);
pm2.stop = promisify(pm2.stop);
pm2.delete = promisify(pm2.delete);
pm2.list = promisify(pm2.list);
pm2.restart = promisify(pm2.restart);
pm2.monit = promisify(pm2.monit);

//   connect: promisify(pm2.connect),
//   describe: promisify(pm2.describe),
//   start: promisify(pm2.start),
//   stop: promisify(pm2.stop),
//   list: promisify(pm2.list),
//   restart: promisify(pm2.restart),
//   monit: promisify(pm2.monit),

export const deleteProcess = async (pmId: number) => {
  return pm2.delete(pmId);
};
export const getProcesses = async (): Promise<ProcessDescription[]> => {
  return pm2.list();
};

export const getProcess = async (
  pmId: number
): Promise<ProcessDescription | undefined> => {
  const proc = await pm2.describe(pmId);
  if (proc && proc[0]) {
    return proc[0];
  }
  return undefined;
};

/**
 * Called on app launch.
 * Check's node processes and updates internal NiceNode records.
 */
export const initialize = async () => {
  logger.info('initialize pm2 connection');
  try {
    const result = await pm2.connect();
    logger.info('pm2Manager connected to the pm2 instance');
    // const listAllPm2 = await pm2.list();
    // console.log('listAllPm2', listAllPm2);
  } catch (err) {
    logger.error('initialize pm2Manager error:', err);
  }
};
export const stopProcess = async (pm_id: number): Promise<Proc> => {
  const stopResult = await pm2.stop(pm_id);
  console.log('pm2Manager stopResult: ', stopResult);
  // if (Array.isArray(stopResult) && stopResult[0]) {
  return stopResult;
  // }
  // pm2Manager startResult:  [
  //   {
  //     name: 'gethpm2',
  //     namespace: 'default',
  //     pm_id: 4,
  //     status: 'online',
  //     restart_time: 63,
  //     pm2_env: {
  //       name: 'gethpm2',
  //       namespace: 'default',
  //       pm_id: 4,
  //       status: 'online',
  //       restart_time: 63,
  //       env: [Object]
  //     }
  //   }
  // ]

  // {
  //   script:
  //     '/home/johns/.config/Electron/geth-linux-amd64-1.10.17-25c9b49f/geth --http --http.corsdomain nice-node://,http://localhost',
  //   name: 'gethpm2',
  // },
};

// todo: already started, running, idk
export const startProccess = async (
  command: string,
  name: string
): Promise<number> => {
  logger.info(`pm2Manager startProccess ${name} with ${command}`);
  try {
    const startResult = await pm2.start({
      script: command,
      name,
    });
    logger.info(`pm2Manager startResult ${JSON.stringify(startResult)}`);

    if (Array.isArray(startResult) && startResult[0]) {
      logger.info(
        `startProccess binary name and command ${name} and ${command} has pid ${startResult[0].pm_id}`
      );
      if (startResult[0].pm_id !== undefined) {
        return startResult[0].pm_id;
      }
    }
    const errorMessage = `Unable to get pid for recently started binary name and command ${name} and ${command}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  } catch (err: unknown) {
    logger.error(err);
    throw err;
  }

  // pm2Manager startResult:  [
  //   {
  //     name: 'gethpm2',
  //     namespace: 'default',
  //     pm_id: 4,
  //     status: 'online',
  //     restart_time: 63,
  //     pm2_env: {
  //       name: 'gethpm2',
  //       namespace: 'default',
  //       pm_id: 4,
  //       status: 'online',
  //       restart_time: 63,
  //       env: [Object]
  //     }
  //   }
  // ]

  // {
  //   script:
  //     '/home/johns/.config/Electron/geth-linux-amd64-1.10.17-25c9b49f/geth --http --http.corsdomain nice-node://,http://localhost',
  //   name: 'gethpm2',
  // },
};

export const onExit = () => {
  pm2.disconnect();
};

// startProccess(
//   '/home/johns/.config/Electron/geth-linux-amd64-1.10.17-25c9b49f/geth --http --http.corsdomain nice-node://,http://localhost',
//   'gethpm2'
// );
/**
 *
 */

// describe
// {
//   pid: 205056,
//   name: 'gethpm2',
//   pm2_env: {
//     script: 'bash',
//     prev_restart_delay: 0,
//     namespace: 'default',
//     kill_retry_time: 100,
//     windowsHide: true,
//     username: 'johns',
//     treekill: true,
//     automation: true,
//     pmx: true,
//     instance_var: 'NODE_APP_INSTANCE',
//     autorestart: true,
//     vizion: true,
//     merge_logs: true,
//     env: [Object],
//     args: [Array],
//     name: 'gethpm2',
//     node_args: [],
//     pm_exec_path: '/usr/bin/bash',
//     pm_cwd: '/home/johns/dev/nice-node',
//     exec_interpreter: 'none',
//     exec_mode: 'fork_mode',
//     instances: 1,
//     pm_out_log_path: '/home/johns/.pm2/logs/gethpm2-out.log',
//     pm_err_log_path: '/home/johns/.pm2/logs/gethpm2-error.log',
//     pm_pid_path: '/home/johns/.pm2/pids/gethpm2-4.pid',
//     km_link: false,
//     vizion_running: true,
//     NODE_APP_INSTANCE: 0,
//     gethpm2: '{}',
//     PM2_HOME: '/home/johns/.pm2',
//     FORCE_COLOR: '1',
//     GJS_DEBUG_TOPICS: 'JS ERROR;JS LOG',
//     LESSOPEN: '| /usr/bin/lesspipe %s',
//     LANGUAGE: 'en_US:en',
//     USER: 'johns',
//     LC_TIME: 'es_NI.UTF-8',
//     npm_config_user_agent: 'npm/8.5.0 node/v16.14.2 linux x64 workspaces/false',
//     XDG_SESSION_TYPE: 'x11',
//     npm_node_execpath: '/usr/bin/node',
//     SHLVL: '1',
//     npm_config_noproxy: '',
//     HOME: '/home/johns',
//     OLDPWD: '/home/johns',
//     WEBPACK_SERVE: 'true',
//     DESKTOP_SESSION: 'ubuntu',
//     npm_package_json: '/home/johns/dev/nice-node/package.json',
//     GNOME_SHELL_SESSION_MODE: 'ubuntu',
//     GTK_MODULES: 'gail:atk-bridge',
//     LC_MONETARY: 'es_NI.UTF-8',
//     NIX_PROFILES: '/nix/var/nix/profiles/default /home/johns/.nix-profile',
//     npm_config_userconfig: '/home/johns/.npmrc',
//     npm_config_local_prefix: '/home/johns/dev/nice-node',
//     HOT_RELOAD: 'true',
//     SYSTEMD_EXEC_PID: '74169',
//     IM_CONFIG_CHECK_ENV: '1',
//     DBUS_SESSION_BUS_ADDRESS: 'unix:path=/run/user/1000/bus',
//     COLORTERM: 'truecolor',
//     COLOR: '1',
//     npm_config_metrics_registry: 'https://registry.npmjs.org/',
//     IM_CONFIG_PHASE: '1',
//     LOGNAME: 'johns',
//     _: '/usr/bin/npm',
//     npm_config_prefix: '/usr',
//     XDG_SESSION_CLASS: 'user',
//     USERNAME: 'johns',
//     TERM: 'xterm-256color',
//     npm_config_cache: '/home/johns/.npm',
//     GNOME_DESKTOP_SESSION_ID: 'this-is-deprecated',
//     WINDOWPATH: '2',
//     npm_config_node_gyp: '/usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js',
//     PATH: '/home/johns/dev/nice-node/node_modules/.bin:/home/johns/dev/node_modules/.bin:/home/johns/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/usr/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/home/johns/dev/nice-node/node_modules/.bin:/home/johns/dev/node_modules/.bin:/home/johns/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/usr/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/home/johns/dev/nice-node/node_modules/.bin:/home/johns/dev/node_modules/.bin:/home/johns/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/usr/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/home/johns/.nix-profile/bin:/home/johns/platform-tools:/home/johns/.nix-profile/bin:/home/johns/platform-tools:/home/johns/.cargo/bin:/home/johns/.nix-profile/bin:/home/johns/platform-tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin',
//     SESSION_MANAGER: 'local/johns-ROG-Zephyrus-G15-GA503QR-GA503QR:@/tmp/.ICE-unix/74150,unix/johns-ROG-Zephyrus-G15-GA503QR-GA503QR:/tmp/.ICE-unix/74150',
//     PAPERSIZE: 'letter',
//     NODE: '/usr/bin/node',
//     npm_package_name: 'nice-node',
//     TS_NODE_TRANSPILE_ONLY: 'true',
//     XDG_MENU_PREFIX: 'gnome-',
//     LC_ADDRESS: 'es_NI.UTF-8',
//     GNOME_TERMINAL_SCREEN: '/org/gnome/Terminal/screen/a4af814d_2847_4855_8347_a5d8d7d1564d',
//     XDG_RUNTIME_DIR: '/run/user/1000',
//     DISPLAY: ':1',
//     LANG: 'en_US.UTF-8',
//     XDG_CURRENT_DESKTOP: 'Unity',
//     LC_TELEPHONE: 'es_NI.UTF-8',
//     XMODIFIERS: '@im=ibus',
//     XDG_SESSION_DESKTOP: 'ubuntu',
//     XAUTHORITY: '/run/user/1000/gdm/Xauthority',
//     LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.webp=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:',
//     GNOME_TERMINAL_SERVICE: ':1.1025',
//     npm_lifecycle_script: 'cross-env NODE_ENV=development electronmon -r ts-node/register/transpile-only ./src/main/main.ts',
//     SSH_AGENT_LAUNCHER: 'gnome-keyring',
//     SSH_AUTH_SOCK: '/run/user/1000/keyring/ssh',
//     SHELL: '/bin/bash',
//     LC_NAME: 'es_NI.UTF-8',
//     npm_lifecycle_event: 'start:main-hot-reload',
//     QT_ACCESSIBILITY: '1',
//     GDMSESSION: 'ubuntu',
//     LESSCLOSE: '/usr/bin/lesspipe %s %s',
//     NIX_SSL_CERT_FILE: '/etc/ssl/certs/ca-certificates.crt',
//     LC_MEASUREMENT: 'es_NI.UTF-8',
//     GPG_AGENT_INFO: '/run/user/1000/gnupg/S.gpg-agent:0:1',
//     GJS_DEBUG_OUTPUT: 'stderr',
//     LC_IDENTIFICATION: 'es_NI.UTF-8',
//     QT_IM_MODULE: 'ibus',
//     npm_config_globalconfig: '/usr/etc/npmrc',
//     npm_config_init_module: '/home/johns/.npm-init.js',
//     PWD: '/home/johns/dev/nice-node',
//     npm_execpath: '/usr/lib/node_modules/npm/bin/npm-cli.js',
//     XDG_CONFIG_DIRS: '/etc/xdg/xdg-ubuntu:/etc/xdg',
//     XDG_DATA_DIRS: '/usr/share/ubuntu:/usr/local/share/:/usr/share/:/var/lib/snapd/desktop',
//     npm_config_global_prefix: '/usr',
//     LC_NUMERIC: 'es_NI.UTF-8',
//     npm_command: 'run-script',
//     LC_PAPER: 'es_NI.UTF-8',
//     VTE_VERSION: '6402',
//     NODE_ENV: 'development',
//     INIT_CWD: '/home/johns/dev/nice-node',
//     EDITOR: 'vi',
//     ELECTRONMON_LOGLEVEL: 'info',
//     CHROME_DESKTOP: 'Electron.desktop',
//     ORIGINAL_XDG_CURRENT_DESKTOP: 'ubuntu:GNOME',
//     PM2_PROGRAMMATIC: 'true',
//     GDK_BACKEND: 'x11',
//     PM2_JSON_PROCESSING: 'true',
//     unique_id: '4cbce62e-353d-4e97-859a-2e9a83b49051',
//     status: 'online',
//     pm_uptime: 1652725185175,
//     axm_actions: [],
//     axm_monitor: {},
//     axm_options: {},
//     axm_dynamic: {},
//     created_at: 1652725185174,
//     pm_id: 4,
//     restart_time: 60,
//     unstable_restarts: 0,
//     version: 'N/A',
//     versioning: null,
//     exit_code: 1,
//     updateEnv: true
//   },
//   pm_id: 4,
//   monit: { memory: 149061632, cpu: 0.3 }
// }
