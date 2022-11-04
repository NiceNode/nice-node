import { createNode, UserNodes } from '../../common/node';
import { NodeSpecification } from '../../common/nodeSpec';
import gethv1 from '../../common/NodeSpecs/geth/geth-v1.0.0.json';
import { NodeLibrary } from '../../main/state/nodeLibrary';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getSystemFreeDiskSpace = (): number => {
  return 2000;
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
    runtime: { dataDir: 'wherever', usage: {} },
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
    runtime: { dataDir: 'wherever', usage: {} },
  });
  return node;
};
export const updateNode = () => {
  const node = createNode({
    spec: gethv1 as NodeSpecification,
    runtime: { dataDir: 'wherever', usage: {} },
  });
  return node;
};
export const removeNode = () => {};
export const startNode = () => {};
export const stopNode = () => {};
export const openDialogForNodeDataDir = () => {};
export const openDialogForStorageLocation = () => {};
export const getNodesDefaultStorageLocation = () => '/user/storage/nodes/';
export const updateNodeUsedDiskSpace = () => {};
export const deleteNodeStorage = () => true;
export const sendNodeLogs = () => {};
export const stopSendingNodeLogs = () => {};

// Node library
export const getNodeLibrary = (): NodeLibrary => {
  return {
    geth: gethv1 as NodeSpecification,
  };
};

// Settings/Config
export const getSetHasSeenSplashscreen = () => true;
export const getIsDockerInstalled = () => true;
export const getIsDockerRunning = () => true;

export const getSystemInfo = () => {};

export const SENTRY_DSN = 'fake_sentry_dsn';
