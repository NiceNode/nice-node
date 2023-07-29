import { getInstallationPath } from './podman-desktop/podman-cli';

/**
 * In production(packaged) mode, applications don't have access to the 'user'
 * path like brew
 * @returns process.env with env.PATH set to installed podman location
 */
export const getPodmanEnvWithPath = () => {
  return { ...process.env, PATH: getInstallationPath() };
};
