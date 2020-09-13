import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const playTrack = async (spotify: SpotifyWebApi, args: [any, string[]]) => {
  const [, [query]] = args;
  const res = await spotify.searchTracks(query);
  await spotify.play({
    uris: [res.body.tracks?.items[0].uri as string]
  });
};

export default createAction(playTrack);
