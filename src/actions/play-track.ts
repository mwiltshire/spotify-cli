import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi, args: [string]) => {
  const [query] = args;
  const res = await spotify.searchTracks(query);
  await spotify.play({
    uris: [res.body.tracks?.items[0].uri as string]
  });
};

export const playTrack = createAction(handler);
