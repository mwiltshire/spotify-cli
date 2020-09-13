import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const pause = async (spotify: SpotifyWebApi) => {
  await spotify.pause();
};

export default createAction(pause);
