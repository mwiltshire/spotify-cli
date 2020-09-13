import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const mute = async (spotify: SpotifyWebApi) => {
  await spotify.setVolume(0);
};

export default createAction(mute);
