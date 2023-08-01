/** ********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************** */
import { spawn } from 'node:child_process';
// import type { Logger } from '@tmpwip/extension-api';
// import { configuration } from '@tmpwip/extension-api';
import { isMac, isWindows } from './util';

/**
 * macOS and Windows only
 * @returns the default podman install path. Use getInstallationPath() for
 * a more rebust method to get an env.path with podman included.
 */
export function getDefaultPodmanPath(): string | undefined {
  if (isWindows()) {
    return 'c:\\Program Files\\RedHat\\Podman';
  }
  if (isMac()) {
    return '/opt/podman';
  }
  return undefined;
}

const macosExtraPath =
  '/usr/local/bin:/opt/homebrew/bin:/opt/local/bin:/opt/podman/bin';

/**
 * macOS and Windows only
 * @returns an env.PATH variable with the podman path at the front
 */
export function getInstallationPath(): string {
  const { env } = process;
  if (isWindows()) {
    return `c:\\Program Files\\RedHat\\Podman;${env.PATH}`;
  }
  if (isMac()) {
    if (!env.PATH) {
      return macosExtraPath;
    }
    return env.PATH.concat(':').concat(macosExtraPath);
  }
  return env.PATH || '';
}

// Get the Podman binary path from configuration podman.binary.path
// return string or undefined
export function getCustomBinaryPath(): string | undefined {
  // return configuration.getConfiguration('podman').get('binary.path');
  return undefined;
}

export function getPodmanCli(): string {
  // If we have a custom binary path regardless if we are running Windows or not
  const customBinaryPath = getCustomBinaryPath();
  if (customBinaryPath) {
    return customBinaryPath;
  }

  if (isWindows()) {
    return 'podman.exe';
  }
  return 'podman';
}
/**
 * @param shell ex. 'powershell.exe'
 */
export interface ExecOptions {
  // logger?: Logger;
  env?: typeof process.env;
  shell?: boolean | string;
}

export function execPromise(
  command: string,
  args?: string[],
  options?: ExecOptions
): Promise<string> {
  let env = { ...process.env }; // clone original env object

  // In production mode, applications don't have access to the 'user' path like brew
  if (isMac() || isWindows()) {
    // env.PATH = `/opt/podman/bin:${getInstallationPath()}`;
    env.PATH = getInstallationPath();
    // if (isWindows()) {
    //   // Escape any whitespaces in command
    //   // eslint-disable-next-line no-param-reassign
    //   command = `"${command}"`;
    // }
  }

  // } else if (env.FLATPAK_ID) {
  //   // need to execute the command on the host
  //   args = ['--host', command, ...args];
  //   command = 'flatpak-spawn';
  // }

  if (options?.env) {
    env = Object.assign(env, options.env);
  }

  let shellValue: boolean | string = true;
  if (options?.shell) {
    shellValue = options.shell;
  } else if (isWindows()) {
    // see https://stackoverflow.com/a/61219838 for example/background
    shellValue = 'powershell.exe';
  }

  return new Promise((resolve, reject) => {
    let stdOut = '';
    let stdErr = '';
    const process = spawn(command, args, { env, shell: shellValue });
    process.on('error', (error) => {
      let content = '';
      if (stdOut && stdOut !== '') {
        content += `${stdOut}\n`;
      }
      if (stdErr && stdErr !== '') {
        content += `${stdErr}\n`;
      }
      reject(new Error(content + error));
    });
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', (data) => {
      stdOut += data;
    });
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', (data) => {
      stdErr += data;
      console.error(data);
    });

    process.on('close', (exitCode) => {
      let content = '';
      if (stdOut && stdOut !== '') {
        content += `${stdOut}\n`;
      }
      if (stdErr && stdErr !== '') {
        content += `${stdErr}\n`;
      }

      if (exitCode !== 0) {
        reject(content);
      }
      resolve(stdOut.trim());
    });
  });
}

export interface InstalledPodman {
  version: string;
}

export async function getPodmanInstallation(): Promise<
  InstalledPodman | undefined
> {
  try {
    const versionOut = await execPromise(getPodmanCli(), ['--version']);
    const versionArr = versionOut.split(' ');
    const version = versionArr[versionArr.length - 1];
    return { version };
  } catch (err) {
    // no podman binary
    return undefined;
  }
}
