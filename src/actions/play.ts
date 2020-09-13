import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const play = async (spotify: SpotifyWebApi) => {
  await spotify.play();
};

export default createAction(play);
