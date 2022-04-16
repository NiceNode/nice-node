export const getGethStatus = (): string => {
  return 'running';
};

export const startGeth = (): void => {};

export const stopGeth = (): void => {};

export const getGethDiskUsed = (): number => {
  return 100;
};

export const getSystemFreeDiskSpace = (): number => {
  return 2000;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStoreValue = (): any => {
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGethLogs = (): any => {
  return [{ level: 'info', message: 'one log' }];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGethErrorLogs = (): any => {
  return [{ level: 'info', message: 'one log' }];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRendererProcessUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMainProcessUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNodeUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

export const checkSystemHardware = (): string[] => {
  return ['Yo internet no bueno'];
};

export const SENTRY_DSN = 'fake_sentry_dsn';
