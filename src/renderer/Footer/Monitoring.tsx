import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';
import { useAppSelector } from '../state/hooks';
import { selectNumFreeDiskGB, selectNumGethDiskUsedGB } from '../state/node';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const Monitoring = ({ isOpen, onClickCloseButton }: Props) => {
  const sGethDiskUsed = useAppSelector(selectNumGethDiskUsedGB);
  const sFreeDisk = useAppSelector(selectNumFreeDiskGB);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sMonitoringData, setMonitoringData] = useState<any>();

  const getMonitoringData = async () => {
    const rendererProcessUsage = await electron.getRendererProcessUsage();
    const mainProcessUsage = await electron.getMainProcessUsage();
    const nodeUsage = await electron.getNodeUsage();

    // --- Memory ---
    let totalMemoryUsed = 0;
    if (nodeUsage?.memory) {
      nodeUsage.memory *= 1e-9;
      totalMemoryUsed += nodeUsage.memory;
    }
    if (rendererProcessUsage?.memory?.residentSet) {
      rendererProcessUsage.memory.residentSet *= 1e-9;
      totalMemoryUsed += rendererProcessUsage.memory.residentSet;
    }
    if (mainProcessUsage?.memory?.residentSet) {
      mainProcessUsage.memory.residentSet *= 1e-9;
      totalMemoryUsed += mainProcessUsage.memory.residentSet;
    }
    let uiMemoryUsage;
    // https://thewebdev.info/2022/01/08/how-to-programmatically-get-memory-usage-in-chrome-with-javascript/
    if (typeof window?.performance?.memory?.usedJSHeapSize === 'number') {
      uiMemoryUsage = window.performance.memory.usedJSHeapSize * 1e-9;
      totalMemoryUsed += uiMemoryUsage;
    }
    if (uiMemoryUsage) {
      uiMemoryUsage = `${uiMemoryUsage.toFixed(3)}GB`;
    }
    let totalMemoryUsedStr;
    if (totalMemoryUsed) {
      totalMemoryUsedStr = `Total memory used: ${totalMemoryUsed.toFixed(3)}GB`;
    }

    // --- CPU ---
    let totalCpuUsed = 0;
    if (nodeUsage?.cpu) {
      totalCpuUsed += nodeUsage.cpu;
    }
    if (rendererProcessUsage?.cpu?.percentCPUUsage) {
      totalCpuUsed += rendererProcessUsage.cpu.percentCPUUsage;
    }
    if (mainProcessUsage?.cpu?.percentCPUUsage) {
      totalCpuUsed += rendererProcessUsage.cpu.percentCPUUsage;
    }
    let totalCpuUsedStr;
    if (totalCpuUsed) {
      totalCpuUsedStr = `Total cpu used: ${totalCpuUsed.toFixed(
        1
      )}% of virtual CPU cores`;
    }
    setMonitoringData({
      total: {
        memory: totalMemoryUsedStr,
        cpu: totalCpuUsedStr,
      },
      nodeProcess: nodeUsage,
      uiMemoryUsage,
      rendererProcess: rendererProcessUsage,
      mainProcess: mainProcessUsage,
    });
  };

  useEffect(() => {
    getMonitoringData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      getMonitoringData();
    }
  }, [isOpen]);

  return (
    <MenuDrawer
      title="Monitoring"
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h2>Storage</h2>
        <div>
          {sGethDiskUsed !== undefined && (
            <h4>Storage used by node: {sGethDiskUsed.toFixed(1)} GB</h4>
          )}
          {sFreeDisk !== undefined && (
            <h4>Storage available: {sFreeDisk.toFixed(1)} GB</h4>
          )}
        </div>
        <h2>Memory</h2>
        {sMonitoringData?.total?.memory}
        <h2>CPU</h2>
        {sMonitoringData?.total?.cpu}
        <h2>All available metrics</h2>
        <ReactJson
          src={sMonitoringData}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
          style={{ overflow: 'auto', maxHeight: '80%' }}
        />
      </div>
    </MenuDrawer>
  );
};
export default Monitoring;
