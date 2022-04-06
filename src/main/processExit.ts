import process from 'process';
import { ChildProcess } from 'child_process';

const childProcesses: ChildProcess[] = [];

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  console.log('Initializing process exit handlers...');
  // get saved settings and make sure app values are up to date
  process.on('SIGINT', () => {
    console.log('SIGINT received!');
    childProcesses.forEach((childProcess) => {
      childProcess.kill();
      // kill doesn't work on some OS (macOS), so send abort signal
    });
  });
  process.on('SIGTERM', () => {
    console.log('SIGTERM received!');
    childProcesses.forEach((childProcess) => {
      childProcess.kill();
      // kill doesn't work on some OS (macOS), so send abort signal
    });
  });
};

export const registerChildProcess = (childProcess: ChildProcess) => {
  childProcesses.push(childProcess);
};
