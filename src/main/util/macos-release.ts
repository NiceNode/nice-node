/**
 * Based from
 * https://github.com/sindresorhus/macos-release/blob/main/index.js
 */
import os from 'node:os';

const nameMap = new Map([
  [22, ['Ventura', '13']],
  [21, ['Monterey', '12']],
  [20, ['Big Sur', '11']],
  [19, ['Catalina', '10.15']],
  [18, ['Mojave', '10.14']],
  [17, ['High Sierra', '10.13']],
  [16, ['Sierra', '10.12']],
  [15, ['El Capitan', '10.11']],
  [14, ['Yosemite', '10.10']],
  [13, ['Mavericks', '10.9']],
  [12, ['Mountain Lion', '10.8']],
  [11, ['Lion', '10.7']],
  [10, ['Snow Leopard', '10.6']],
  [9, ['Leopard', '10.5']],
  [8, ['Tiger', '10.4']],
  [7, ['Panther', '10.3']],
  [6, ['Jaguar', '10.2']],
  [5, ['Puma', '10.1']],
]);

const darwinToMacOsVersion = (
  darwinRelease: string,
): { name: string; version: string } => {
  const release = Number((darwinRelease || os.release()).split('.')[0]);

  const [name, version] = nameMap.get(release) || ['Unknown', ''];

  return {
    name,
    version,
  };
};

export default darwinToMacOsVersion;
