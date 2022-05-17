import process from 'process';

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
