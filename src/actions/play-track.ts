import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';
import logger from '../utils/logger';

const getSearchQuery = (query: string, options) => {
  return Object.entries(options).reduce((acc, [k, v]) => {
    if (v) {
      acc = `${acc} ${k}:${v}`;
      return acc;
    }
    return acc;
  }, `track:${query}`);
};

const handler = async (spotify: SpotifyWebApi, args: [string, any]) => {
  const [query, options = {}] = args;
  let searchQuery = query;

  if (options.artist || options.album) {
    searchQuery = getSearchQuery(query, {
      artist: options.options,
      album: options.album
    });
  }

  const res = await spotify.searchTracks(searchQuery);

  const trackObject = res.body.tracks?.items[0];

  if (!trackObject) {
    logger.info(`Couldn't find any tracks matching ${query}!`);
    return;
  }

  await spotify.play({ uris: [trackObject.uri as string] });

  logger.spotify(
    `Playing ${trackObject.name} by ${trackObject.artists[0].name}`
  );
};

export const playTrack = createAction(handler);
