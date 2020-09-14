import config from '../config';
import logger from '../utils/logger';
import createAction from '../create-action';

const configPath = async () => {
  logger.info(`Config file path: ${config.path}`);
};

export default createAction(configPath);
