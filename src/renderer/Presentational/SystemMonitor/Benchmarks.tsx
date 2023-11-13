import { useEffect, useState } from 'react';

import electron from '../../electronGlobal';
import { LabelValuesSectionProps } from '../../Generics/redesign/LabelValues/LabelValuesSection';
import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import { Benchmark } from '../../../main/state/benchmark';
import Button from '../../Generics/redesign/Button/Button';
import { LoadingIcon } from '../../Generics/redesign/Icon/LoadingIcon';

/**
 * Primary UI component for user interaction
 */
export const Benchmarks = () => {
  // interface StaticData {
  //   version: string;
  //   system: SystemData;
  //   bios: BiosData;
  //   baseboard: BaseboardData;
  //   chassis: ChassisData;
  //   os: OsData;
  //   uuid: UuidData;
  //   versions: VersionData;
  //   cpu: CpuData;
  //   graphics: GraphicsData;
  //   net: NetworkInterfacesData[];
  //   memLayout: MemLayoutData[];
  //   diskLayout: DiskLayoutData[];
  // }
  const [sBenchmarks, setBenchmarks] = useState<Benchmark[]>();
  const [sParsedData, setParsedData] = useState<LabelValuesSectionProps[]>([]);
  const [sIsRunningBenchmark, setIsRunningBenchmark] = useState<boolean>();

  const getData = async () => {
    setBenchmarks(await electron.getBenchmarks());
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // when new system data arrives
    if (sBenchmarks) {
      console.log('benchmarks all: ', sBenchmarks);
      const newParsedData: LabelValuesSectionProps[] = [];
      //   Example output:
      //   * {
      //      "cpu":{
      //        "cores":8
      //      },
      //      "memory":{
      //        "total":16,
      //        "available":15
      //      },
      //      "storage":{
      //        "iops":{
      //          "read":{
      //            "average":27394
      //          },
      //          "write":{
      //            "average":9155
      //          }
      //        },
      //        "size":{
      //          "total":1610,
      //          "available":1594
      //        }
      //      },
      //      "internet":{
      //        "download":277,
      //        "upload":18,
      //        "latency":38.261,
      //        "resultsUrl":"https://www.speedtest.net/result/c/0b342659-346a-424c-a287-217b9e798340"
      //      },
      //      "time":{
      //        "localTime":1699323649,
      //        "serverTime":1699323649
      //      }
      //    }
      //  */
      if (Array.isArray(sBenchmarks) && sBenchmarks.length > 0) {
        const benchmark: Benchmark = sBenchmarks[0];
        const results = benchmark.results;
        const items = [];
        if (results?.storage) {
          if (results?.storage?.iops?.read?.average !== undefined) {
            items.push({
              label: 'Disk Read IOPS (average)',
              value: `${results.storage.iops.read.average.toLocaleString()} IOPS`,
            });
          }
          if (results?.storage?.iops?.write?.average !== undefined) {
            items.push({
              label: 'Disk Write IOPS (average)',
              value: `${results.storage.iops.write.average.toLocaleString()} IOPS`,
            });
          }
        }
        if (results?.internet) {
          if (results?.internet?.download !== undefined) {
            items.push({
              label: 'Internet Download Speed',
              value: `${benchmark.results.internet.download} Mbps`,
            });
          }
          if (results?.internet?.upload !== undefined) {
            items.push({
              label: 'Internet Upload Speed',
              value: `${benchmark.results.internet.upload} Mbps`,
            });
          }
          if (results?.internet?.latency !== undefined) {
            items.push({
              label: 'Internet Latency',
              value: `${benchmark.results.internet.latency} ms`,
            });
          }
          if (
            results?.time !== undefined &&
            results.time.serverTime &&
            results.time.localTime
          ) {
            items.push({
              label: 'System Time Inaccuracy',
              value: `${
                results.time.serverTime - results.time.localTime
              } seconds`,
            });
          }
        }
        const newItem: LabelValuesSectionProps = {
          sectionTitle: `${new Date(sBenchmarks[0].timestamp)}`,
          items,
        };
        newParsedData.push(newItem);
      }
      setParsedData(newParsedData);
    }
  }, [sBenchmarks]);

  useEffect(() => {
    // on load, refresh the static data
    getData();
  }, []);

  const onClickRunBenchmark = async () => {
    setIsRunningBenchmark(true);
    await electron.runBenchmark();
    getData();
    setIsRunningBenchmark(false);
  };

  if (!sBenchmarks) {
    return <div>Fetching benchmarks...</div>; // Get design spec for this case
  }
  return (
    <>
      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {sIsRunningBenchmark && <LoadingIcon />}
        <Button
          label="Run a benchmark"
          variant="icon-left"
          iconId="speedometer"
          size="small"
          type="secondary"
          onClick={onClickRunBenchmark}
          disabled={sIsRunningBenchmark}
        />
      </div>
      {sParsedData?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <LabelValues title="Latest benchmark" items={sParsedData} />
        </div>
      )}
    </>
  );
};
