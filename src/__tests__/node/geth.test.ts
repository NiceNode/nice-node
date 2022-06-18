import { opendir, rm, mkdir } from 'fs/promises';
import path from 'path';
import sleep from 'await-sleep';

import {
  removeBinaryNode,
  startBinary,
  stopBinary,
  onExit,
} from '../../main/binary';
import gethv1 from '../../common/NodeSpecs/geth/geth-v1.0.0.json';
import Node, { createNode, NodeStatus } from '../../common/node';
import { NodeSpecification } from '../../common/nodeSpec';

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
      setAppLogsPath: jest.fn((pathName: string): string => {
        return pathName;
      }),
    },
  };
});

const mockAppDir = path.join(__dirname, 'NiceNode');
const gethDir = path.join(mockAppDir, 'nodes', 'geth');
let gethNode: Node;
beforeAll(async () => {
  try {
    await mkdir(gethDir, { recursive: true });
    gethNode = createNode({
      spec: gethv1 as NodeSpecification,
      runtime: { dataDir: gethDir, usage: {} },
    });
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

jest.setTimeout(120000);
describe('Tests the core cycle of a geth binary node (download, unzip, start, stop)', () => {
  it('Successfully downloads', async () => {
    expect(gethNode.status).toBe(NodeStatus.created);

    // download & unzip (if necessary), and start the node
    await startBinary(gethNode);

    // in nodes/geth...
    // expect a geth-<build-platform>.compressedFormat
    // expect a geth-<build-platform> dir with geth exec
    // expect some geth data (given that geth has been running for a few seconds)
    const dirPath = gethDir;
    console.log('dirPath: ', dirPath);
    try {
      const dir = await opendir(dirPath);
      let count = 0;
      let isCompressedGethDownload = false;
      let isGethUnzipped = false;
      // eslint-disable-next-line no-restricted-syntax
      for await (const dirent of dir) {
        console.log('NNdir file or dir: ', dirent.name);
        if (dirent.name.includes('tar.gz') || dirent.name.includes('zip')) {
          isCompressedGethDownload = true;
        }
        if (dirent.name.includes('geth-') && dirent.name.includes('1.')) {
          isGethUnzipped = true;
        }
        count += 1;
      }
      expect(count).toBeGreaterThan(0);
      expect(isCompressedGethDownload).toBeTruthy();
      expect(isGethUnzipped).toBeTruthy();

      expect(gethNode.status).toBe(NodeStatus.running);
      expect(gethNode.runtime.processIds?.length).toBeGreaterThan(0);

      await stopBinary(gethNode);
      await removeBinaryNode(gethNode);
      await sleep(2000);

      expect(gethNode.status).toBe(NodeStatus.stopped);

      // cleanup binary.ts adjacent services
      onExit();
    } catch (err) {
      console.error(err);
    }
  });
});
