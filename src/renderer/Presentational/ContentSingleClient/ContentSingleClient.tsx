// import { useState, useCallback } from 'react';
// import { ClientCard } from '../../Generics/redesign/ClientCard/ClientCard';
// import { WalletPrompt } from '../../Generics/redesign/WalletPrompt/WalletPrompt';
import { useTranslation } from 'react-i18next';
import { MetricData } from 'common/node';
import { NiceNodeRpcTranslation } from 'common/rpcTranslation';
import { LabelValuesSectionItemsProps } from '../../Generics/redesign/LabelValues/LabelValuesSection';
import { NodeBackgroundId } from '../../assets/images/nodeBackgrounds';
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
  displayName: string;
  name: NodeBackgroundId; // lowercase for supported node icons
  version?: string;
  screenType?: string;
  nodeType?: string;
  rpcTranslation?: NiceNodeRpcTranslation;
  info?: string;
  network?: string;
  iconUrl?: string;
  status?: {
    updating?: boolean;
    synchronized?: boolean;
    initialized?: boolean;
    lowPeerCount?: boolean;
    updateAvailable?: boolean;
    blocksBehind?: boolean;
    noConnection?: boolean;
    online?: boolean;
    stopped?: boolean;
    error?: boolean;
  };
  stats?: {
    peers?: number;
    currentBlock?: number;
    highestBlock?: number;
    cpuLoad?: number;
    memoryUsagePercent?: number;
    diskUsageGBs?: number; // in MB?
  };
  tabsData?: {
    memoryPercent: MetricData[];
    cpuPercent: MetricData[];
    diskUsed: MetricData[];
    diskFree: number;
    diskTotal: number;
  };
  onAction?: (action: NodeAction) => void;
  description?: string;
  resources?: LabelValuesSectionItemsProps[];
};

type ContentSingleClientProps = {
  nodeOverview: SingleNodeContent;
  isPodmanRunning: boolean;
};

const ContentSingleClient = ({
  nodeOverview,
  isPodmanRunning,
}: ContentSingleClientProps) => {
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

  // TODO: retrieve initial data for all pages

  const { tabsData, name } = nodeOverview;
  const { t } = useTranslation();

  return (
    <>
      {/* todo: fix temp type casting */}
      <Header
        nodeOverview={nodeOverview as unknown as NodeOverviewProps}
        isPodmanRunning={isPodmanRunning}
      />
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
        <div id={t('CPU')}>
          <TabContent
            name={name}
            tabId="CPU"
            metricData={tabsData?.cpuPercent}
          />
        </div>
        <div id={t('Memory')}>
          <TabContent
            name={name}
            tabId="Memory"
            metricData={tabsData?.memoryPercent}
          />
        </div>
        {/* <div id={t('Network')}>
          <TabContent tabId="Network" />
        </div> */}
        <div id={t('Disk')}>
          <TabContent
            name={name}
            tabId="Disk"
            metricData={tabsData?.diskUsed}
            diskData={{
              diskFree: tabsData?.diskFree || 0,
              diskTotal: tabsData?.diskTotal || 0,
            }}
          />
        </div>
      </Tabs>
    </>
  );
};
export default ContentSingleClient;
