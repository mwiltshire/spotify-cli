import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi) => {
  await spotify.pause();
};

export const pause = createAction(handler);
