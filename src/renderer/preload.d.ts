/* eslint-disable no-unused-vars */
import { ElectronHandler } from '../main/preload';

// Since we are using Chrome only in Electron and this is not a web standard yet,
//  we extend window.performance to include Chrome's memory stats
// interface PerformanceNN extends Performance {
//   memory?: {
//     /** The maximum size of the heap, in bytes, that is available to the context. */
//     jsHeapSizeLimit: number;
//     /** The total allocated heap size, in bytes. */
//     totalJSHeapSize: number;
//     /** The currently active segment of JS heap, in bytes. */
//     usedJSHeapSize: number;
//   };
// }
declare global {
  interface Window {
    electron: ElectronHandler;
  }
}
//     performance: PerformanceNN;
//   }
// }

export {};
