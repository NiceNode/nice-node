import { exec, ExecOptions } from 'node:child_process';

import logger from './logger';

const PROCESS_CWD = process.cwd();
export const execAwait = (
  command: string,
  options: { log?: boolean; cwd?: string } = { log: false, cwd: PROCESS_CWD }
): Promise<{ stdout: string; stderr: string }> => {
  if (options.log) {
    logger.info(command);
  }

  // const eO: ExecOptions = {
  //   encoding:
  // cwd
  // }

  return new Promise((resolve, reject) => {
    exec(command, { ...options, encoding: 'utf8' }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
};
