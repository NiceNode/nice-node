export type MachineJSON = {
  Name: string;
  Default: boolean;
  Created: string;
  Running: boolean;
  Starting: boolean;
  LastUp: string;
  Stream: string;
  VMType: string;
  CPUs: number;
  Memory: string;
  DiskSize: string;
  Port: number;
  RemoteUsername: string;
  IdentityPath: string;
};

/**
 * Follows format and types from Podman's API
 * https://docs.podman.io/en/latest/_static/api.html?version=v4.4#tag/containers/operation/ContainersStatsAllLibpod
 *
 * This is starting as a subset of all the values because we are currently using
 * Podman CLI instead of their API.
 */
export type ContainerStats = {
  ContainerID: string;
  Name: string;
  // CPUTime: number;
  PercCPU: number;
  // MemUsage: string;
  MemPerc: number;
  // NetInput: number;
  // BlockInput: number;
  // BlockOutput: number;
  // PIDs: number;
};
