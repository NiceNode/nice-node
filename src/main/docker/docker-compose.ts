import logger from '../logger';
import { execAwait } from '../execHelper';

const VERSION_COMMAND = 'docker-compose --version';

export const getVersion = async () => {
  const { stdout, stderr } = await execAwait(VERSION_COMMAND, {
    log: true,
  });
  return `${stdout + stderr}`;
};

/**
 * Only logs the docker compose version, if available
 */
export const initialize = async () => {
  // run "docker-compose --version"
  logger.info(`${VERSION_COMMAND} result: ${await getVersion()}`);
};
