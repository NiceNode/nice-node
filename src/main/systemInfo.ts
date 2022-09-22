import si from 'systeminformation';

export type SystemData = si.Systeminformation.StaticData;
// const getCpuInfo = async (): Promise<si.Systeminformation.CpuData> => {
//   const data = await si.cpu();
//   console.log('Cpu data: ', data);
//   return data;
// };

// const getMemInfo = async (): Promise<si.Systeminformation.MemData> => {
//   const data = await si.mem();
//   console.log('mem data: ', data);
//   return data;
// };

// const getBatteryInfo = async (): Promise<si.Systeminformation.BatteryData> => {
//   const data = await si.battery();
//   console.log('battery data: ', data);
//   return data;
// };

// const getGraphicsInfo =
//   async (): Promise<si.Systeminformation.GraphicsData> => {
//     const data = await si.graphics();
//     console.log('graphics data: ', data);
//     return data;
//   };

// const getOperatingSystemInfo =
//   async (): Promise<si.Systeminformation.OsData> => {
//     const data = await si.osInfo();
//     console.log('osInfo data: ', data);
//     return data;
//   };

// const getCurrentLoadInfo =
//   async (): Promise<si.Systeminformation.CurrentLoadData> => {
//     const data = await si.currentLoad();
//     console.log('currentLoad data: ', data);
//     return data;
//   };

// const getDiskLayoutInfo = async (): Promise<
//   si.Systeminformation.DiskLayoutData[]
// > => {
//   const data = await si.diskLayout();
//   console.log('diskLayout data: ', data);
//   return data;
// };

// const getUsbInfo = async (): Promise<si.Systeminformation.UsbData[]> => {
//   const data = await si.usb();
//   console.log('usb data: ', data);
//   return data;
// };

// const getAllStaticInfo = async (): Promise<SystemData> => {
//   const data = await si.getStaticData();
//   console.log('getStaticData data: ', data);
//   return data;
// };

/**
 * Returns detailed system information and sends async info
 * over a channel to the UI when it is determined.
 */
export const getSystemInfo = async (): Promise<SystemData> => {
  const data = await si.getStaticData();
  console.log('getStaticData data: ', JSON.stringify(data, null, 4));
  return data;
  // start monitoring sys_usage?
  // getCpuInfo();
  // getMemInfo();
  // getBatteryInfo();
  // getGraphicsInfo();
  // getOperatingSystemInfo();
  // getCurrentLoadInfo();
  // getDiskLayoutInfo();
  // getUsbInfo();
  // return getAllStaticInfo();
};

export const initialize = async () => {
  // start monitoring sys_usage?
  getSystemInfo();
};
