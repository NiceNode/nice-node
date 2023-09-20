import { promisify } from 'node:util';
import { spawn, SpawnOptions, ChildProcess } from 'node:child_process';
import * as readline from 'node:readline';

import Node from '../common/node';
import logger from './logger';
import { send } from './messenger';
import { killChildProcess } from './processExit';

// const pm2 = require('pm2');
// temp fix until pm2 is removed
const pm2 = {
  connect: () => {},
  describe: () => {},
  start: () => {},
  stop: () => {},
  delete: () => {},
  list: () => {},
  restart: () => {},
  monit: () => {},
};

pm2.connect = promisify(pm2.connect);
pm2.describe = promisify(pm2.describe);

pm2.start = promisify(pm2.start);
pm2.stop = promisify(pm2.stop);
pm2.delete = promisify(pm2.delete);
pm2.list = promisify(pm2.list);
pm2.restart = promisify(pm2.restart);
pm2.monit = promisify(pm2.monit);

export const deleteProcess = async (pmId: number) => {
  // tmp: return pm2.delete(pmId);
  return pmId || pm2.delete();
};
// tmp: export const getProcesses = async (): Promise<ProcessDescription[]> => {
export const getProcesses = async (): Promise<void> => {
  // tmp: return pm2.delete(pmId);
  return pm2.list();
};

export const getProcess = async (
  pmId: number,
  // tmp: ): Promise<ProcessDescription | undefined> => {
): Promise<number | undefined> => {
  const proc = pmId; // tmp: await pm2.describe(pmId);
  return proc;
  // if (proc && proc[0]) {
  //   return proc[0];
  // }
  // return undefined;
};

let sendLogsToUIProc: ChildProcess;
export const stopSendingLogsToUI = () => {
  // logger.info(`pm2.stopSendingLogsToUI`);
  if (sendLogsToUIProc) {
    logger.info(
      'sendLogsToUI process was running for a node. Killing that process.',
    );
    killChildProcess(sendLogsToUIProc);
  }
};

export const sendLogsToUI = (node: Node) => {
  logger.info(`Starting pm2.sendLogsToUI for node ${node.spec.specId}`);

  stopSendingLogsToUI();
  const spawnOptions: SpawnOptions = {
    stdio: [null, 'pipe', 'pipe'],
    detached: false,
    shell: true,
  };
  const watchInput = [''];
  if (
    !Array.isArray(node.runtime.processIds) ||
    node.runtime.processIds.length < 1
  ) {
    logger.info('No logs to send if there is no container.');
    return;
  }
  const processId = node.runtime.processIds[0];
  const childProcess = spawn(
    `pm2 logs --raw ${processId}`,
    watchInput,
    spawnOptions,
  );
  sendLogsToUIProc = childProcess;
  if (!sendLogsToUIProc.stderr) {
    throw new Error('Process stream logs stderr stream is undefined.');
  }
  const rl = readline.createInterface({
    input: sendLogsToUIProc.stderr,
  });

  rl.on('line', (log: string) => {
    logger.info(`pm2 log read for ${node.spec.specId}`);
    try {
      send('nodeLogs', log);
    } catch (err) {
      logger.error(`Error parsing pm2 log ${log}`, err);
    }
  });

  sendLogsToUIProc.on('error', (data) => {
    logger.error(`pm2.sendLogsToUI::error:: `, data);
  });
  sendLogsToUIProc.on('disconnect', () => {
    logger.info(`pm2.sendLogsToUI::disconnect::`);
  });
  // todo: restart?
  sendLogsToUIProc.on('close', (code) => {
    // code == 0, clean exit
    // code == 1, crash
    rl.close();
    logger.info(`pm2.sendLogsToUI::close:: ${code}`);
    if (code !== 0) {
      logger.error(`pm2.sendLogsToUI::close:: with non-zero exit code ${code}`);
      // todo: determine the error and show geth error logs to user.
    }
  });
  sendLogsToUIProc.on('exit', (code, signal) => {
    // code == 0, clean exit
    // code == 1, crash
    logger.info(`pm2.sendLogsToUI::exit:: ${code}, ${signal}`);
    if (code === 1) {
      logger.error('pm2.sendLogsToUI::exit::error::');
    }
  });
};

/**
 * Called on app launch.
 * Check's node processes and updates internal NiceNode records.
 */
export const initialize = async () => {
  logger.info('initialize pm2 connection');
  // try {
  //   const isNoDaemonMode = true;
  //   logger.info(`Starting pm2 in daemon mode? : ${!isNoDaemonMode}`);
  //   const result = await pm2.connect(isNoDaemonMode);
  //   logger.info(
  //     `pm2Manager connected to the pm2 instance result: ${JSON.stringify(
  //       result
  //     )}`
  //   );
  // } catch (err) {
  //   logger.error('initialize pm2Manager error:', err);
  // }
};
export const stopProcess = async (pm_id: number): Promise<number> => {
  return pm_id;
  // const stopResult = await pm2.stop(pm_id);
  // console.log('pm2Manager stopResult: ', stopResult);
  // return stopResult;
};

// todo: already started, running, idk
export const startProccess = async (
  script: string,
  args: string,
  name: string,
): Promise<number> => {
  logger.info(
    `pm2Manager startProccess ${name} with ${script} and args ${args}`,
  );
  return 0;
  // try {
  //   let startResult;
  //   if (isMac()) {
  //     // pm2 seems to ignore args on mac, so include them in the script string
  //     startResult = await pm2.start({
  //       script: `${script}  ${args}`,
  //       name,
  //     });
  //   } else {
  //     startResult = await pm2.start({
  //       script,
  //       args,
  //       name,
  //     });
  //   }
  //   logger.info(`pm2Manager startResult: `);

  //   // todo: pm_id is undefined some times, can be fixed with another start
  //   if (Array.isArray(startResult) && startResult[0]) {
  //     logger.info(
  //       `startProccess binary name and command ${name} and ${script} has pid ${startResult[0].pm_id}`
  //     );

  //     if (startResult[0].pm2_env?.pm_id !== undefined) {
  //       return startResult[0].pm2_env?.pm_id;
  //     }
  //   }
  //   const errorMessage = `Unable to get pid for recently started binary name and command ${name} and ${script}`;
  //   logger.error(errorMessage);
  //   throw new Error(errorMessage);
  // } catch (err: unknown) {
  //   logger.error(err);
  //   throw err;
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

export const onExit = () => {
  // pm2.disconnect();
  // stopSendingLogsToUI();
};
