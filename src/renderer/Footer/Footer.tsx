import { VscDebugConsole } from 'react-icons/vsc';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { MdSettings } from 'react-icons/md';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import IconButton from '../IconButton';
import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';
import { useAppSelector } from '../state/hooks';
import { selectNumFreeDiskGB, selectNumGethDiskUsedGB } from '../state/node';
import { useGetExecutionNodeInfoQuery } from '../state/services';

const Footer = () => {
  const sGethDiskUsed = useAppSelector(selectNumGethDiskUsedGB);
  const sFreeDisk = useAppSelector(selectNumFreeDiskGB);
  const qNodeInfo = useGetExecutionNodeInfoQuery(null, {
    pollingInterval: 60000,
  });
  const [sSelectedMenuDrawer, setSelectedMenuDrawer] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sLogs, setLogs] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sGethErrorLogs, setGethErrorLogs] = useState<any>();
  const [sGethDeleteResult, setGethDeleteResult] = useState<boolean>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sMonitoringData, setMonitoringData] = useState<any>();

  const getGethLogs = async () => {
    const gethLogs = await electron.getGethLogs();
    setLogs(gethLogs);
  };
  const getGethErrorLogs = async () => {
    const gethLogs = await electron.getGethErrorLogs();
    setGethErrorLogs(gethLogs);
  };

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
    getGethLogs();
    getGethErrorLogs();
    getMonitoringData();
  }, []);

  useEffect(() => {
    if (sSelectedMenuDrawer === 'debugging') {
      getGethLogs();
      getGethErrorLogs();
    } else if (sSelectedMenuDrawer === 'monitoring') {
      getMonitoringData();
    }
  }, [sSelectedMenuDrawer]);

  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <IconButton
        type="button"
        onClick={() => {
          setSelectedMenuDrawer(
            sSelectedMenuDrawer === 'settings' ? undefined : 'settings'
          );
        }}
        style={{
          borderBottom:
            sSelectedMenuDrawer === 'settings' ? '2px solid' : 'none',
          borderTop: sSelectedMenuDrawer === 'settings' ? '2px solid' : 'none',
        }}
      >
        <MdSettings />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => {
          setSelectedMenuDrawer(
            sSelectedMenuDrawer === 'monitoring' ? undefined : 'monitoring'
          );
        }}
        style={{
          borderBottom:
            sSelectedMenuDrawer === 'monitoring' ? '2px solid' : 'none',
          borderTop:
            sSelectedMenuDrawer === 'monitoring' ? '2px solid' : 'none',
        }}
      >
        <AiOutlineAreaChart />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => {
          setSelectedMenuDrawer(
            sSelectedMenuDrawer === 'debugging' ? undefined : 'debugging'
          );
        }}
        style={{
          borderBottom:
            sSelectedMenuDrawer === 'debugging' ? '2px solid' : 'none',
          borderTop: sSelectedMenuDrawer === 'debugging' ? '2px solid' : 'none',
        }}
      >
        <VscDebugConsole />
      </IconButton>
      <MenuDrawer
        title="App and Node Logs"
        isSelected={sSelectedMenuDrawer === 'debugging'}
        onClickCloseButton={() => setSelectedMenuDrawer(undefined)}
      >
        <h4>Geth Info Logs</h4>
        <ReactJson
          style={{ overflow: 'auto', maxHeight: '80%' }}
          src={{ logs: sLogs }}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
          collapsed
        />
        <h4>Geth Error Logs</h4>
        <ReactJson
          style={{ overflow: 'auto', maxHeight: '80%' }}
          src={{ logs: sGethErrorLogs }}
          theme="monokai"
          displayDataTypes={false}
          enableClipboard={false}
          collapsed
        />
      </MenuDrawer>
      <MenuDrawer
        title="Settings"
        isSelected={sSelectedMenuDrawer === 'settings'}
        onClickCloseButton={() => setSelectedMenuDrawer(undefined)}
      >
        <h2>Node</h2>
        {qNodeInfo?.currentData && !qNodeInfo?.isError && (
          <h3>Running: {qNodeInfo.currentData}</h3>
        )}
        <h2>Storage</h2>
        <div>
          <h3>Delete node data</h3>
          <p>
            Your node requires this data to run and will require time and
            internet data to recover if deleted. Only delete node data if you do
            not intend to run a node.
          </p>
          <button
            type="button"
            onClick={async () => {
              console.log('Deleting Geth Data');
              // clear result while waiting for delete to return
              setGethDeleteResult(undefined);
              setGethDeleteResult(await electron.deleteGethDisk());
            }}
            style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
          >
            <span>Delete</span>
          </button>
          {sGethDeleteResult !== undefined && (
            <>
              {sGethDeleteResult ? (
                <span>Delete successful</span>
              ) : (
                <span>Delete failed</span>
              )}
            </>
          )}
        </div>
      </MenuDrawer>
      <MenuDrawer
        title="Monitoring"
        isSelected={sSelectedMenuDrawer === 'monitoring'}
        onClickCloseButton={() => setSelectedMenuDrawer(undefined)}
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
    </div>
  );
};
export default Footer;
