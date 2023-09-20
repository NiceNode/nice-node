/* eslint-disable consistent-return */
/* eslint-disable func-names */
/**
 * Use this file like so:
 *  const libPodDockerode = new LibpodDockerode();
 *  libPodDockerode.enhancePrototypeWithLibPod();
 */
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

import Dockerode from 'dockerode';

export interface PodContainerInfo {
  Id: string;
  Names: string;
  Status: string;
}

export interface PodInfo {
  Cgroup: string;
  Containers: PodContainerInfo[];
  Created: string;
  Id: string;
  InfraId: string;
  Labels: { [key: string]: string };
  Name: string;
  Namespace: string;
  Networks: string[];
  Status: string;
}

export interface PodInspectInfo {
  CgroupParent: string;
  CgroupPath: string;
  Containers: PodContainerInfo[];
  Created: string;
  Hostname: string;
  Id: string;
  InfraContainerId: string;
  memory_limit: number;
  memory_swap: number;
  Name: string;
  Namespace: string;
  NumContainers: number;
  security_opt: string[];
  SharedNamespaces: string[];
  State: string;
  volumes_from: string[];
}

export interface PlayKubePodInfo {
  ContainerErrors: string[];
  Containers: string[];
  Id: string;
  InitContainers: string[];
  Logs: string[];
}

export interface PlayKubeInfo {
  Pods: PlayKubePodInfo[];
  RmReport: { Err: string; Id: string }[];
  Secrets: { CreateReport: { ID: string } }[];
  StopReport: { Err: string; Id: string }[];
  Volumes: { Name: string }[];
}

export interface PodCreatePortOptions {
  host_ip: string;
  container_port: number;
  host_port: number;
  protocol: string;
  range: number;
}

export interface PodCreateOptions {
  name: string;
  portmappings?: PodCreatePortOptions[];
}

export interface ContainerCreateOptions {
  command?: string[];
  entrypoint?: string | string[];
  env?: { [key: string]: string };
  pod?: string;
  hostname?: string;
  image?: string;
  name?: string;
}

// API of libpod that we want to expose on our side
export interface LibPod {
  createPod(podOptions: PodCreateOptions): Promise<{ Id: string }>;
  createPodmanContainer(
    containerCreateOptions: ContainerCreateOptions,
  ): Promise<{ Id: string; Warnings: string[] }>;
  listPods(): Promise<PodInfo[]>;
  prunePods(): Promise<void>;
  getPodInspect(podId: string): Promise<PodInspectInfo>;
  startPod(podId: string): Promise<void>;
  stopPod(podId: string): Promise<void>;
  removePod(podId: string): Promise<void>;
  restartPod(podId: string): Promise<void>;
  generateKube(names: string[]): Promise<string>;
  playKube(yamlContentFilePath: string): Promise<PlayKubeInfo>;
  pruneAllImages(dangling: boolean): Promise<void>;
}

