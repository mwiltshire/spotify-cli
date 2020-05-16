import SpotifyWebApi from 'spotify-web-api-node';
import injectSpotify from './injectSpotify';

const action = async (spotify: SpotifyWebApi) => {
  await spotify.play();
};

const play = async () => {
  try {
    const handler = await injectSpotify(action);
    await handler();
  } catch (error) {
    console.log(error.message);
  }
};

export default play;
