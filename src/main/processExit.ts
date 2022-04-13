import process from 'process';
import { ChildProcess } from 'child_process';

import logger from './logger';

const childProcesses: ChildProcess[] = [];

export const initialize = () => {
  logger.info('Initializing process exit handlers...');
  process.on('SIGINT', () => {
    logger.info('SIGINT received!');
    childProcesses.forEach((childProcess) => {
      childProcess.kill();
    });
  });
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received!');
    childProcesses.forEach((childProcess) => {
      childProcess.kill();
    });
  });
};

export const registerChildProcess = (childProcess: ChildProcess) => {
  childProcesses.push(childProcess);
};
