import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi, args: [string]) => {
  const [query] = args;
  const res = await spotify.searchAlbums(query);
  await spotify.play({
    context_uri: res.body.albums?.items[0].uri as string
  });
};

export const playAlbum = createAction(handler);
