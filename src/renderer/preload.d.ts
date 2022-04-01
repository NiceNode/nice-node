declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(channel: string, func: (...args: any[]) => void): void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        once(channel: string, func: (...args: any[]) => void): void;
      };
      getGethStatus(): string;
      startGeth(): void;
      stopGeth(): void;
      getGethDiskUsed(): number;
      getSystemFreeDiskSpace(): number;
      getDebugInfo(): any;
    };
  }
}

export {};
