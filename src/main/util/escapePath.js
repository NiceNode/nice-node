/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
// npm escape-path-with-spaces at https://github.com/jy95/escape-path-with-spaces
import os from 'node:os';

// to detect on with os user had used path.resolve(...)
const is_posix_os = os.platform() !== 'win32';
const version = os.release();

// For some windows version (Windows 10 v1803), it is not useful to escape spaces in path
// https://docs.microsoft.com/en-us/windows/release-information/
const windows_version_regex = /(\d+\.\d+)\.(\d+)/;
const should_not_escape = (major_release = '', os_build = '') =>
  /1\d+\.\d+/.test(major_release) && Number(os_build) >= 17134.1184;

export const escapePath = (given_path) => {
  return is_posix_os
    ? // for posix path, escape is simple
      given_path.replace(/(\s+)/g, '\\$1')
    : // for windows, it depend of the build
      should_not_escape(...windows_version_regex.exec(version).splice(1))
      ? // on major version, no need to escape anymore
        // https://support.microsoft.com/en-us/help/4467268/url-encoded-unc-paths-not-url-decoded-in-windows-10-version-1803-later
        given_path
      : // on older version, replace space with symbol %20
        given_path.replace(/(\s+)/g, '%20');
};
