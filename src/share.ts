import SpotifyWebApi from 'spotify-web-api-node';
import clipboard from 'clipboardy';
import injectSpotify from './injectSpotify';
import logger from './logger';

const action = async (spotify: SpotifyWebApi) => {
  const {
    body: { item }
  } = await spotify.getMyCurrentPlayingTrack();

  if (!item) {
    throw new Error('No playback object available!');
  }

  const shareLink = `https://open.spotify.com/track/${item.id}`;
  clipboard.writeSync(shareLink);
  logger.spotify(
    `Copied song link to clipboard: https://open.spotify.com/track/${item.id}`
  );
};

const share = async () => {
  try {
    const handler = await injectSpotify(action);
    await handler();
  } catch (error) {
    logger.error(error?.message);
  }
};

export default share;
