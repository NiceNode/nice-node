import { NodeSpecification } from '../common/nodeSpec';
import { NodeLibrary } from '../main/state/nodeLibrary';

export const hexToDecimal = (hex: string) => parseInt(hex, 16);

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
