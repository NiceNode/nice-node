import { exec } from 'node:child_process';

import logger from './logger';

const PROCESS_CWD = process.cwd();
export const execAwait = (
  command: string,
  options: { log?: boolean; cwd?: string } = { log: false, cwd: PROCESS_CWD }
): Promise<{ stdout: string; stderr: string }> => {
  if (options.log) {
    logger.info(command);
  }

  return new Promise((resolve, reject) => {
    const childProcess = exec(
      command,
      { ...options },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({ stdout, stderr });
      }
    );
  });
};
