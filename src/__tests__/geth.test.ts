import { opendir, access, mkdir, rm } from 'fs/promises';
import { constants } from 'fs';

import path from 'path';

// import { gethBuildNameForPlatformAndArch } from '../main/gethDownload';
import { getNNDirPath } from '../main/files';
import { downloadGeth } from '../main/geth';
import { gethBuildNameForPlatformAndArch } from '../main/gethDownload';

jest.mock('electron', () => {
  return {
    app: {
      getPath: jest.fn((pathName: string): string => {
        if (pathName === 'userData') {
          return path.join(__dirname, 'NiceNode');
        }
        if (pathName === 'appData') {
          return __dirname;
        }
        return __dirname;
      }),
    },
  };
});

const mockAppDir = path.join(__dirname, 'NiceNode');
beforeAll(async () => {
  try {
    await mkdir(mockAppDir);
  } catch (err) {
    console.log('mkdir NiceNode err: ', err);
  }
});

afterAll(async () => {
  try {
    await rm(mockAppDir, { recursive: true });
  } catch (err) {
    console.log('rm NiceNode err: ', err);
  }
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
        count += 1;
      }
      expect(count).toBeGreaterThan(0);

      // returns undefined on success
      const accessResZip = await access(
        path.join(dirPath, 'geth.tar.gz'),
        constants.F_OK
      );
      expect(accessResZip).toBeUndefined();

      // test unzip successful
      const unzippedGethDir = path.join(
        dirPath,
        gethBuildNameForPlatformAndArch()
      );
      const accessResUnzipped = await access(unzippedGethDir, constants.F_OK);
      expect(accessResUnzipped).toBeUndefined();
    } catch (err) {
      console.error(err);
    }
  });
});
