import moment from 'moment';
import type { NodeSpecification } from '../common/nodeSpec';
import type { NodeLibrary } from '../main/state/nodeLibrary';

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

export const getSyncDataForServiceAndNode = (
  service: any,
  node: any,
  qExecutionIsSyncing: any,
  qConsensusIsSyncing: any,
  qExecutionPeers: any,
  qConsensusPeers: any,
  networkStatus: string | boolean,
) => {
  const isNotConsensusClient = service.serviceId !== 'consensusClient';
  const syncingQuery = isNotConsensusClient
    ? qExecutionIsSyncing
    : qConsensusIsSyncing;
  const peersQuery = isNotConsensusClient ? qExecutionPeers : qConsensusPeers;

  return getSyncData(
    syncingQuery,
    peersQuery,
    networkStatus === 'rejected' || networkStatus === true,
    node.lastRunningTimestampMs,
    node.updateAvailable,
    node.initialSyncFinished,
  );
};

export const getSyncData = (
  qIsSyncing: { isError: any; data: { isSyncing: any } },
  qPeers: { isError: any; data: string },
  offline: boolean,
  lastRunningTimestampMs: moment.MomentInput,
  updateAvailable: any,
  initialSyncFinished: any,
) => {
  const isSyncing = qIsSyncing.isError
    ? undefined
    : qIsSyncing?.data?.isSyncing;

  const peers = qPeers.isError
    ? undefined
    : typeof qPeers.data === 'number'
      ? qPeers.data
      : typeof qPeers.data === 'string'
        ? Number.parseInt(qPeers.data, 10) || 0
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
