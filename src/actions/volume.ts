import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from '../utils/injectSpotify';
import logger from '../utils/logger';

const matchNumberBetween0And100 = (number: string) =>
  /^\d+$/.test(number) && Number(number) >= 0 && Number(number) <= 100;

const action = async (spotify: SpotifyWebApi, options: any[]) => {
  const [percent] = options;
  if (!percent) {
    throw new Error('Volume percent is required!');
  }

  if (!matchNumberBetween0And100(percent)) {
    throw new Error(`Invalid percent argument.

Received: '${percent}'

Percent must be a number between 0 and 100. E.g.:

spotify volume 99
`);
  }

  await spotify.setVolume(Number(percent));
};

const volume = async (...options: any[]) => {
  try {
    const handler = await injectSpotify(action);
    await handler(options);
  } catch (error) {
    logger.error(error?.message);
  }
};

export default volume;
