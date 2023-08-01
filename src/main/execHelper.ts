import { exec } from 'node:child_process';

import logger from './logger';
// import iconIcns from '../../assets/icon.icns';

const sudo = require('@vscode/sudo-prompt');

const PROCESS_CWD = process.cwd();
export const execAwait = (
  command: string,
  options: {
    log?: boolean;
    cwd?: string;
    sudo?: boolean;
    env?: any;
    shell?: string;
  } = {
    log: false,
    cwd: PROCESS_CWD,
    sudo: false,
    env: process.env,
  }
): Promise<{ stdout: string; stderr: string }> => {
  if (options.log) {
    logger.info(command);
  }

  if (options.sudo) {
    const sudoPromptOptions = {
      name: 'NiceNode',
      // icns: iconIcns, // (optional)
    };
    return new Promise((resolve, reject) => {
      sudo.exec(
        command,
        { ...sudoPromptOptions },
        (
          err: any,
          stdout: { toString: () => any } | undefined,
          stderr: { toString: () => any } | undefined
        ) => {
          if (err) {
            reject(err);
            return;
          }
          const stoutStr = stdout === undefined ? '' : stdout.toString();
          const stderrStr = stderr === undefined ? '' : stderr.toString();
          resolve({ stdout: stoutStr, stderr: stderrStr });
        }
      );
    });
  }

  logger.info(`execHelp running command with path: ${options?.env?.PATH}`);
  return new Promise((resolve, reject) => {
    exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
};
