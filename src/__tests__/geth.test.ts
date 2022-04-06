import { opendir } from 'fs/promises';

import { getNNDirPath } from '../main/files';
import { downloadGeth } from '../main/geth';

jest.mock('electron', () => {
  return {
    app: {
      getPath: jest.fn(() => __dirname),
    },
  };
});
jest.setTimeout(60000);
describe('Downloading geth', () => {
  it('Successfully downloads', async () => {
    // spawn child process
    await downloadGeth();

    // expect that a geth.tar.gz or geth.zip file exists in app directory
    const dirPath = getNNDirPath();
    console.log('dirPath: ', dirPath);
    try {
      const dir = await opendir(dirPath);
      let count = 0;
      // eslint-disable-next-line no-restricted-syntax
      for await (const dirent of dir) {
        console.log('NNdir file or dir: ', dirent.name);
        // eslint-disable-next-line no-plusplus
        count++;
      }
      expect(count).toBeGreaterThan(0);
    } catch (err) {
      console.error(err);
    }
    // expect(childProcess.killed).toBe(true);
  });
});
