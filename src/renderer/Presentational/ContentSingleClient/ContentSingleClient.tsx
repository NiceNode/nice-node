import { useState, useCallback } from 'react';
import { ClientCard } from '../../Generics/redesign/ClientCard/ClientCard';
import { WalletPrompt } from '../../Generics/redesign/WalletPrompt/WalletPrompt';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { HeaderMetrics } from '../../Generics/redesign/HeaderMetrics/HeaderMetrics';
import { Header } from '../../Generics/redesign/Header/Header';
import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import {
  container,
  sectionTitle,
  sectionDescription,
  clientCardsContainer,
  resourcesContainer,
} from './contentSingleClient.css';

// TODO: process retrieved client data into this format?
const client = {
  name: 'geth',
  version: 'v10',
  type: 'client',
  nodeType: 'execution',
  status: {
    updating: false,
    sychronized: true,
    initialized: false,
    lowPeerCount: false,
    updateAvailable: false,
    blocksBehind: true,
    noConnection: false,
    stopped: false,
    error: false,
  },
  stats: {
    peers: 15,
    currentBlock: 1000,
    highestBlock: 2000,
    cpuLoad: 20,
    diskUsage: 600, // in MB?
  },
};

const ContentSingleClient = () => {
  /* TODO: maybe a "provider" wrapper/manager to fetch data and handle states */

  // TODO: refactor this out so that it can be shared with multiple, single, and validator?
  const getNodeOverview = () => {
    // useEffect, used only in Header and Metrics

    const clientTypeLabel =
      client.nodeType === 'consensus' ? 'Consensus Client' : 'Execution Client';

    return {
      ...client,
      info: `${clientTypeLabel} -- Ethereum mainnet`, // should be more flexible for other networks
    };
  };

  const nodeOverview = getNodeOverview();

  // TODO: retrieve initial data for all pages

  return (
    <div className={container}>
      <Header {...nodeOverview} />
      <HorizontalLine type="content" />
      <HeaderMetrics {...nodeOverview} />
      <HorizontalLine type="content" />
    </div>
  );
};
export default ContentSingleClient;
