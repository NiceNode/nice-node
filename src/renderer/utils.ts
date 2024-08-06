import type { NodeSpecification } from '../common/nodeSpec';
import type { NodeLibrary } from '../main/state/nodeLibrary';
import moment from 'moment';

export const hexToDecimal = (hex: string) => Number.parseInt(hex, 16);

export const safeNumber = (number: number) => {
  if (Number.isNaN(number) || typeof number !== 'number') {
    return 0;
  }
  return number;
};

const EXECUTION_CLIENTS = ['Geth', 'Nethermind', 'Besu'];

export const detectExecutionClient = (
  clientName: string | undefined,
  version: boolean | undefined,
) => {
  if (clientName === undefined) {
    return undefined;
  }
  let formattedClientName = EXECUTION_CLIENTS.find((currEc) => {
    if (clientName.toLowerCase().includes(currEc.toLowerCase())) {
      return currEc;
    }
    return false;
  });
  if (formattedClientName) {
    if (version) {
      // parse version
      const matchedVersion = clientName.match(/v\d+.\d+.\d+/i);
      if (matchedVersion) {
        formattedClientName = `${formattedClientName} ${matchedVersion}`;
      }
    }
    return formattedClientName;
  }
  return clientName;
};

export const bytesToGB = (bytes: number) => {
  return Math.round(bytes * 1e-9);
};

export const bytesToMB = (bytes: number) => {
  return Math.round(bytes * 1e-6);
};

export const categorizeNodeLibrary = (
  nodeLibrary: NodeLibrary,
): {
  ExecutionClient: NodeSpecification[];
  BeaconNode: NodeSpecification[];
  L2: NodeSpecification[];
  Other: NodeSpecification[];
} => {
  const ec: NodeSpecification[] = [];
  const bn: NodeSpecification[] = [];
  const l2: NodeSpecification[] = [];
  const other: NodeSpecification[] = [];

  const catgorized = {
    ExecutionClient: ec,
    BeaconNode: bn,
    L2: l2,
    Other: other,
  };
  Object.keys(nodeLibrary).forEach((specId) => {
    const nodeSpec = nodeLibrary[specId];
    if (nodeSpec.category === 'L1/ExecutionClient') {
      catgorized.ExecutionClient.push(nodeSpec);
    } else if (nodeSpec.category === 'L1/ConsensusClient/BeaconNode') {
      catgorized.BeaconNode.push(nodeSpec);
    } else if (nodeSpec.category?.includes('L2')) {
      catgorized.L2.push(nodeSpec);
    } else {
      catgorized.Other.push(nodeSpec);
    }
  });
  return catgorized;
};

export const getSyncData = (
  qExecutionIsSyncing: { isError: any; data: { isSyncing: any } },
  qExecutionPeers: { isError: any; data: string },
  offline: boolean,
  lastRunningTimestampMs: moment.MomentInput,
  updateAvailable: any,
  initialSyncFinished: any,
) => {
  const isSyncing = qExecutionIsSyncing.isError
    ? undefined
    : qExecutionIsSyncing?.data?.isSyncing;

  const peers = qExecutionPeers.isError
    ? undefined
    : typeof qExecutionPeers.data === 'number'
      ? qExecutionPeers.data
      : typeof qExecutionPeers.data === 'string'
        ? Number.parseInt(qExecutionPeers.data, 10) || 0
        : 0;

  const now = moment();
  const minutesPassedSinceLastRun = now.diff(
    moment(lastRunningTimestampMs),
    'minutes',
  );

  return {
    isSyncing,
    peers,
    updateAvailable,
    minutesPassedSinceLastRun,
    offline,
    initialSyncFinished: initialSyncFinished || false,
  };
};
