import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from './injectSpotify';
import logger from './logger';

const action = async (spotify: SpotifyWebApi) => {
  await spotify.setVolume(0);
};

const mute = async () => {
  try {
    const handler = await injectSpotify(action);
    await handler();
  } catch (error) {
    logger.error(error?.message);
  }
};

export default mute;
