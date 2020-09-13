import injectSpotify from './utils/inject-spotify';
import logger from './utils/logger';

type ActionHandler = (...args: any[]) => Promise<any>;

const createAction = (actionHandler: ActionHandler) => {
  return async (...args: any[]) => {
    try {
      const handler = await injectSpotify(actionHandler);
      await handler(args);
    } catch (error) {
      logger.error(error?.message);
    }
  };
};

export default createAction;
