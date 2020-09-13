import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const playArtist = async (spotify: SpotifyWebApi, args: [any, string[]]) => {
  const [, [query]] = args;
  const res = await spotify.searchArtists(query);
  await spotify.play({
    context_uri: res.body.artists?.items[0].uri as string
  });
};

export default createAction(playArtist);
