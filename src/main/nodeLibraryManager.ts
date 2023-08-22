import ethereumv1 from '../common/NodeSpecs/ethereum/ethereum-v1.0.0.json';
import basev1 from '../common/NodeSpecs/base/base-v1.0.0.json';

import besuv1 from '../common/NodeSpecs/besu/besu-v1.0.0.json';
import nethermindv1 from '../common/NodeSpecs/nethermind/nethermind-v1.0.0.json';
import gethv1 from '../common/NodeSpecs/geth/geth-v1.0.0.json';

import lodestarv1 from '../common/NodeSpecs/lodestar/lodestar-v1.0.0.json';
import nimbusv1 from '../common/NodeSpecs/nimbus/nimbus-v1.0.0.json';
import tekuv1 from '../common/NodeSpecs/teku/teku-v1.0.0.json';
import lighthousev1 from '../common/NodeSpecs/lighthouse/lighthouse-v1.0.0.json';
import prysmv1 from '../common/NodeSpecs/prysm/prysm-v1.0.0.json';

import arbitrumv1 from '../common/NodeSpecs/arbitrum/arbitrum-v1.0.0.json';
import pathfinderv1 from '../common/NodeSpecs/pathfinder/pathfinder-v1.0.0.json';

import opGethv1 from '../common/NodeSpecs/op-geth/op-geth-v1.0.0.json';
import opNodev1 from '../common/NodeSpecs/op-node/op-node-v1.0.0.json';

import logger from './logger';
import { NodeLibrary, updateNodeLibrary } from './state/nodeLibrary';
import { NodeSpecification } from '../common/nodeSpec';

export const initialize = async () => {
  // parse spec json for latest versions
  // update the store with the latest versions
  const nodeSpecBySpecId: NodeLibrary = {};
  const specs = [
    ethereumv1,
    basev1,
    besuv1,
    nethermindv1,
    gethv1,
    lodestarv1,
    nimbusv1,
    tekuv1,
    lighthousev1,
    prysmv1,
    arbitrumv1,
    pathfinderv1,
    opGethv1,
    opNodev1,
  ];
  specs.forEach((spec) => {
    try {
      nodeSpecBySpecId[spec.specId] = spec as NodeSpecification;
    } catch (err) {
      logger.error(err);
    }
  });
  console.log('nodeSpecBySpecId: ', nodeSpecBySpecId);
  return updateNodeLibrary(nodeSpecBySpecId);
};
