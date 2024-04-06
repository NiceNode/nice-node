/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createNode,
  createNodePackage,
  UserNodePackages,
  UserNodes,
} from '../../common/node';
import {
  NodePackageSpecification,
  NodeSpecification,
} from '../../common/nodeSpec';
import gethv1 from '../../common/NodeSpecs/geth/geth-v1.0.0.json';
import ethereumv1 from '../../common/NodeSpecs/ethereum/ethereum-v1.0.0.json';
import { NodeLibrary, NodePackageLibrary } from '../../main/state/nodeLibrary';

export const getSystemFreeDiskSpace = (): number => {
  return 2000;
};

export const getSystemDiskSize = (): number => {
  return 3000;
};

export const getStoreValue = (): any => {
  return true;
};

export const getRendererProcessUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

export const getMainProcessUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

export const getDebugInfo = (): any => {
  return { niceNodeVersion: '0.0.0-zeta' };
};

export const checkSystemHardware = (): string[] => {
  return ['Yo internet no bueno'];
};

// Multi-node
export const getNodes = () => {
  return [];
};
export const getUserNodes = (): UserNodes => {
  const node = createNode({
    spec: gethv1 as NodeSpecification,
    runtime: {
      dataDir: 'wherever',
      usage: {
        diskGBs: [],
        memoryBytes: [],
        cpuPercent: [],
        syncedBlock: 0,
      },
    },
  });
  return {
    nodeIds: ['a1'],
    nodes: {
      a1: node,
    },
  };
};
export const getUserNodePackages = (): UserNodePackages => {
  const node = createNodePackage({
    spec: ethereumv1 as NodePackageSpecification,
    runtime: {
      dataDir: 'wherever',
      usage: {
        diskGBs: [],
        memoryBytes: [],
        cpuPercent: [],
        syncedBlock: 0,
      },
    },
  });
  return {
    nodeIds: ['a1'],
    nodes: {
      a1: node,
    },
  };
};
export const addNode = () => {
  const node = createNode({
    spec: gethv1 as NodeSpecification,
    runtime: {
      dataDir: 'wherever',
      usage: {
        diskGBs: [],
        memoryBytes: [],
        cpuPercent: [],
        syncedBlock: 0,
      },
    },
  });
  return node;
};
export const updateNode = () => {
  const node = createNode({
    spec: gethv1 as NodeSpecification,
    runtime: {
      dataDir: 'wherever',
      usage: {
        diskGBs: [],
        memoryBytes: [],
        cpuPercent: [],
        syncedBlock: 0,
      },
    },
  });
  return node;
};
export const removeNode = () => {};
export const removeNodePackage = () => {};
export const startNode = () => {};
export const startNodePackage = () => {};
export const getNodeStartCommand = () => {};
export const stopNode = () => {};
export const stopNodePackage = () => {};
export const updateNodeDataDir = () => {};
export const openDialogForNodeDataDir = () => {};
export const openDialogForStorageLocation = () => {};
export const getNodesDefaultStorageLocation = () => '/user/storage/nodes/';
export const updateNodeLastSyncedBlock = () => {};
export const deleteNodeStorage = () => true;
export const resetNodeConfig = () => {};
export const sendNodeLogs = () => {};
export const stopSendingNodeLogs = () => {};

// Node library
export const getNodeLibrary = (): NodeLibrary => {
  return {
    geth: gethv1 as NodeSpecification,
  };
};
export const getNodePackageLibrary = (): NodePackageLibrary => {
  return {
    ethereum: ethereumv1 as NodePackageSpecification,
  };
};
// Settings/Config
export const getSettings = () => {
  return {
    appThemeSetting: 'auto',
  };
};
export const getAppClientId = () => {
  return 'random-unique-uuidv4';
};
export const getSetHasSeenSplashscreen = () => true;
export const getSetHasSeenAlphaModal = () => true;
export const getIsPodmanInstalled = () => true;
export const getIsPodmanRunning = () => true;

export const getSystemInfo = () => {};
export const runBenchmark = () => {};

export const SENTRY_DSN = 'fake_sentry_dsn';
