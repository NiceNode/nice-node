import React, { useEffect, useState } from 'react';
import si from 'systeminformation';

import electron from '../../../electronGlobal';
import { container } from './systemMonitor.css';
import HorizontalLine from '../HorizontalLine/HorizontalLine';

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
  const [sData, setData] = useState<si.Systeminformation.StaticData>(undefined);

  const getData = async () => {
    setData(await electron.getSystemInfo());
  };

  useEffect(() => {
    // on load, refresh the static data
    getData();
  }, []);

  return (
    <div className={container}>
      <div>{JSON.stringify(sData)}</div>
      {/* <h2>{title}</h2>
      {items &&
        items.map((item) => (
          <React.Fragment key={item.checkTitle}>
            <SystemMonitorItem {...item} />
            <HorizontalLine />
          </React.Fragment>
        ))} */}
    </div>
  );
};
