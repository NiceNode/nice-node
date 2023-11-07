import { useEffect, useState } from 'react';
import si from 'systeminformation';

import electron from '../../../electronGlobal';
import { LabelValuesSectionProps } from '../LabelValues/LabelValuesSection';
import LabelValues from '../LabelValues/LabelValues';

/**
 * Primary UI component for user interaction
 */
export const SystemMonitor = () => {
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
  const [sData, setData] = useState<si.Systeminformation.StaticData>();
  const [sParsedData, setParsedData] = useState<LabelValuesSectionProps[]>([]);

  const getData = async () => {
    setData(await electron.getSystemInfo());
  };

  useEffect(() => {
    // when new system data arrives
    if (sData) {
      console.log('systeminfo all: ', sData);
      const newParsedData = [];
      // todo: internet. storage IOPS.
      if (Array.isArray(sData.diskLayout)) {
        const diskLayoutData = sData.diskLayout;
        diskLayoutData.forEach((diskData, index) => {
          const items = [];
          let ssdOrHdStorage;
          if (diskData.type) {
            if (diskData.type.toUpperCase().includes('SSD')) {
              ssdOrHdStorage = 'SSD';
            } else if (diskData.type.toUpperCase().includes('HDD')) {
              ssdOrHdStorage = 'HDD';
            }
          }
          if (!ssdOrHdStorage && diskData.name) {
            if (diskData.name.toUpperCase().includes('SSD')) {
              ssdOrHdStorage = 'SSD';
            } else if (diskData.type.toUpperCase().includes('HDD')) {
              ssdOrHdStorage = 'HDD';
            }
          }
          if (!ssdOrHdStorage) {
            ssdOrHdStorage = 'Unknown';
          }
          const size = diskData.size ? Math.round(diskData.size * 1e-9) : '';
          items.push({ label: 'SSD/HDD', value: `${ssdOrHdStorage}` });
          items.push({ label: 'Sub type', value: `${diskData.type}` });
          items.push({ label: 'Size (GBs)', value: `${size}` });
          items.push({
            label: 'Name',
            value: `${diskData.name}`,
          });
          const newItem: LabelValuesSectionProps = {
            sectionTitle: `storage device ${index}`,
            items,
          };
          newParsedData.push(newItem);
        });
      }
      if (Array.isArray(sData.memLayout)) {
        const memLayoutData = sData.memLayout;
        memLayoutData.forEach((memData, index) => {
          const items = [];
          const size = memData.size ? Math.round(memData.size * 1e-9) : '';
          items.push({ label: 'Size (GBs)', value: `${size}` });
          items.push({ label: 'Type', value: `${memData.type}` });
          items.push({
            label: 'Name',
            value: `${memData.manufacturer}`,
          });
          const newItem: LabelValuesSectionProps = {
            sectionTitle: `Memory device ${index}`,
            items,
          };
          newParsedData.push(newItem);
        });
      }
      if (sData.os) {
        const osData = sData.os;
        const items = [];
        items.push({ label: 'Name', value: `${osData.codename}` });
        items.push({ label: 'Release', value: `${osData.release}` });
        items.push({ label: 'Architecture', value: `${osData.arch}` });
        if (sData.system) {
          items.push({
            label: 'Name',
            value: `${sData.system.manufacturer} ${sData.system.model}`,
          });
        }
        const newItem: LabelValuesSectionProps = {
          sectionTitle: 'System',
          items,
        };
        newParsedData.push(newItem);
      }
      setParsedData(newParsedData);
    }
  }, [sData]);

  useEffect(() => {
    // on load, refresh the static data
    getData();
  }, []);

  if (!sData) {
    return <div>Fetching...</div>; // Get design spec for this case
  }
  return <LabelValues title="System specifications" items={sParsedData} />;
};
