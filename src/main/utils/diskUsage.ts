/**
 * Inspired by node-du (https://github.com/rvagg/node-du)
 *
 * Original License (MIT):
 * Copyright (c) 2012 Rod Vagg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Calculates the size of a directory or file recursively
 * @param dir Path to directory or file
 * @param options Optional settings (disk: boolean to use block size instead of file size)
 * @returns Promise<number> Total size in bytes
 */
async function calculateDiskUsage(
  dir: string,
  options: { disk?: boolean } = {},
): Promise<number> {
  const stat = await fs.lstat(dir);

  // Base size calculation
  const size = options.disk ? 512 * stat.blocks : stat.size;

  if (!stat.isDirectory()) {
    return size;
  }

  try {
    const files = await fs.readdir(dir);
    const sizes = await Promise.all(
      files.map(
        (file) =>
          calculateDiskUsage(path.join(dir, file), options).catch(() => 0), // Handle permission errors or other issues for individual files
      ),
    );

    return sizes.reduce((total, s) => total + s, size);
  } catch (err) {
    // If we can't read the directory, return the current known size
    return size;
  }
}

export default calculateDiskUsage;
