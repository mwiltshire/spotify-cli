import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from '../utils/injectSpotify';
import logger from '../utils/logger';

// TODO: Support targeting specific device_id, default repeat mode of track??

const action = async (spotify: SpotifyWebApi, options: any[]) => {
  const [mode] = options;

  if (!['track', 'context', 'off'].includes(mode)) {
    throw new Error(`Invalid repeat mode.

Received mode: ${mode}
  
Please specify a repeat mode of 'track', 'context' or 'off'. E.g.:

spotify repeat track
spotify repeat context
spotify repeat off
`);
  }

  await spotify.setShuffle({ state: mode });
};

const repeat = async (...options: any[]) => {
  try {
    const handler = await injectSpotify(action);
    await handler(options);
  } catch (error) {
    logger.error(error?.message);
  }
};

export default repeat;
