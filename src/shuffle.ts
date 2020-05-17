import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from './injectSpotify';
import logger from './logger';

// TODO: Support targeting specific device_id

const action = async (spotify: SpotifyWebApi, options: any[]) => {
  const [state] = options;

  if (state !== 'on' || state !== 'off') {
    throw new Error(`Invalid shuffle state.

Received state: ${state}
  
Please specify 'on' to activate playback shuffle or 'off' to deactivate it. E.g.:

spotify shuffle on
spotify shuffle off
`);
  }

  await spotify.setShuffle({ state: state === 'on' });
};

const shuffle = async (...options: any[]) => {
  try {
    const handler = await injectSpotify(action);
    await handler(options);
  } catch (error) {
    logger.error(error?.message);
  }
};

export default shuffle;
