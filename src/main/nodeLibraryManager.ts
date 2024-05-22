import arbitrumv1 from '../common/NodeSpecs/arbitrum/arbitrum-v1.0.0.json';
import basev1 from '../common/NodeSpecs/base/base-v1.0.0.json';
// Node Packages
import ethereumv1 from '../common/NodeSpecs/ethereum/ethereum-v1.0.0.json';
import farcasterv1 from '../common/NodeSpecs/farcaster/farcaster-v1.0.0.json';
import homeAssistantv1 from '../common/NodeSpecs/home-assistant/home-assistant-v1.0.0.json';
import minecraftv1 from '../common/NodeSpecs/minecraft/minecraft-v1.0.0.json';
import optimismv1 from '../common/NodeSpecs/optimism/optimism-v1.0.0.json';

// Node Services
import besuv1 from '../common/NodeSpecs/besu/besu-v1.0.0.json';
import erigonv1 from '../common/NodeSpecs/erigon/erigon-v1.0.0.json';
import gethv1 from '../common/NodeSpecs/geth/geth-v1.0.0.json';
import nethermindv1 from '../common/NodeSpecs/nethermind/nethermind-v1.0.0.json';
import rethv1 from '../common/NodeSpecs/reth/reth-v1.0.0.json';

import lighthousev1 from '../common/NodeSpecs/lighthouse/lighthouse-v1.0.0.json';
import lodestarv1 from '../common/NodeSpecs/lodestar/lodestar-v1.0.0.json';
import nimbusv1 from '../common/NodeSpecs/nimbus/nimbus-v1.0.0.json';
import prysmv1 from '../common/NodeSpecs/prysm/prysm-v1.0.0.json';
import tekuv1 from '../common/NodeSpecs/teku/teku-v1.0.0.json';

import pathfinderv1 from '../common/NodeSpecs/pathfinder/pathfinder-v1.0.0.json';

import hildrv1 from '../common/NodeSpecs/hildr/hildr-v1.0.0.json';
import magiv1 from '../common/NodeSpecs/magi/magi-v1.0.0.json';
import opGethv1 from '../common/NodeSpecs/op-geth/op-geth-v1.0.0.json';
import opNodev1 from '../common/NodeSpecs/op-node/op-node-v1.0.0.json';

import hubblev1 from '../common/NodeSpecs/hubble/hubble-v1.0.0.json';

import nitrov1 from '../common/NodeSpecs/nitro/nitro-v1.0.0.json';

import homeAssistantServicev1 from '../common/NodeSpecs/home-assistant-service/home-assistant-service-v1.0.0.json';
import itzgMinecraftv1 from '../common/NodeSpecs/itzg-minecraft/itzg-minecraft-v1.0.0.json';

import type {
  NodePackageSpecification,
  NodeSpecification,
  DockerExecution as PodmanExecution,
} from '../common/nodeSpec';
import logger from './logger';
import {
  type NodeLibrary,
  type NodePackageLibrary,
  updateNodeLibrary,
  updateNodePackageLibrary,
} from './state/nodeLibrary';

export const initialize = async () => {
  // parse spec json for latest versions
  // update the store with the latest versions
  const nodeSpecBySpecId: NodeLibrary = {};
  const specs = [
    besuv1,
    nethermindv1,
    erigonv1,
    gethv1,
    rethv1,
    lodestarv1,
    nimbusv1,
    tekuv1,
    lighthousev1,
    prysmv1,
    arbitrumv1,
    nitrov1,
    pathfinderv1,
    opGethv1,
    opNodev1,
    hildrv1,
    magiv1,
    hubblev1,
    itzgMinecraftv1,
    homeAssistantServicev1,
  ];

  specs.forEach((spec) => {
    try {
      const nodeSpec: NodeSpecification = spec as NodeSpecification;
      if (nodeSpec.configTranslation === undefined) {
        nodeSpec.configTranslation = {};
      }

      // 'inject' serviceVersion and dataDir (todo) here. Universal for all nodes.
      const execution = nodeSpec.execution as PodmanExecution;
      let defaultImageTag = 'latest';
      // if the defaultImageTag is set in the spec use that, otherwise 'latest'
      if (execution.defaultImageTag !== undefined) {
        defaultImageTag = execution.defaultImageTag;
      }

      nodeSpec.configTranslation.cliInput = {
        displayName: `${spec.displayName} CLI Input`,
        uiControl: {
          type: 'text',
        },
        defaultValue: ',
        addNodeFlow: 'advanced',
        infoDescription:
          'Enter any direct CLI input to the node start command.',
      };

      nodeSpec.configTranslation.serviceVersion = {
        displayName: `${spec.displayName} version`,
        uiControl: {
          type: 'text',
        },
        defaultValue: defaultImageTag,
        addNodeFlow: 'advanced',
        infoDescription:
          'Caution Advised! Example value: latest, v1.0.0, stable. Consult service documentation for available versions.',
      };

      nodeSpecBySpecId[spec.specId] = nodeSpec;
    } catch (err) {
      logger.error(err);
    }
  });
  // console.log('nodeSpecBySpecId: ', nodeSpecBySpecId);
  updateNodeLibrary(nodeSpecBySpecId);

  const nodePackageSpecBySpecId: NodePackageLibrary = {};
  const packageSpecs = [
    ethereumv1,
    farcasterv1,
    arbitrumv1,
    optimismv1,
    basev1,
    minecraftv1,
    homeAssistantv1,
  ];
  packageSpecs.forEach((spec) => {
    try {
      nodePackageSpecBySpecId[spec.specId] = spec as NodePackageSpecification;
    } catch (err) {
      logger.error(err);
    }
  });
  // console.log('nodePackageSpecBySpecId: ', nodePackageSpecBySpecId);

  return updateNodePackageLibrary(nodePackageSpecBySpecId);
};
