import React from 'react';
import { MetricMap } from 'common/node';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import {
  container,
  contentHeader,
  contentTitle,
  contentPeriod,
} from './tabContent.css';
import LabelValues from '../LabelValues/LabelValues';
import {
  getBreakdown,
  processMinMaxAverage,
  roundAndFormatPercentage,
} from './utils';
import { Chart } from '../Chart/Chart';

export interface TabContentProps {
  tabId: string;
  data: MetricMap;
  name: string;
}

export interface PeriodBreakdownDataProps {
  sync: {
    maximumBlocksBehind: string;
    minimumBlockTime: string;
    maximumBlockTime: string;
    averageBlockTime: string;
    totalDownTime: string;
  };
  cpu: {
    minimumUsage: string;
    maxUsage: string;
    averageUsage: string;
  };
  memory: {
    minimumUsage: string;
    maxUsage: string;
    averageUsage: string;
  };
  network: {
    dataReceived: string;
    dataSent: string;
    highestPeerCount: string;
    lowestPeerCount: string;
    averagePeerCount: string;
    highestDownloadSpeed: string;
    lowestDownloadSpeed: string;
    averageDownloadSpeed: string;
    highestUploadSpeed: string;
    lowestUploadSpeed: string;
    averageUploadSpeed: string;
  };
  disk: {
    dataWritten: string;
    dataRead: string;
    highestWriteSpeed: string;
    lowestWriteSpeed: string;
    averageWriteSpeed: string;
    highestReadSpeed: string;
    lowestReadSpeed: string;
    averageReadSpeed: string;
  };
}

type SectionLabelProps = {
  [key: string]: string;
};

const contentLabels: SectionLabelProps = {
  Sync: 'Synchronization',
  CPU: 'CPU usage',
  Memory: 'Memory usage',
  Network: 'Network',
  Disk: 'Disk',
};

const TabContent = ({ tabId, data }: TabContentProps) => {
  // switch statement here to determine which charts and sections to show?
  console.log('render for tabId: ', tabId + data);

  const processPeriodBreakdownData = () => {
    if (tabId === 'CPU' || tabId === 'Memory') {
      const results = processMinMaxAverage(data);
      return {
        [tabId.toLowerCase()]: {
          minimumUsage: roundAndFormatPercentage(results.lowest),
          maxUsage: roundAndFormatPercentage(results.highest),
          averageUsage: roundAndFormatPercentage(results.average),
        },
      };
    }
    return null;
  };

  const renderDiskCapacity = () => {
    if (tabId === 'Disk') {
      return (
        <>
          <div className={contentHeader}>
            <div className={contentTitle}>Capacity</div>
          </div>
          <HorizontalLine type="content" />
        </>
      );
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const breakdownData: { title: string; items: any[] } = {
    title: 'Period breakdown',
    items: getBreakdown(tabId.toLowerCase(), processPeriodBreakdownData()),
  };

  return (
    <div className={container}>
      {renderDiskCapacity()}
      <div className={contentHeader}>
        <div className={contentTitle}>{contentLabels[tabId]}</div>
        {/* <div className={contentPeriod}>Dropdown</div> */}
      </div>
      <Chart data={data} tabId={tabId} />
      <HorizontalLine type="content" />
      <div className="breakdown">
        <LabelValues {...breakdownData} />
      </div>
    </div>
  );
};

const areEqual = (prevProps: TabContentProps, nextProps: TabContentProps) => {
  // this prevents unnecessary rerenders
  if (nextProps.name !== prevProps.name) return false; // render when tab is changed
  if (nextProps.data === undefined) return true; // don't render when data doesn't exist for node yet (initial run)
  if (prevProps.data === undefined && nextProps.data !== undefined)
    // render when data is fetched for the node
    return false;
  return prevProps.data.length === nextProps.data.length; // don't render when data length is the same (no new data)
};

export default React.memo(TabContent, areEqual);
