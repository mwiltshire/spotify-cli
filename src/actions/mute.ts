import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi) => {
  await spotify.setVolume(0);
};

export const mute = createAction(handler);
