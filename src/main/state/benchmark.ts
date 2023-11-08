import { send } from '../messenger';
import store from './store';

export const BENCHMARKS_KEY = 'benchmarks';

export interface Benchmark {
  type: string;
  timestamp: number;
  results: any;
}

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  const benchmarks = store.get(BENCHMARKS_KEY);
  if (!benchmarks) {
    store.set(BENCHMARKS_KEY, []);
  }

  // Notify the UI when values change
  store.onDidChange(BENCHMARKS_KEY, () => {
    send(BENCHMARKS_KEY);
  });
};
initialize();

export const getBenchmarks = () => {
  const benchmarks = store.get(BENCHMARKS_KEY) || [];
  return benchmarks;
};

export const addBenchmark = (benchmark: Benchmark) => {
  const benchmarks = store.get(BENCHMARKS_KEY) || [];
  benchmarks.unshift(benchmark);
  store.set(BENCHMARKS_KEY, benchmarks);
  return benchmarks;
};
