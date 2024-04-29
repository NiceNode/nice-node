import { execAwait } from '../execHelper';
import logger from '../logger';

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
  try {
    logger.info(`${VERSION_COMMAND} result: ${await getVersion()}`);
  } catch (err) {
    logger.error(err);
    logger.info('Unable to get the docker compose version.');
  }
};
