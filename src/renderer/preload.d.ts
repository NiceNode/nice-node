declare global {
  interface Window {
    electron: {
      SENTRY_DSN: string;
      ipcRenderer: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(channel: string, func: (...args: any[]) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(channel: string, func: (...args: any[]) => void): void;
      };
      getGethStatus(): string;
      startGeth(): void;
      stopGeth(): void;
      deleteGethDisk(): boolean;
      getGethDiskUsed(): number;
      getSystemFreeDiskSpace(): number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getDebugInfo(): any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getStoreValue(key: string): any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStoreValue(key: string, value: any): void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getGethLogs(): any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getGethErrorLogs(): any;
    };
  }
}

export {};
