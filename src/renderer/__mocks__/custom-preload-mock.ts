/* eslint-disable @typescript-eslint/no-explicit-any */
export const getGethStatus = (): string => {
  return 'running';
};

export const startGeth = (): void => {};

export const stopGeth = (): void => {};

export const getSystemFreeDiskSpace = (): number => {
  return 2000;
};

export const getStoreValue = (): any => {
  return true;
};

export const getGethLogs = (): any => {
  return [{ level: 'info', message: 'one log' }];
};

export const getGethErrorLogs = (): any => {
  return [{ level: 'info', message: 'one log' }];
};

export const getRendererProcessUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

export const getMainProcessUsage = (): any => {
  return { cpu: 200000, memory: 'high' };
};

export const getDebugInfo = (): any => {
  return { niceNodeVersion: '0.0.0-zeta' };
};

export const checkSystemHardware = (): string[] => {
  return ['Yo internet no bueno'];
};

export const SENTRY_DSN = 'fake_sentry_dsn';
