import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from '../utils/injectSpotify';
import logger from '../utils/logger';

const action = async (spotify: SpotifyWebApi, args: [any, string[]]) => {
  const [, [query]] = args;
  const res = await spotify.searchArtists(query);
  await spotify.play({
    context_uri: res.body.artists?.items[0].uri as string
  });
};

const playArtist = async (...args: string[]) => {
  try {
    const handler = await injectSpotify(action);
    await handler(args);
  } catch (error) {
    logger.error(error?.message);
  }
};

export default playArtist;