// tweak Dockerode by adding the support of libpod API
// WARNING: make sure to not override existing functions
export class LibpodDockerode {
  // setup the libpod API
  // eslint-disable-next-line class-methods-use-this
  enhancePrototypeWithLibPod() {
    // eslint-disable-next-line
    const prototypeOfDockerode = Dockerode.prototype as any;

    // add createPodmanContainer
    prototypeOfDockerode.createPodmanContainer = function (
      containerCreateOptions: ContainerCreateOptions,
    ) {
      const optsf = {
        path: '/v4.2.0/libpod/containers/create',
        method: 'POST',
        options: containerCreateOptions,
        statusCodes: {
          201: true,
          204: true,
          400: 'bad parameter in request',
          404: 'no such container',
          409: 'status conflict',
          500: 'server error',
        },
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add listPods
    prototypeOfDockerode.listPods = function () {
      const optsf = {
        path: '/v4.2.0/libpod/pods/json',
        method: 'GET',
        options: {},
        statusCodes: {
          200: true,
          400: 'bad parameter',
          500: 'server error',
        },
      };
      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add pruneAllImages
    prototypeOfDockerode.pruneAllImages = function () {
      const optsf = {
        path: '/v4.2.0/libpod/images/prune?all=true&', // this works
        // For some reason the below doesn't work? TODO / help / fixme
        // options: {all: 'true'}, // this doesn't work
        method: 'POST',
        statusCodes: {
          200: true,
          400: 'bad parameter',
          500: 'server error',
        },
      };
      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add createPod
    prototypeOfDockerode.createPod = function (podOptions: PodCreateOptions) {
      const optsf = {
        path: '/v4.2.0/libpod/pods/create',
        method: 'POST',
        options: podOptions,
        statusCodes: {
          201: true,
          204: true,
          400: 'bad parameter in request',
          409: 'status conflict',
          500: 'server error',
        },
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add getPodInspect
    prototypeOfDockerode.getPodInspect = function (podId: string) {
      const optsf = {
        path: `/v4.2.0/libpod/pods/${podId}/json`,
        method: 'GET',
        statusCodes: {
          200: true,
          204: true,
          404: 'no such pod',
          500: 'server error',
        },
        options: {},
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add startPod
    prototypeOfDockerode.startPod = function (podId: string) {
      const optsf = {
        path: `/v4.2.0/libpod/pods/${podId}/start?`,
        method: 'POST',
        statusCodes: {
          200: true,
          204: true,
          304: 'pod already stopped',
          404: 'no such pod',
          409: 'unexpected error',
          500: 'server error',
        },
        options: {},
      };

      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        this.modem.dial(optsf, (err: any, data: unknown) => {
          if (err) {
            if (err?.statusCode === 409 && err?.json) {
              // check that err.json is a JSON
              if (err.json.Errs) {
                return reject(err.json.Errs.join(' '));
              }
            }

            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add stopPod
    prototypeOfDockerode.stopPod = function (podId: string) {
      const optsf = {
        path: `/v4.2.0/libpod/pods/${podId}/stop?`,
        method: 'POST',
        statusCodes: {
          200: true,
          204: true,
          304: 'pod already stopped',
          404: 'no such pod',
          500: 'server error',
        },
        options: {},
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add restartPod
    prototypeOfDockerode.restartPod = function (podId: string) {
      const optsf = {
        path: `/v4.2.0/libpod/pods/${podId}/restart?`,
        method: 'POST',
        statusCodes: {
          200: true,
          204: true,
          304: 'pod already stopped',
          404: 'no such pod',
          500: 'server error',
        },
        options: {},
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add removePod
    prototypeOfDockerode.removePod = function (podId: string) {
      const optsf = {
        path: `/v4.2.0/libpod/pods/${podId}`,
        method: 'DELETE',
        statusCodes: {
          200: true,
          204: true,
          304: 'pod already stopped',
          404: 'no such pod',
          500: 'server error',
        },
        options: {},
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add prunePods
    prototypeOfDockerode.prunePods = function () {
      const optsf = {
        path: '/v4.2.0/libpod/pods/prune',
        method: 'POST',
        statusCodes: {
          200: true,
          500: 'server error',
        },
        options: {},
      };
      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

    // add generateKube
    prototypeOfDockerode.generateKube = function (names: string[]) {
      // transform array into a list of queries
      const queries = names
        .map((name) => {
          return `names=${name}`;
        })
        .join('&');

      const path = `/v4.2.0/libpod/generate/kube?${queries}`;
      const optsf = {
        path,
        method: 'GET',
        options: {},
        statusCodes: {
          200: true,
          500: 'server error',
        },
      };
      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          if (Buffer.isBuffer(data)) {
            resolve((data as Buffer).toString());
          } else {
            resolve(data);
          }
        });
      });
    };

    // add playKube
    prototypeOfDockerode.playKube = function (yamlContentFilePath: string) {
      const optsf = {
        path: '/v4.2.0/libpod/play/kube',
        method: 'POST',
        file: yamlContentFilePath,
        statusCodes: {
          200: true,
          204: true,
          500: 'server error',
        },
        options: {},
      };

      return new Promise((resolve, reject) => {
        this.modem.dial(optsf, (err: unknown, data: unknown) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };
  }
}
