import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi, args: [string]) => {
  const [query] = args;
  const res = await spotify.searchArtists(query);
  await spotify.play({
    context_uri: res.body.artists?.items[0].uri as string
  });
};

export const playArtist = createAction(handler);
