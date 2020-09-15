import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi) => {
  await spotify.play();
};

export const play = createAction(handler);
