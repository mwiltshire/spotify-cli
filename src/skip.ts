import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from './injectSpotify';
import logger from './logger';

const action = async (spotify: SpotifyWebApi, options: any[]) => {
  const [direction] = options;
  if (!direction || direction === 'forward') {
    await spotify.skipToNext();
  } else if (direction === 'back') {
    await spotify.skipToPrevious();
  } else {
    throw new Error(
      `Unrecognized direction argument.
      
Found direction: ${direction}
      
Please specify either 'forward' or 'back' or leave empty to skip to the next track by default. E.g.:

spotify skip forward
spotify skip back
spotify skip
`
    );
  }
};

const skip = async (...options) => {
  try {
    const handler = await injectSpotify(action);
    await handler(options);
  } catch (error) {
    logger.error(error?.message);
  }
};

export default skip;
