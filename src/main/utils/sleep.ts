/**
 * Inspired by https://github.com/sorenlouv/await-sleep
 * Original code has no explicit license
 *
 * Creates a promise that resolves after the specified number of milliseconds
 * @param ms The number of milliseconds to sleep
 * @returns A promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
