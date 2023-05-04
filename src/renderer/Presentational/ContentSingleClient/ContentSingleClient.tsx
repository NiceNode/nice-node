// import { useState, useCallback } from 'react';
// import { ClientCard } from '../../Generics/redesign/ClientCard/ClientCard';
// import { WalletPrompt } from '../../Generics/redesign/WalletPrompt/WalletPrompt';
import { MetricStats } from 'renderer/Generics/redesign/MetricTypes/MetricTypes';
import { Tabs } from '../../Generics/redesign/Tabs/Tabs';
import TabContent from '../../Generics/redesign/TabContent/TabContent';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { HeaderMetrics } from '../../Generics/redesign/HeaderMetrics/HeaderMetrics';
import { Header } from '../../Generics/redesign/Header/Header';
// import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import { NodeAction, NodeOverviewProps } from '../../Generics/redesign/consts';

// TODO: process retrieved client data into this format
export type SingleNodeContent = {
  nodeId: string;
  name: string; // lowercase for supported node icons
  version?: string;
  type?: string;
  nodeType?: 'execution' | 'consensus' | string;
  info?: string;
  network?: string;
  iconUrl?: string;
  status?: {
    updating?: boolean;
    sychronized?: boolean;
    initialized?: boolean;
    lowPeerCount?: boolean;
    updateAvailable?: boolean;
    blocksBehind?: boolean;
    noConnection?: boolean;
    stopped?: boolean;
    error?: boolean;
  };
  stats?: {
    peers?: number;
    currentBlock?: number;
    highestBlock?: number;
    cpuLoad?: number;
    diskUsageGBs?: number; // in MB?
  };
  tabsData?: {
    memoryPercent: MetricStats;
    cpuPercent: MetricStats;
  };
  onAction?: (action: NodeAction) => void;
};

const ContentSingleClient = (props: SingleNodeContent) => {
  /* TODO: maybe a "provider" wrapper/manager to fetch data and handle states */

  // TODO: refactor this out so that it can be shared with multiple, single, and validator?
  // const getNodeOverview = () => {
  //   // useEffect, used only in Header and Metrics

  //   const clientTypeLabel =
  //     client.nodeType === 'consensus' ? 'Consensus Client' : 'Execution Client';

  //   return {
  //     ...client,
  //     info: `${clientTypeLabel} -- Ethereum mainnet`, // should be more flexible for other networks
  //   };
  // };

  const nodeOverview = props;

  // TODO: retrieve initial data for all pages

  return (
    <>
      {/* todo: fix temp type casting */}
      <Header {...(nodeOverview as unknown as NodeOverviewProps)} />
      <div>
        <HorizontalLine type="content" />
      </div>
      <HeaderMetrics {...(nodeOverview as unknown as NodeOverviewProps)} />
      <div>
        <HorizontalLine type="above-tab" />
      </div>
      <Tabs>
        {/* <div id="Sync">
          <TabContent tabId="Sync" />
        </div> */}
        <div id="CPU">
          <TabContent
            name={nodeOverview.name}
            tabId="CPU"
            data={nodeOverview.tabsData?.cpuPercent}
          />
        </div>
        <div id="Memory">
          <TabContent
            name={nodeOverview.name}
            tabId="Memory"
            data={nodeOverview.tabsData?.memoryPercent}
          />
        </div>
        {/* <div id="Network">
          <TabContent tabId="Network" />
        </div>
        <div id="Disk">
          <TabContent tabId="Disk" />
        </div> */}
      </Tabs>
    </>
  );
};
export default ContentSingleClient;
