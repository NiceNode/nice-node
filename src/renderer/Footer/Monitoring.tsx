import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';
import { useAppSelector } from '../state/hooks';
import { selectNumFreeDiskGB, selectSelectedNode } from '../state/node';
// import { Checklist } from '../Generics/redesign/Checklist/Checklist';

// todo: remove when new ui/ux redesign is further along
import { darkTheme, lightTheme } from '../Generics/redesign/theme.css';
import { SystemMonitor } from '../Generics/redesign/SystemMonitor/SystemMonitor';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const Monitoring = ({ isOpen, onClickCloseButton }: Props) => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const sFreeDisk = useAppSelector(selectNumFreeDiskGB);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sMonitoringData, setMonitoringData] = useState<any>();
  const [sNodeDiskUsed, setNodeDiskUsed] = useState<number>();
  const [sNodeMemoryUsed, setNodeMemoryUsed] = useState<number>();
  const [sNodeCpuUsed, setNodeCpuUsed] = useState<number>();

  useEffect(() => {
    let diskUsed;
    let memory;
    let cpu;
    if (selectedNode) {
      diskUsed = selectedNode.runtime.usage.diskGBs ?? undefined;
      memory = selectedNode.runtime.usage.memoryBytes ?? undefined;
      cpu = selectedNode.runtime.usage.cpuPercent ?? undefined;
    }
    setNodeDiskUsed(diskUsed);
    setNodeMemoryUsed(memory);
    setNodeCpuUsed(cpu);
  }, [selectedNode]);

  const getMonitoringData = async () => {
    const rendererProcessUsage = await electron.getRendererProcessUsage();
    const mainProcessUsage = await electron.getMainProcessUsage();

    // --- Memory ---
    // let totalMemoryUsed = 0;
    // if (nodeUsage?.memory) {
    //   nodeUsage.memory *= 1e-9;
    //   totalMemoryUsed += nodeUsage.memory;
    // }
    if (rendererProcessUsage?.memory?.residentSet) {
      rendererProcessUsage.memory.residentSet *= 1e-9;
      // totalMemoryUsed += rendererProcessUsage.memory.residentSet;
    }
    if (mainProcessUsage?.memory?.residentSet) {
      mainProcessUsage.memory.residentSet *= 1e-9;
      // totalMemoryUsed += mainProcessUsage.memory.residentSet;
    }
    let uiMemoryUsage;
    // https://thewebdev.info/2022/01/08/how-to-programmatically-get-memory-usage-in-chrome-with-javascript/
    if (typeof window?.performance?.memory?.usedJSHeapSize === 'number') {
      uiMemoryUsage = window.performance.memory.usedJSHeapSize * 1e-9;
      // totalMemoryUsed += uiMemoryUsage;
    }
    if (uiMemoryUsage) {
      uiMemoryUsage = `${uiMemoryUsage.toFixed(3)}GB`;
    }
    // let totalMemoryUsedStr;
    // if (totalMemoryUsed) {
    //   totalMemoryUsedStr = `Total memory used: ${totalMemoryUsed.toFixed(3)}GB`;
    // }

    // --- CPU ---
    // let totalCpuUsed = 0;
    // if (nodeUsage?.cpu) {
    //   totalCpuUsed += nodeUsage.cpu;
    // }
    // if (rendererProcessUsage?.cpu?.percentCPUUsage) {
    //   totalCpuUsed += rendererProcessUsage.cpu.percentCPUUsage;
    // }
    // if (mainProcessUsage?.cpu?.percentCPUUsage) {
    //   totalCpuUsed += rendererProcessUsage.cpu.percentCPUUsage;
    // }
    // let totalCpuUsedStr;
    // if (totalCpuUsed) {
    //   totalCpuUsedStr = `Total cpu used: ${totalCpuUsed.toFixed(
    //     1
    //   )}% of virtual CPU cores`;
    // }
    setMonitoringData({
      // total: {
      //   memory: totalMemoryUsedStr,
      //   cpu: totalCpuUsedStr,
      // },
      // nodeProcess: nodeUsage,
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

  console.log('monitoring lightTheme: ', lightTheme);

  return (
    <MenuDrawer
      title="Monitoring"
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h2>Storage</h2>
        <div>
          {/* <p>Node: {selectedNode && JSON.stringify(selectedNode.runtime)}</p> */}
          {sNodeDiskUsed !== undefined && (
            <h4>Storage used by node: {sNodeDiskUsed.toFixed(1)} GB</h4>
          )}
          {sFreeDisk !== undefined && (
            <h4>Storage available: {sFreeDisk.toFixed(1)} GB</h4>
          )}
        </div>
        <h2>Memory</h2>
        <p>{sMonitoringData?.total?.memory}</p>
        <p>
          {`Memory used by ${selectedNode?.spec.displayName}: `}
          {sNodeMemoryUsed
            ? `${(sNodeMemoryUsed * 1e-9).toFixed(2)} GB`
            : 'N/A'}
        </p>
        <h2>CPU</h2>
        <p>{sMonitoringData?.total?.cpu}</p>
        <p>
          {`CPU used by ${selectedNode?.spec.displayName}: `}
          {sNodeCpuUsed ? `${sNodeCpuUsed}%` : 'N/A'}
        </p>
        <h2>All available metrics</h2>
        <ReactJson
          src={sMonitoringData}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
          style={{ overflow: 'auto', maxHeight: '80%' }}
        />
      </div>
      <hr />
      <div>
        <SystemMonitor />
        {/* <Checklist
          items={[
            {
              status: 'loading',
              checkTitle: 'Processor supported by clients',
            },
            {
              status: 'complete',
              checkTitle: 'At least 4GB of system memory (RAM)',
              valueText: 'System memory: 32GB',
            },
            {
              status: 'incomplete',
              checkTitle: 'Storage disk type is SSD',
              valueText: 'Disk type: Hard Disk Drive (HDD).',
              captionText:
                'While SSD is recommended you are still able to run a node with a HDD if you have 8GB or more of system memory (RAM) available.',
            },
            {
              status: 'error',
              checkTitle: 'Available disk space for fast sync is 500GB or more',
              valueText:
                'Selected disk: Macintosh HD with only 126GB free disk space.',
              captionText:
                ' Additional storage capacity is require to run this node type! Consider adding an external SSD.',
            },
          ]}
          title="Node requirements"
        /> */}
      </div>
    </MenuDrawer>
  );
};
export default Monitoring;
