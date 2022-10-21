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
  name: 'nimbus',
  version: 'v10',
  type: 'client',
  nodeType: 'consensus',
  status: {
    synchronized: false,
    lowPeerCount: false,
    updateAvailable: false,
    blocksBehind: false,
    noConnection: false,
    stopped: false,
    error: false,
  },
  stats: {
    peers: 15,
    slot: '4,456,158',
    cpuLoad: 20,
    diskUsage: 600, // in MB?
  },
};

const ContentSingleClient = () => {
  // TODO: Come up with a better name for this component..
  /* TODO: Refactor to support single node & eventual validator view,
    maybe with a "provider" wrapper/manager to fetch data and handle states */

  const onDismissClick = useCallback(() => {
    // setWalletDismissed(true);
    // localStorage.setItem('walletDismissed', 'true');
  }, []);

  // TODO: refactor this out so that it can be shared with multiple, single, and validator?
  const getNodeOverview = () => {
    // useEffect, used only in Header and Metrics

    // TODO: refactor this out to higher level (client data provider)
    const clientTypeLabel =
      client.nodeType === 'consensus' ? 'Consensus Client' : 'Execution Client';

    return {
      ...client,
      title: client.name,
      info: `${clientTypeLabel} -- Ethereum mainnet`,
      status: 'healthy', // change this to enum to compare weights?
    };
  };

  const nodeOverview = getNodeOverview();

  return (
    <div className={container}>
      <Header nodeOverview={nodeOverview} />
      <HorizontalLine type="content" />
      <HeaderMetrics nodeOverview={nodeOverview} />
      <HorizontalLine type="content" />
    </div>
  );
};
export default ContentSingleClient;
