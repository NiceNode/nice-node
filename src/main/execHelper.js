import logger from './logger';

const cp = require('child_process');

export const { exec } = cp;

export const execAwait = (
  command,
  options = { log: false, cwd: process.cwd() }
) => {
  if (options.log) {
    logger.info(command);
  }

  return new Promise((resolve, reject) => {
    const childProcess = cp.exec(
      command,
      { ...options },
      (err, stdout, stderr) => {
        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;
          reject(err);
          return;
        }

        resolve({ stdout, stderr, childProcess });
      }
    );
  });
};
