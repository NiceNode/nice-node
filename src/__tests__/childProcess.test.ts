import { spawn, SpawnOptions } from 'child_process';
import sleep from 'await-sleep';

describe('process testing', () => {
  it('Successfully Kill never ending node process', async () => {
    // spawn child process
    const execCommand = 'node';
    const options: SpawnOptions = {
      cwd: __dirname,
      stdio: 'inherit',
      detached: false,
    };
    console.log('__dirname: ', __dirname);
    const childProcess = spawn(execCommand, ['neverEndingProcess.js'], options);
    try {
      // check that pid exists
      expect(childProcess.pid).toBeGreaterThan(0);
      expect(childProcess.killed).toBe(false);

      // kill process
      childProcess.kill();
      console.log('wait 5 sec to see if process is killed');
      sleep(2000);

      // check that process is killed
      expect(childProcess.exitCode).toBe(null);
      expect(childProcess.killed).toBe(true);
    } finally {
      if (childProcess && !childProcess.killed) {
        childProcess.kill();
      }
    }
  });
});
