import type { ChildProcess } from 'node:child_process';
import process from 'node:process';

import logger from './logger';

type ExitHandler = (signal?: string) => void;
const exitHandlers: ExitHandler[] = [];

export const initialize = () => {
  logger.info('Initializing process exit handlers...');
  process.on('SIGINT', () => {
    logger.info('SIGINT received!');
    exitHandlers.forEach((exitHandler) => {
      exitHandler('SIGINT');
    });
  });
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received!');
    exitHandlers.forEach((exitHandler) => {
      exitHandler('SIGTERM');
    });
  });
};

export const registerExitHandler = (exitHandler: ExitHandler) => {
  exitHandlers.push(exitHandler);
};

/**
 * Kills child process (first with SIGINT, then SIGTERM) and closes any stdio
 * @param childProcess
 */
export const killChildProcess = (childProcess: ChildProcess) => {
  childProcess.kill('SIGINT');
  childProcess.stdin?.destroy();
  childProcess.stdout?.destroy();
  childProcess.stderr?.destroy();
  childProcess.kill('SIGTERM');
};
