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

export const SENTRY_DSN = 'fake_sentry_dsn';
