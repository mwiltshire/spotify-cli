import config from '../config';
import logger from '../utils/logger';
import createAction from '../create-action';

const handler = async () => {
  logger.info(`Config file path: ${config.path}`);
};

export const configPath = createAction(handler);
