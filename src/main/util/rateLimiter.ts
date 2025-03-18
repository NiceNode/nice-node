/**
 * Code initially taken from https://github.com/wankdanker/node-function-rate-limit
 * MIT License - Copyright (c) 2012 Daniel L. VerWeire
 */

/**
 * Rate limiting utility function
 * @param limitCount Maximum number of calls allowed within the interval
 * @param limitInterval Time interval in milliseconds
 * @param fn Function to be rate limited
 * @returns Rate limited version of the function
 */
export function rateLimit<T extends (...args: any[]) => any>(
  limitCount: number,
  limitInterval: number,
  fn: T
): T {
  type Context = ThisParameterType<T>;
  type Args = Parameters<T>;
  type QueueItem = [Context, Args];
  
  const fifo: QueueItem[] = [];
  let count = limitCount;

  function callNext(args?: QueueItem) {
    setTimeout(() => {
      if (fifo.length > 0) {
        callNext();
      } else {
        count = count + 1;
      }
    }, limitInterval);

    const callArgs = fifo.shift();

    // if there is no next item in the queue
    // and we were called with args, trigger function immediately
    if (!callArgs && args) {
      fn.apply(args[0], args[1]);
      return;
    }

    if (callArgs) {
      fn.apply(callArgs[0], callArgs[1]);
    }
  }

  return function rateLimitedFunction(this: Context, ...args: Args): ReturnType<T> {
    const ctx = this;
    
    if (count <= 0) {
      fifo.push([ctx, args]);
      return undefined as ReturnType<T>;
    }

    count = count - 1;
    callNext([ctx, args]);
    return undefined as ReturnType<T>;
  } as T;
} 